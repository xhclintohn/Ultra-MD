import { downloadMediaMessage } from "baileys-pro";
import config from "../config.cjs";

const OwnerCmd = async (m, Matrix) => {
  try {
    const botNumber = Matrix.user.id.split(":")[0] + "@s.whatsapp.net";
    const ownerNumber = config.OWNER_NUMBER + "@s.whatsapp.net";
    const prefix = config.Prefix || config.PREFIX || ".";
    const isOwner = m.sender === ownerNumber;
    const isBot = m.sender === botNumber;
    const isAuthorized = isOwner || isBot;

    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

    // Emoji-only or Emoji + short text
    const emojiRegex = /^[\p{Emoji}\u200d\u20e3]+$/u;
    const emojiAndTextRegex = /^[\p{Emoji}\u200d\u20e3\s\w.,!?\-]{1,15}$/u;
    const isEmojiReply = m.body && (emojiRegex.test(m.body.trim()) || emojiAndTextRegex.test(m.body.trim()));

    // Keyword triggers
    const keywordTriggers = ["send", "open", "show", "uhm", "view"];
    const isKeywordReply = m.body && keywordTriggers.some((word) => m.body.toLowerCase().includes(word));

    // Secret Mode: emoji/keyword reply + authorized + quoted
    const secretMode = (isEmojiReply || isKeywordReply) && isAuthorized && !!m.quoted;

    // Restrict to vv and vv2
    if (cmd && !["vv", "vv2"].includes(cmd)) return;
    if (cmd && !isAuthorized) {
      return Matrix.sendMessage(m.from, {
        text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ Fuck off, scrub! Only *Toxic-MD*’s boss or me can crack this shit! 😤🔪
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`,
      }, { quoted: m });
    }

    // Only proceed if there's a command or secret mode is active
    if (!cmd && !secretMode) return;

    // Process View Once content
    const targetMessage = m.quoted;
    if (!targetMessage || !targetMessage.message) {
      return Matrix.sendMessage(m.from, {
        text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ Yo, dumbass, quote a *view-once* message for *Toxic-MD* to rip open! 😆
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`,
      }, { quoted: m });
    }

    let msg = targetMessage.message;
    if (msg.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message;
    else if (msg.viewOnceMessage) msg = msg.viewOnceMessage.message;

    if (!msg) {
      return Matrix.sendMessage(m.from, {
        text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ That ain’t a view-once message, fam! Stop wastin’ *Toxic-MD*’s time! 🤡
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`,
      }, { quoted: m });
    }

    const messageType = Object.keys(msg)[0];
    // Only send media-related response if explicitly attempting to process media
    if (!["imageMessage", "videoMessage", "audioMessage"].includes(messageType) && (cmd || secretMode)) {
      return Matrix.sendMessage(m.from, {
        text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* only rips images, videos, or audio, fam! Pick somethin’ real! 😣
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`,
      }, { quoted: m });
    }

    // Skip further processing if not a valid media type
    if (!["imageMessage", "videoMessage", "audioMessage"].includes(messageType)) return;

    const buffer = await downloadMediaMessage(targetMessage, "buffer");
    if (!buffer) {
      return Matrix.sendMessage(m.from, {
        text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* couldn’t grab that shit, fam! Media’s busted! 😣
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`,
      }, { quoted: m });
    }

    const mimetype = msg.audioMessage?.mimetype || "audio/ogg";
    const caption = `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* cracked that view-once open! 💥
│❒ 🖤 *Powered By Toxic-MD*
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`;

    const recipient = secretMode || cmd === "vv2" ? botNumber : m.from;

    if (messageType === "imageMessage") {
      await Matrix.sendMessage(recipient, { image: buffer, caption }, { quoted: m });
    } else if (messageType === "videoMessage") {
      await Matrix.sendMessage(recipient, { video: buffer, caption, mimetype: "video/mp4" }, { quoted: m });
    } else if (messageType === "audioMessage") {
      await Matrix.sendMessage(recipient, { audio: buffer, mimetype, ptt: true }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });
  } catch (error) {
    await Matrix.sendMessage(m.from, {
      text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* fucked up crackin’ that, fam! Try again! 😈
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`,
    }, { quoted: m });
  }
};

export default OwnerCmd;