import axios from "axios";
import config from "../config.cjs";

const repo = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

    if (!["repo", "sc", "script", "info"].includes(cmd)) return;

    await Matrix.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    const githubRepoURL = "https://github.com/xhclintohn/Toxic-MD";
    const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/) || [];

    if (!username || !repoName) {
      throw new Error("Invalid GitHub URL format.");
    }

    // GitHub API headers (optional token for higher rate limits)
    const headers = {
      Accept: "application/vnd.github.v3+json",
      ...(config.GITHUB_TOKEN ? { Authorization: `token ${config.GITHUB_TOKEN}` } : {}),
    };

    // Fetch repo details
    const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`, { headers });
    const repoData = response.data;

    if (response.status !== 200 || !repoData.full_name) {
      throw new Error("GitHub API request failed or repo not found.");
    }

    // Format repo info
    const formattedInfo = `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* Repo Stats 📊
│❒ 📛 *Bot*: ${repoData.name}
│❒ 👑 *Owner*: ${repoData.owner?.login || "N/A"}
│❒ ⭐ *Stars*: ${repoData.stargazers_count || 0}
│❒ 🍴 *Forks*: ${repoData.forks_count || 0}
│❒ 🔗 *Link*: ${repoData.html_url}
│❒ 📝 *Description*: ${repoData.description || "No description"}
│❒ 🕒 *Created*: ${new Date(repoData.created_at).toLocaleDateString()}
│❒ 💥 Star & fork it, fam!
│❒ 🖤 *Powered By Toxic-MD*
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`;

    // Send image with caption
    await Matrix.sendMessage(
      m.from,
      {
        image: { url: "https://files.catbox.moe/juroe8.jpg" },
        caption: formattedInfo,
      },
      { quoted: m }
    );

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });
  } catch (error) {
    console.error(`❌ Repo error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      react: { text: "❌", key: m.key },
      text: `◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈
│❒ *Toxic-MD* fucked up fetchin’ repo stats, fam! Check the URL or try again! 😈
◈┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅◈`,
    }, { quoted: m });
  }
};

export default repo;