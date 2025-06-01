import axios from "axios";
import yts from "yt-search";
import config from "../config.cjs";

const play = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

    if (cmd === "play") {
      if (args.length === 0 || !args.join(" ")) {
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, give me a song name or keywords to search, fam! 😎
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      const searchQuery = args.join(" ");
      await Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* huntin’ for "${searchQuery}"... 🎧
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });

      const searchResults = await yts(searchQuery);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ No tracks found for "${searchQuery}". You slippin’! 💀
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      const song = searchResults.videos[0];
      const apiKey = "gifted_api_se5dccy";
      const apiUrl = `https://api.giftedtech.web.id/api/download/dlmp3?apikey=${apiKey}&url=${encodeURIComponent(song.url)}`;

      let response;
      try {
        response = await axios.get(apiUrl);
        console.log(`API response:`, JSON.stringify(response.data, null, 2)); // Debug log
      } catch (apiError) {
        console.error(`API error:`, apiError.message);
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* couldn’t hit the API for "${song.title}". Server’s actin’ up! 😡
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      if (!response.data?.success || !response.data?.result) {
        console.error(`Invalid API response:`, response.data);
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* got junk data for "${song.title}". API’s trash! 😤
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      const { title, download_url } = response.data.result;
      if (!title || !download_url) {
        console.error(`Missing title or download_url in response:`, response.data.result);
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* can’t play "${song.title}". No audio link, fam! 😣
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      // Send the audio file
      await Matrix.sendMessage(
        m.from,
        {
          audio: { url: download_url },
          mimetype: "audio/mp4",
          ptt: false,
        },
        { quoted: m }
      );

      await Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *${title}* dropped by *Toxic-MD*! Blast it, fam! 🎶
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Play error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hit a snag, fam! Try again or pick a better track! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default play;