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

      // Toxic, realistic responses with minimal lines
      const toxicResponses = [
        `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈
Yo, 😈 *Toxic-MD* is on demon time at *${responseTime.toFixed(1)}s*! Your net’s weaker than a noob’s game! 💪 ${reactionEmoji} xh_clinton’s bot don’t lag, it DOMINATES! 😈
◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈`,
        `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈
*Toxic-MD* snappin’ at *${responseTime.toFixed(1)}s*! Can’t keep up with this heat, fam! 🔥 ${reactionEmoji} xh_clinton’s runnin’ this, you just watchin’! 💀
◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈`,
        `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈
Speed? *${responseTime.toFixed(1)}s*! *Toxic-MD*’s too quick for your trash setup! 🚀 ${reactionEmoji} xh_clinton’s bot is straight-up lethal, no cap! 😎
◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈`,
        `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈
*Toxic-MD* at *${responseTime.toFixed(1)}s*! Zoomin’ past your slow ass! 💨 ${reactionEmoji} xh_clinton’s creation, bow down or get smoked! 💣
◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈`,
        `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈
Ping? *${responseTime.toFixed(1)}s*! *Toxic-MD*’s wreckin’ with this speed! ⚡ ${reactionEmoji} xh_clinton’s bot, untouchable, fam! 😈
◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈`,
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
    await Matrix.sendMessage(m.from, { text: `Yo, somethin’ broke! xh_clinton’s bot is still dope, tho! 😎` }, { quoted: m });
  }
};

export default ping;