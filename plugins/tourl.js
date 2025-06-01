import fetch from "node-fetch";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
import { writeFile, unlink } from "fs/promises";
import config from "../config.cjs";

const MAX_FILE_SIZE_MB = 200;

async function uploadMedia(buffer) {
  try {
    const { ext } = await fileTypeFromBuffer(buffer);
    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, `file.${ext}`);
    bodyForm.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: bodyForm,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}: ${res.statusText}`);
    }

    const data = await res.text();
    return data;
  } catch (error) {
    console.error("Error during media upload:", error);
    throw new Error("Failed to upload media");
  }
}

const tourl = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const validCommands = ["tourl", "geturl", "upload", "url"];

    if (!validCommands.includes(cmd)) return;

    if (!m.quoted || !["imageMessage", "videoMessage", "audioMessage"].includes(m.quoted.mtype)) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, *Toxic-MD* needs a quoted image, video, or audio, fam! 📸🎥🎵
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const loadingMessages = [
      "*「▰▱▱▱▱▱▱▱▱▱」*",
      "*「▰▰▱▱▱▱▱▱▱▱」*",
      "*「▰▰▰▱▱▱▱▱▱▱」*",
      "*「▰▰▰▰▱▱▱▱▱▱」*",
      "*「▰▰▰▰▰▱▱▱▱▱」*",
      "*「▰▰▰▰▰▰▱▱▱▱」*",
      "*「▰▰▰▰▰▰▰▱▱▱」*",
      "*「▰▰▰▰▰▰▰▰▱▱」*",
      "*「▰▰▰▰▰▰▰▰▰▱」*",
      "*「▰▰▰▰▰▰▰▰▰▰」*",
    ];

    const loadingMessageCount = loadingMessages.length;
    let currentMessageIndex = 0;

    const { key } = await Matrix.sendMessage(
      m.from,
      { text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* uploadin’ your media... ${loadingMessages[currentMessageIndex]} 🚀
◈━━━━━━━━━━━━━━━━◈` },
      { quoted: m }
    );

    const loadingInterval = setInterval(async () => {
      currentMessageIndex = (currentMessageIndex + 1) % loadingMessageCount;
      await Matrix.sendMessage(
        m.from,
        { text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* uploadin’ your media... ${loadingMessages[currentMessageIndex]} 🚀
◈━━━━━━━━━━━━━━━━◈` },
        { quoted: m, messageId: key }
      );
    }, 500);

    const media = await m.quoted.download();
    if (!media) {
      clearInterval(loadingInterval);
      throw new Error("Failed to download media");
    }

    const fileSizeMB = media.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      clearInterval(loadingInterval);
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ File’s too big, fam! Max is ${MAX_FILE_SIZE_MB}MB. 😣
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const mediaUrl = await uploadMedia(media);

    clearInterval(loadingInterval);
    await Matrix.sendMessage(
      m.from,
      {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* upload done, fam! ✅
◈━━━━━━━━━━━━━━━━◈`,
      },
      { quoted: m }
    );

    const mediaType = getMediaType(m.quoted.mtype);
    if (mediaType === "audio") {
      await Matrix.sendMessage(
        m.from,
        {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* got your audio URL, fam! 🎵
│❒ 🔗 *URL*: ${mediaUrl}
◈━━━━━━━━━━━━━━━━◈`,
        },
        { quoted: m }
      );
    } else {
      await Matrix.sendMessage(
        m.from,
        {
          [mediaType]: { url: mediaUrl },
          caption: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* got your ${mediaType} URL, fam! 📸🎥
│❒ 🔗 *URL*: ${mediaUrl}
◈━━━━━━━━━━━━━━━━◈`,
        },
        { quoted: m }
      );
    }
  } catch (error) {
    clearInterval(loadingInterval);
    console.error(`❌ Tourl error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hit a snag uploadin’, fam! Try again! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

const getMediaType = (mtype) => {
  switch (mtype) {
    case "imageMessage":
      return "image";
    case "videoMessage":
      return "video";
    case "audioMessage":
      return "audio";
    default:
      return null;
  }
};

export default tourl;