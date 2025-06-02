import fs from "fs";
import config from "../config.cjs";

const anticallCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== "anticall") return;

    if (!isCreator) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Step off, loser! Only *Toxic-MD*’s boss can fuck with this! 😤🔪
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!text) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, braindead, tell *Toxic-MD* *on* or *off*! Don’t waste my time! 😆
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!["on", "off"].includes(text)) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ What’s this garbage? *Toxic-MD* only takes *on* or *off*, you clown! 🤡
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    config.REJECT_CALL = text === "on";

    try {
      fs.writeFileSync("./config.js", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config: ${error.message}`);
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* choked tryin’ to save that, fam! Server’s trash! 😣
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* anti-call flipped to *${text}*! You’re lockin’ it down, boss! 💪🔥
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Anticall error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* screwed up somewhere, fam! Hit it again! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default anticallCommand;