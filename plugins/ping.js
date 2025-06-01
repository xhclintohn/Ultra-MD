import config from '../config/public.js';

const ping = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "ping") {
    const start = new Date().getTime();

    const reactionEmojis = ['🔥', '💖', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
    const textEmojis = ['💎', '🏆', '⚡', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡', '✨'];

    const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    let textEmoji = textEmojis[Math.floor(Math.random() * totalCommands.length)];

    // Ensure reaction and text emojis are different
    while (textEmoji === reactionEmoji) {
      textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
    }

    await m.React(textEmoji);

    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    // Toxic, realistic responses
    const toxicResponses = [
      `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘
      │❒ Yo, *Toxic-MD* snappin’ at *${responseTime.toFixed(2)}s*! Faster than your weak net, bruh! ${reactionEmoji}
      │❒ xh_clinton’s bot don’t lag, it attacks! 😈
      ◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘`,
      `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘
      │❒ *Toxic-MD* droppin’ *${responseTime.toFixed(2)}s*! You can’t keep up with this heat! ${reactionEmoji}
      │❒ xh_clinton’s runnin’ this, bow down! 💀
      ◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘`,
      `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘
      │❒ Speed? *${responseTime.toFixed(2)}s*! *Toxic-MD*’s too quick for your trash setup! ${reactionEmoji}
      │❒ xh_clinton’s bot is straight-up lethal! 🔥
      ◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘`,
      `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘
      │❒ *Toxic-MD* at *${responseTime.toFixed(2)}s*! I’m zoomin’ past your slow ass! ${reactionEmoji}
      │❒ xh_clinton’s creation, no mercy! 😎
      ◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘`,
      `◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘
      │❒ Ping? *${responseTime.toFixed(2)}s*! *Toxic-MD*’s wreckin’ with this speed! ${reactionEmoji}
      │❒ xh_clinton’s bot, you can’t touch this! 💣
      ◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈┉┉┉┉┖┌┘`,
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
};

export default ping;