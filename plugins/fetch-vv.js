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
    const keywordTriggers = ["send", "open", "show", "unlock", "view"];
    const isKeywordReply = m.body && keywordTriggers.some((word) => m.body.toLowerCase().includes(word));

    // Secret Mode: emoji/keyword reply + authorized + quoted
    const secretMode = (isEmojiReply || isKeywordReply) && isAuthorized && !!m.quoted;

    // Restrict to vv and vv2
    if (cmd && !["vv", "vv2"].includes(cmd)) return;
    if (cmd && !isAuthorized) return;

    // Only proceed if there's a command or secret mode is active
    if (!cmd && !secretMode) return;

    // Process View Once content
    const targetMessage = m.quoted;
    if (!targetMessage || !targetMessage.message) return;

    let msg = targetMessage.message;
    if (msg.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message;
    else if (msg.viewOnceMessage) msg = msg.viewOnceMessage.message;

    if (!msg) return;

    const messageType = Object.keys(msg)[0];
    // Skip if not a valid media type
    if (!["imageMessage", "videoMessage", "audioMessage"].includes(messageType)) return;

    const buffer = await downloadMediaMessage(targetMessage, "buffer");
    if (!buffer) return;

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
    // Silently catch errors, no WhatsApp message sent
    return;
  }
};

export default OwnerCmd;