import axios from "axios";
import config from "../config.cjs";

const repo = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

    if (!["repo", "sc", "script", "info"].includes(cmd)) return;

    const githubRepoURL = "https://github.com/xhclintohn/Toxic-MD";

    // Extract username and repo name
    const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
    if (!username || !repoName) {
      throw new Error("Invalid GitHub URL format.");
    }

    // Fetch repo details
    const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
    const repoData = response.data;

    if (!repoData) {
      throw new Error("GitHub API request failed.");
    }

    // Format repo info
    const formattedInfo = `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* Repo Stats 🌟
│❒ 📛 *Bot*: ${repoData.name}
│❒ 👑 *Owner*: ${repoData.owner.login}
│❒ ⭐ *Stars*: ${repoData.stargazers_count}
│❒ 🍴 *Forks*: ${repoData.forks_count}
│❒ 🔗 *Link*: ${repoData.html_url}
│❒ 📝 *Description*: ${repoData.description || "No description"}
│❒ 💥 Star & fork it, fam!
◈━━━━━━━━━━━━━━━━◈
│❒ Powered By *Toxic-MD* 🖤
◈━━━━━━━━━━━━━━━━◈`;

    // Send image with caption
    await Matrix.sendMessage(
      m.from,
      {
        image: { url: "https://files.catbox.moe/juroe8.jpg" },
        caption: formattedInfo,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363322461279856@newsletter",
            newsletterName: "ToxicTech",
            serverMessageId: 143,
          },
        },
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(`❌ Repo error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hit a snag fetchin’ repo info, fam! Try again! 😈
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default repo;