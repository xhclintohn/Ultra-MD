import config from "../config.cjs";

const block = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd !== "block") return;

    if (!isCreator) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Piss off, wannabe! Only *Toxic-MD*’s boss can throw blocks! 😤🔪
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    let users = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null) || (text.replace(/[^0-9]/g, "") + "@s.whatsapp.net");
    if (!users || users === botNumber) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, dumbass, tag, quote, or drop a number to block! Don’t make *Toxic-MD* block itself, idiot! 😆
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (users === m.sender) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ What, you tryna block yourself? *Toxic-MD* ain’t here for your clown shit! 🤡
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    await Matrix.updateBlockStatus(users, "block");
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* yeeted @${users.split("@")[0]} into the void! Blocked, fam! 🚫💥
◈━━━━━━━━━━━━━━━━◈`,
      contextInfo: { mentionedJid: [users] },
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Block error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* fucked up blockin’ that loser, fam! Try again! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default block;