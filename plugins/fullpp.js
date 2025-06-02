import { downloadMediaMessage } from "baileys-pro";
import Jimp from "jimp";
import config from "../config.cjs";

const setProfilePicture = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isBot = m.sender === botNumber;
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

    if (cmd !== "fullpp") return;

    if (!isBot) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Get lost, poser! Only *Toxic-MD* itself can flex this command! 😤🔒
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!m.quoted?.message?.imageMessage) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, dumbass, reply to a damn *image* for *Toxic-MD*’s glow-up! 🖼️😆
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    await m.React("⏳"); // Loading reaction

    let media;
    for (let i = 0; i < 3; i++) {
      try {
        media = await downloadMediaMessage(m.quoted, "buffer");
        if (media) break;
      } catch (error) {
        if (i === 2) {
          await m.React("❌");
          return Matrix.sendMessage(m.from, {
            text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* can’t grab that image, fam! Shit’s broken, try again! 😣
◈━━━━━━━━━━━━━━━━◈`,
          }, { quoted: m });
        }
      }
    }

    const image = await Jimp.read(media);
    if (!image) throw new Error("Invalid image format");

    const size = Math.max(image.bitmap.width, image.bitmap.height);
    if (image.bitmap.width !== image.bitmap.height) {
      image.cover(size, size, 0x000000FF);
    }

    image.resize(640, 640);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    await Matrix.updateProfilePicture(botNumber, buffer);
    await m.React("✅");

    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD*’s new drip is fuckin’ 🔥! Profile pic set, boss! 😎💪
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Fullpp error: ${error.message}`);
    await m.React("❌");
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* fucked up settin’ that pic, fam! Try again, you got this! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default setProfilePicture;