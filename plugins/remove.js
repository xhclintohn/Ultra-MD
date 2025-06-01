import config from "../config.cjs";

const kick = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (!["kick", "remove"].includes(cmd)) return;

    if (!m.isGroup) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, *Toxic-MD* only kicks in groups! 🏠
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const groupMetadata = await Matrix.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find((p) => p.id === botNumber)?.admin;
    const senderAdmin = participants.find((p) => p.id === m.sender)?.admin;

    if (!botAdmin) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* needs admin powers to kick, fam! 😡
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!senderAdmin) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ You ain’t an admin, fam! Step up or chill! 😎
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    if (!m.mentionedJid) m.mentionedJid = [];
    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);

    const users = m.mentionedJid.length > 0
      ? m.mentionedJid
      : text.replace(/[^0-9]/g, "").length > 0
      ? [text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"]
      : [];

    if (users.length === 0) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Tag or quote someone to kick, fam! Don’t ghost *Toxic-MD*! 😤
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const validUsers = users.filter((user) => {
      if (!user) return false;
      const isMember = participants.some((p) => p.id === user);
      const isBot = user === botNumber;
      const isSender = user === m.sender;
      return isMember && !isBot && !isSender;
    });

    if (validUsers.length === 0) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Can’t kick nobody, fam! Check the tags or don’t try kickin’ yourself or *Toxic-MD*! 😜
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    await Matrix.groupParticipantsUpdate(m.from, validUsers, "remove");
    const kickedNames = validUsers.map((user) => `@${user.split("@")[0]}`).join(", ");
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ ${kickedNames} got yeeted from *${groupMetadata.subject}* by *Toxic-MD*! 👊💥
◈━━━━━━━━━━━━━━━━◈`,
      contextInfo: { mentionedJid: validUsers },
    }, { quoted: m });
  } catch (error) {
    console.error(`❌ Kick error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hit a snag kickin’, fam! Try again! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default kick;