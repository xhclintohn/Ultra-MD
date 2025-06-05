import axios from "axios";
import config from "../config.cjs";

const tiktok = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const query = m.body.slice(prefix.length + cmd.length).trim();

  if (!["tiktok", "tt"].includes(cmd)) return;

  if (!query || !query.startsWith("http")) {
    return Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ ❌ *Usage:* _.tiktok <TikTok URL>_
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }

  try {
    await Matrix.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    const { data } = await axios.get(`https://api.giftedtech.web.id/api/download/tiktok?apikey=gifted_api_se5dccy&url=${encodeURIComponent(query)}`);

    if (!data.success || !data.result || !data.result.video) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ ⚠️ *Failed to fetch TikTok video. Please try again.*
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const { title, author, stats, video, music } = data.result;

    const caption = `◈━━━━━━━━━━━━━━━━◈
│❒ 🎵 *TikTok Video*
│❒ 💬 *${title}*
│❒ 👤 *By:* ${author.name}
│❒ ❤️ *Likes:* ${stats.likeCount}
│❒ 💬 *Comments:* ${stats.commentCount}
│❒ 🔄 *Shares:* ${stats.shareCount}
│❒ 📥 *Powered By Toxic-MD ✅*
◈━━━━━━━━━━━━━━━━◈`;

    await Matrix.sendMessage(m.from, {
      video: { url: video.noWatermark },
      mimetype: "video/mp4",
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
      },
    }, { quoted: m });

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });

    await Matrix.sendMessage(m.from, {
      audio: { url: music.play_url },
      mimetype: "audio/mpeg",
      fileName: "TikTok_Audio.mp3",
      caption: `◈━━━━━━━━━━━━━━━━◈
│❒ 🎶 *TikTok Audio Downloaded*
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });

  } catch (error) {
    console.error("TikTok Downloader Error:", error);
    Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ ❌ *An error occurred. Please try again later.*
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default tiktok;