import fs from "fs";
import config from "../config.cjs";

const autoreactCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== "autoreact") return;

    if (!isCreator) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Get the fuck outta here, wannabe! Only *Toxic-MD*’s boss runs this show! 😤🔪
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!text) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, dipshit, tell *Toxic-MD* *on* or *off*! Don’t just stand there! 😆
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!["on", "off"].includes(text)) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ What’s this bullshit? *Toxic-MD* only takes *on* or *off*, you moron! 🤡
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    config.AUTO_REACT = text === "on";

    try {
      fs.writeFileSync("./config.js", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config: ${error.message}`);
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* choked tryin’ to save that, fam! Server’s actin’ like a bitch! 😣
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* auto-react flipped to *${text}*! You’re ownin’ this game, boss! 💪🔥
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Autoreact error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* fucked up somewhere, fam! Smash it again! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default autoreactCommand;