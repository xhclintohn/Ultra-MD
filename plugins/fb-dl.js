import axios from "axios";
import config from "../config.js";

const facebook = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
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

    const { data } = await axios.get(`https://api.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(query)}`);

    if (!data?.status || !data?.video?.downloads) {
      await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* couldn’t grab that video, fam! URL’s trash or somethin’s busted! 😣
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const { title, downloads } = data.video;
    const bestQuality = downloads.find((v) => v.quality === "HD") || downloads.find((v) => v.quality === "SD");

    if (!bestQuality) {
      await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
      return Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ No video worth downloadin’ here, fam! *Toxic-MD* ain’t got time for this shit! 😆
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }

    const caption = `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* Facebook Video 📹
│❒ 🎬 *Title*: ${title || "No title"}
│❒ 📥 *Quality*: ${bestQuality.quality}
│❒ 💥 Powered By *Toxic-MD* 🖤
◈━━━━━━━━━━━━━━━━◈`;

    await Matrix.sendMessage(m.from, {
      video: { url: bestQuality.downloadUrl },
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