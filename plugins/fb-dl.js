import axios from "axios";
import config from "../config.cjs";

const facebook = async (m, Matrix) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const query = m.body.slice(prefix.length + cmd.length).trim();

    if (!["fb", "facebook"].includes(cmd)) return;

    if (!query || !query.startsWith("http")) {
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, dumbass, gimme a proper *Facebook video URL*! Don’t waste *Toxic-MD*’s time! 😤📹
│❒ Ex: *${prefix}fb https://fb.watch/xxx*
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    await Matrix.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    const { data } = await axios.get(`https://api.giftedtech.web.id/api/download/facebook?apikey=gifted_api_se5dccy&url=${encodeURIComponent(query)}`);

    if (!data.success || !data.result) {
      await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* couldn’t grab that video, fam! URL’s trash or somethin’s busted! 😣
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const { title, hd_video, sd_video, thumbnail } = data.result;
    const videoUrl = hd_video || sd_video;

    if (!videoUrl) {
      await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ No video worth downloadin’ here, fam! *Toxic-MD* ain’t got time for this shit! 😆
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const quality = hd_video ? "HD" : "SD";
    const caption = `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* Facebook Video 📹
│❒ 🎬 *Title*: ${title || "No title"}
│❒ 📥 *Quality*: ${quality}
│❒ 💥 Powered By *Toxic-MD* 🖤
◈━━━━━━━━━━━━━━━━◈`;

    await Matrix.sendMessage(m.from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption,
    }, { quoted: m });

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });
  } catch (error) {
    console.error(`❌ Facebook error: ${error.message}`);
    await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* fucked up grabbin’ that video, fam! Try again, you got this! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default facebook;