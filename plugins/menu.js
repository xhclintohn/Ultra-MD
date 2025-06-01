import moment from "moment-timezone";
import fs from "fs";
import os from "os";
import pkg from "baileys-pro";
const { generateWAMessageFromContent, proto } = pkg;
import config from "../config.cjs";
import axios from "axios";

// Time logic
const xtime = moment.tz("Africa/Nairobi").format("HH:mm:ss");
const xdate = moment.tz("Africa/Nairobi").format("DD/MM/YYYY");
const time2 = moment().tz("Africa/Nairobi").format("HH:mm:ss");
let pushwish = "";

if (time2 < "05:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "11:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "15:00:00") {
  pushwish = `Good Afternoon 🌅`;
} else if (time2 < "18:00:00") {
  pushwish = `Good Evening 🌃`;
} else if (time2 < "19:00:00") {
  pushwish = `Good Evening 🌃`;
} else {
  pushwish = `Good Night 🌌`;
}

// Fancy font utility
function toFancyFont(text, isUpperCase = false) {
  const fonts = {
    A: "𝘼",
    B: "𝘽",
    C: "𝘾",
    D: "𝘿",
    E: "𝙀",
    F: "𝙁",
    G: "𝙂",
    H: "𝙃",
    I: "𝙄",
    J: "𝙅",
    K: "𝙆",
    L: "𝙇",
    M: "𝙈",
    N: "𝙉",
    O: "𝙊",
    P: "𝙋",
    Q: "𝙌",
    R: "𝙍",
    S: "𝙎",
    T: "𝙏",
    U: "𝙐",
    V: "𝙑",
    W: "𝙒",
    X: "𝙓",
    Y: "𝙔",
    Z: "𝙕",
    a: "𝙖",
    b: "𝙗",
    c: "𝙘",
    d: "𝙙",
    e: "𝙚",
    f: "𝙛",
    g: "𝙜",
    h: "𝙝",
    i: "𝙞",
    j: "𝙟",
    k: "𝙠",
    l: "𝙡",
    m: "𝙢",
    n: "𝙣",
    o: "𝙤",
    p: "𝙥",
    q: "𝙦",
    r: "𝙧",
    s: "𝙨",
    t: "𝙩",
    u: "𝙪",
    v: "𝙫",
    w: "𝙬",
    x: "𝙭",
    y: "𝙮",
    z: "𝙯",
  };
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

// Retry utility
async function fetchImageWithRetry(url, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(response.data, "binary");
    } catch (error) {
      if (error.response?.status === 429 && i < retries - 1) {
        console.log(`Rate limit hit, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

const menu = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const mode = config.MODE === "public" ? "public" : "private";
  const totalCommands = 70;

  const validCommands = ["list", "help", "menu"];
  const subMenuCommands = [
    "download",
    "converter",
    "ai",
    "tools",
    "group",
    "search",
    "main",
    "owner",
    "stalk",
  ];

  // Handle main menu
  if (validCommands.includes(cmd)) {
    const mainMenu = `
╭─❒ 「 ${toFancyFont("Toxic-MD")} Command Menu ⚠ 」
│
│ 🤖 *${toFancyFont("Bot")}*: ${toFancyFont("Toxic-MD")}
│ 📋 *${toFancyFont("Total Commands")}*: ${totalCommands}
│ 🔣 *${toFancyFont("Prefix")}*: ${prefix}
│ 🌐 *${toFancyFont("Mode")}*: ${mode}
│ 📚 *${toFancyFont("Library")}*: Baileys
╰─────────────

> ${pushwish} *${m.pushName}*! Tap a button to select a menu:

> Pσɯҽɾҽԃ Ⴆყ Tσxιƈ-ɱԃȥ
`;

    // Fetch image with retry
    let menuImage;
    const primaryUrl = "https://files.catbox.moe/y2utve.jpg";
    const fallbackUrl = "https://files.catbox.moe/9kL5x9Q.jpg";
    try {
      menuImage = await fetchImageWithRetry(primaryUrl);
    } catch (error) {
      console.error("❌ Failed to fetch primary image:", error);
      try {
        menuImage = await fetchImageWithRetry(fallbackUrl);
      } catch (fallbackError) {
        console.error("❌ Failed to fetch fallback image:", fallbackError);
        await Matrix.sendMessage(m.from, { text: mainMenu }, { quoted: m });
        return Matrix.sendMessage(m.from, {
          audio: { url: "https://files.catbox.moe/59g7ny.mp4" },
          mimetype: "audio/mp4",
          ptt: true,
        }, { quoted: m });
      }
    }

    // Send menu with buttons
    await Matrix.sendMessage(
      m.from,
      {
        image: menuImage,
        caption: mainMenu,
        viewOnce: true,
        buttons: [
          {
            buttonId: `${prefix}download`,
            buttonText: { displayText: `📥 ${toFancyFont("Download")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}converter`,
            buttonText: { displayText: `🔄 ${toFancyFont("Converter")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}ai`,
            buttonText: { displayText: `🤖 ${toFancyFont("AI")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}tools`,
            buttonText: { displayText: `🛠 ${toFancyFont("Tools")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}group`,
            buttonText: { displayText: `👥 ${toFancyFont("Group")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}search`,
            buttonText: { displayText: `🔍 ${toFancyFont("Search")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}main`,
            buttonText: { displayText: `⚙ ${toFancyFont("Main")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}owner`,
            buttonText: { displayText: `🔒 ${toFancyFont("Owner")}` },
            type: 1,
          },
          {
            buttonId: `${prefix}stalk`,
            buttonText: { displayText: `🕵 ${toFancyFont("Stalk")}` },
            type: 1,
          },
        ],
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
        },
      },
      { quoted: m }
    );

    // Send audio
    await Matrix.sendMessage(
      m.from,
      {
        audio: { url: "https://files.catbox.moe/59g7ny.mp4" },
        mimetype: "audio/mp4",
        ptt: true,
      },
      { quoted: m }
    );
  }

  // Handle sub-menu commands
  if (subMenuCommands.includes(cmd)) {
    let menuTitle;
    let menuResponse;

    switch (cmd) {
      case "download":
        menuTitle = "Download";
        menuResponse = `
╭─❒ 「 ${toFancyFont("Download")} 📥 」
│ ✘ *${toFancyFont("apk")}*
│ ✘ *${toFancyFont("facebook")}*
│ ✘ *${toFancyFont("mediafire")}*
│ ✘ *${toFancyFont("pinterestdl")}*
│ ✘ *${toFancyFont("gitclone")}*
│ ✘ *${toFancyFont("gdrive")}*
│ ✘ *${toFancyFont("insta")}*
│ ✘ *${toFancyFont("ytmp3")}*
│ ✘ *${toFancyFont("ytmp4")}*
│ ✘ *${toFancyFont("play")}*
│ ✘ *${toFancyFont("song")}*
│ ✘ *${toFancyFont("video")}*
│ ✘ *${toFancyFont("ytmp3doc")}*
│ ✘ *${toFancyFont("ytmp4doc")}*
│ ✘ *${toFancyFont("tiktok")}*
╰─────────────
`;
        break;

      case "converter":
        menuTitle = "Converter";
        menuResponse = `
╭─❒ 「 ${toFancyFont("Converter")} 🔄 」
│ ✘ *${toFancyFont("attp")}*
│ ✘ *${toFancyFont("attp2")}*
│ ✘ *${toFancyFont("attp3")}*
│ ✘ *${toFancyFont("ebinary")}*
│ ✘ *${toFancyFont("dbinary")}*
│ ✘ *${toFancyFont("emojimix")}*
│ ✘ *${toFancyFont("mp3")}*
╰─────────────
`;
        break;

      case "ai":
        menuTitle = "AI";
        menuResponse = `
╭─❒ 「 ${toFancyFont("AI")} 🤖 」
│ ✘ *${toFancyFont("ai")}*
│ ✘ *${toFancyFont("bug")}*
│ ✘ *${toFancyFont("report")}*
│ ✘ *${toFancyFont("gpt")}*
│ ✘ *${toFancyFont("dalle")}*
│ ✘ *${toFancyFont("remini")}*
│ ✘ *${toFancyFont("gemini")}*
╰─────────────
`;
        break;

      case "tools":
        menuTitle = "Tools";
        menuResponse = `
╭─❒ 「 ${toFancyFont("Tools")} 🛠 」
│ ✘ *${toFancyFont("calculator")}*
│ ✘ *${toFancyFont("tempmail")}*
│ ✘ *${toFancyFont("checkmail")}*
│ ✘ *${toFancyFont("trt")}*
│ ✘ *${toFancyFont("tts")}*
╰─────────────
`;
        break;

      case "group":
        menuTitle = "Group";
        menuResponse = `
╭─❒ 「 ${toFancyFont("Group")} 👥 」
│ ✘ *${toFancyFont("linkgroup")}*
│ ✘ *${toFancyFont("setppgc")}*
│ ✘ *${toFancyFont("setname")}*
│ ✘ *${toFancyFont("setdesc")}*
│ ✘ *${toFancyFont("group")}*
│ ✘ *${toFancyFont("gcsetting")}*
│ ✘ *${toFancyFont("welcome")}*
│ ✘ *${toFancyFont("add")}*
│ ✘ *${toFancyFont("kick")}*
│ ✘ *${toFancyFont("hidetag")}*
│ ✘ *${toFancyFont("tagall")}*
│ ✘ *${toFancyFont("antilink")}*
│ ✘ *${toFancyFont("antitoxic")}*
│ ✘ *${toFancyFont("promote")}*
│ ✘ *${toFancyFont("demote")}*
│ ✘ *${toFancyFont("getbio")}*
╰─────────────
`;
        break;

      case "search":
        menuTitle = "Search";
        menuResponse = `
╭─❒ 「 ${toFancyFont("Search")} 🔍 」
│ ✘ *${toFancyFont("play")}*
│ ✘ *${toFancyFont("yts")}*
│ ✘ *${toFancyFont("imdb")}*
│ ✘ *${toFancyFont("google")}*
│ ✘ *${toFancyFont("gimage")}*
│ ✘ *${toFancyFont("pinterest")}*
│ ✘ *${toFancyFont("wallpaper")}*
│ ✘ *${toFancyFont("wikimedia")}*
│ ✘ *${toFancyFont("ytsearch")}*
│ ✘ *${toFancyFont("ringtone")}*
│ ✘ *${toFancyFont("lyrics")}*
╰─────────────
`;
        break;

      case "main":
        menuTitle = "Main";
        menuResponse = `
╭─❒ 「 ${toFancyFont("Main")} ⚙ 」
│ ✘ *${toFancyFont("ping")}*
│ ✘ *${toFancyFont("alive")}*
│ ✘ *${toFancyFont("owner")}*
│ ✘ *${toFancyFont("menu")}*
│ ✘ *${toFancyFont("infobot")}*
╰─────────────