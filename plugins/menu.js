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

const menu = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const mode = config.MODE === "public" ? "public" : "private";
  const totalCommands = 70; // Approximate count of all commands

  const validCommands = ["list", "help", "menu"];

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

> ${pushwish} *${m.pushName}*! Reply with a number (1-9) to select a menu:

╭─❒ 「 ${toFancyFont("MENU LIST")} 📑 」
│ ✘ 1. *${toFancyFont("Download")}*
│ ✘ 2. *${toFancyFont("Converter")}*
│ ✘ 3. *${toFancyFont("AI")}*
│ ✘ 4. *${toFancyFont("Tools")}*
│ ✘ 5. *${toFancyFont("Group")}*
│ ✘ 6. *${toFancyFont("Search")}*
│ ✘ 7. *${toFancyFont("Main")}*
│ ✘ 8. *${toFancyFont("Owner")}*
│ ✘ 9. *${toFancyFont("Stalk")}*
╰─────────────

> Pσɯҽɾҽԃ Ⴆყ Tσxιƈ-ɱԃȥ`;

    // Fetch image
    let menuImage;
    try {
      const response = await axios.get("https://files.catbox.moe/y2utve.jpg", { responseType: "arraybuffer" });
      menuImage = Buffer.from(response.data, "binary");
    } catch (error) {
      console.error("❌ Error fetching menu image:", error);
      return Matrix.sendMessage(m.from, { text: "Failed to load menu image." }, { quoted: m });
    }

    // Send menu
    const sentMessage = await Matrix.sendMessage(
      m.from,
      {
        image: menuImage,
        caption: mainMenu,
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

    // Set up listener for menu selection
    Matrix.ev.on("messages.upsert", async (event) => {
      const receivedMessage = event.messages[0];
      if (!receivedMessage?.message?.extendedTextMessage) return;

      const receivedText = receivedMessage.message.extendedTextMessage.text.trim();
      if (receivedMessage.message.extendedTextMessage.contextInfo?.stanzaId !== sentMessage.key.id) return;

      let menuTitle;
      let menuResponse;

      switch (receivedText) {
        case "1":
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

        case "2":
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

        case "3":
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

        case "4":
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

        case "5":
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

        case "6":
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

        case "7":
          menuTitle = "Main";
          menuResponse = `
╭─❒ 「 ${toFancyFont("Main")} ⚙ 」
│ ✘ *${toFancyFont("ping")}*
│ ✘ *${toFancyFont("alive")}*
│ ✘ *${toFancyFont("owner")}*
│ ✘ *${toFancyFont("menu")}*
│ ✘ *${toFancyFont("infobot")}*
╰─────────────
`;
          break;

        case "8":
          menuTitle = "Owner";
          menuResponse = `
╭─❒ 「 ${toFancyFont("Owner")} 🔒 」
│ ✘ *${toFancyFont("join")}*
│ ✘ *${toFancyFont("leave")}*
│ ✘ *${toFancyFont("block")}*
│ ✘ *${toFancyFont("unblock")}*
│ ✘ *${toFancyFont("setppbot")}*
│ ✘ *${toFancyFont("anticall")}*
│ ✘ *${toFancyFont("setstatus")}*
│ ✘ *${toFancyFont("setnamebot")}*
│ ✘ *${toFancyFont("autotyping")}*
│ ✘ *${toFancyFont("alwaysonline")}*
│ ✘ *${toFancyFont("autoread")}*
│ ✘ *${toFancyFont("autosview")}*
╰─────────────
`;
          break;

        case "9":
          menuTitle = "Stalk";
          menuResponse = `
╭─❒ 「 ${toFancyFont("Stalk")} 🕵 」
│ ✘ *${toFancyFont("truecaller")}*
│ ✘ *${toFancyFont("instastalk")}*
│ ✘ *${toFancyFont("githubstalk")}*
╰─────────────
`;
          break;

        default:
          menuTitle = "Invalid Choice";
          menuResponse = `*${toFancyFont("Invalid Reply")}* Please reply with a number between 1 to 9`;
      }

      // Format the full response
      const fullResponse = `
╭─❒ 「 ${toFancyFont("Toxic-MD")} - ${toFancyFont(menuTitle)} ⚠ 」
│
│ 🤖 *${toFancyFont("Bot")}*: ${toFancyFont("Toxic-MD")}
│ 👤 *${toFancyFont("User")}*: ${m.pushName}
│ 🔣 *${toFancyFont("Prefix")}*: ${prefix}
│ 📚 *${toFancyFont("Library")}*: Baileys
╰─────────────

${menuResponse}

> Pσɯҽɾҽԃ Ⴆყ Tσxιƈ-ɱԃȥ`;

      // Send response
      await Matrix.sendMessage(
        m.from,
        {
          image: menuImage,
          caption: fullResponse,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
          },
        },
        { quoted: receivedMessage }
      );
    });
  }
};

export default menu;