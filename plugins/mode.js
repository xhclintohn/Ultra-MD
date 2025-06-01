import fs from "fs";
import config from "../config.cjs";

const modeCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd !== "mode") return;

    if (!isCreator) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Back off, scrub! Only *Toxic-MD*’s king can mess with this! 😤🔒
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!text) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, genius, tell *Toxic-MD* what mode! Use *public* or *private*, dumbass! 😆
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!["public", "private"].includes(text)) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ What’s this trash? *Toxic-MD* only takes *public* or *private*! Get it right, clown! 🤡
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    config.MODE = text;
    Matrix.public = text === "public";

    try {
      fs.writeFileSync("./config.cjs", `module.exports = ${JSON.stringify(config, null, 2)};`);
    } catch (error) {
      console.error(`Error saving config: ${error.message}`);
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* choked tryin’ to save that mode, fam! Server’s actin’ weak! 😣
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* flipped to *${text}* mode! You’re runnin’ this shit now, boss! 💪🔥
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Mode error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* fucked up somewhere, fam! Try that again! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default modeCommand;