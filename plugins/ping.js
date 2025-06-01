import config from "../config.cjs";

const ping = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

    if (cmd === "ping") {
      const start = new Date().getTime();

      const reactionEmojis = ["🔥", "💖", "🚀", "💨", "🎯", "🎉", "🌟", "💥", "🕐", "🔹"];
      const textEmojis = ["💎", "🏆", "⚡", "🎖", "🎶", "🌠", "🌀", "🔱", "🚀", "✩"];

      const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
      let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

      // Ensure reaction and text emojis are different
      while (textEmoji === reactionEmoji) {
        textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
      }

      await m.React(textEmoji);

      const end = new Date().getTime();
      const responseTime = (end - start) / 1000;

      // Toxic, realistic responses with desired styling
      const toxicResponses = [
        `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, *Toxic-MD* snappin’ at *${responseTime.toFixed(1)}s*! Your net’s weak as hell, fam! ${reactionEmoji} xh_clinton’s bot owns this! 😈
◈━━━━━━━━━━━━━━━━◈`,
        `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hittin’ *${responseTime.toFixed(1)}s*! Too fast for your slow ass! ${reactionEmoji} xh_clinton’s runnin’ the game! 💀
◈━━━━━━━━━━━━━━━━◈`,
        `◈━━━━━━━━━━━━━━━━◈
│❒ Speed? *${responseTime.toFixed(1)}s*! *Toxic-MD* smokes your trash setup! ${reactionEmoji} xh_clinton’s bot, no mercy! 🔥
◈━━━━━━━━━━━━━━━━◈`,
        `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* at *${responseTime.toFixed(1)}s*! Zoomin’ past you, clown! ${reactionEmoji} xh_clinton’s creation, bow down! 💣
◈━━━━━━━━━━━━━━━━◈`,
        `◈━━━━━━━━━━━━━━━━◈
│❒ Ping? *${responseTime.toFixed(1)}s*! *Toxic-MD*’s wreckin’ this! ${reactionEmoji} xh_clinton’s bot, untouchable! 😎
◈━━━━━━━━━━━━━━━━◈`,
      ];

      const text = toxicResponses[Math.floor(Math.random() * toxicResponses.length)];

      await Matrix.sendMessage(m.from, {
        text,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
        },
      }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Ping error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, somethin’ broke! xh_clinton’s bot is still dope, tho! 😎
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default ping;