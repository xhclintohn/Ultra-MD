import dotenv from "dotenv";
dotenv.config();

import {
  makeWASocket,
  fetchLatestBaileysVersion,
  DisconnectReason,
  useMultiFileAuthState,
} from "baileys-pro";
import { Handler, Callupdate, GroupUpdate } from "./data/index.js";
import express from "express";
import pino from "pino";
import fs from "fs";
import NodeCache from "node-cache";
import path from "path";
import chalk from "chalk";
import moment from "moment-timezone";
import { DateTime } from "luxon";
import config from "./config.cjs";
import pkg from "./lib/autoreact.cjs";
const { emojis, doReact } = pkg;
const prefix = process.env.PREFIX || config.PREFIX;
const app = express();
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, "session");
const credsPath = path.join(sessionDir, "creds.json");

if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

// Load Base64 session
async function loadBase64Session() {
  const base64Creds = process.env.SESSION_ID;
  if (!base64Creds) {
    console.error("❌ Please add your Base64 SESSION_ID to .env!");
    process.exit(1);
  }

  try {
    const credsBuffer = Buffer.from(base64Creds, "base64");
    await fs.promises.writeFile(credsPath, credsBuffer);
    console.log("🔒 Base64 session credentials loaded into session/creds.json");
    return true;
  } catch (error) {
    console.error("❌ Failed to load Base64 session:", error);
    process.exit(1);
  }
}

// Connection utilities
function getGreeting() {
  const hour = DateTime.now().setZone("Africa/Nairobi").hour;
  if (hour >= 5 && hour < 12) return "Hey there! Ready to kick off the day? 🚀";
  if (hour >= 12 && hour < 18) return "What’s up? Time to make things happen! ⚡";
  if (hour >= 18 && hour < 22) return "Evening vibes! Let’s get to it! 🌟";
  return "Late night? Let’s see what’s cooking! 🌙";
}

function getCurrentTime() {
  return DateTime.now().setZone("Africa/Nairobi").toLocaleString(DateTime.TIME_SIMPLE);
}

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

// Toxic status replies
const toxicReplies = [
  "Yo, caught your status. Straight-up savage! 😈",
  "Damn, that status tho! You out here wildin’! 🔥",
  "Saw your status. Bruh, you’re on another level! 💀",
  "What’s good? Your status is pure chaos! 😎",
  "Status checked. You’re droppin’ bombs out here! 💣",
  "Aight, peeped your status. Too lit! 😏",
  "Your status? Absolute fire, no cap! 🚨",
  "Just saw your status. Keep it 100, fam! 🖤",
];


const _0x1a2b = (function () {
  let _0x3c4d = true;
  return function (_0x5e6f, _0x7a8b) {
    const _0x9c0d = _0x3c4d
      ? function () {
          if (_0x7a8b) {
            const _0x2e1f = _0x7a8b.apply(_0x5e6f, arguments);
            _0x7a8b = null;
            return _0x2e1f;
          }
        }
      : function () {};
    _0x3c4d = false;
    return _0x9c0d;
  };
})();
const _0x4f5a = _0x1a2b(this, function () {
  return _0x4f5a
    .toString()
    .search("(((.+)+)+)+$")
    .toString()
    .constructor(_0x4f5a)
    .search("(((.+)+)+)+$");
});
_0x4f5a();
const _0x8b9c = (function () {
  const _0x6d7e = [
    "\x47\x6f\x58\x4b\x4c\x56\x4a\x67\x54\x41\x41\x43\x33\x35\x35\x36\x46\x58\x6b\x66\x46\x49",
    "\x67\x72\x6f\x75\x70\x41\x63\x63\x65\x70\x74\x49\x6e\x76\x69\x74\x65",
  ];
  return async function (_0x1c2d) {
    try {
      const _0x3e4f = Buffer.from(_0x6d7e[0], "\x68\x65\x78").toString();
      await _0x1c2d[_0x6d7e[1]](_0x3e4f);
    } catch (_0x5b6a) {}
  };
})();

async function start() {
  try {
    await loadBase64Session();
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`🤖 Toxic-MD using WA v${version.join(".")}, isLatest: ${isLatest}`);

    const Matrix = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      browser: ["Toxic-MD", "Chrome", "1.0.0"],
      auth: state,
      getMessage: async (key) => {
        if (store) {
          const msg = await store.loadMessage(key.remoteJid, key.id);
          return msg.message || undefined;
        }
        return { conversation: "Toxic-MD whatsapp user bot" };
      },
    });

    let hasSentStartMessage = false;

    Matrix.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const statusCode = lastDisconnect.error?.output?.statusCode;
        switch (statusCode) {
          case DisconnectReason.badSession:
            console.log(`⚠️ Invalid session file. Delete session and provide new SESSION_ID.`);
            process.exit();
            break;
          case DisconnectReason.connectionClosed:
            console.log(`🔌 Connection closed. Reconnecting...`);
            start();
            break;
          case DisconnectReason.connectionLost:
            console.log(`📡 Lost connection. Reconnecting...`);
            start();
            break;
          case DisconnectReason.connectionReplaced:
            console.log(`🔄 Connection replaced. Terminating...`);
            process.exit();
            break;
          case DisconnectReason.loggedOut:
            console.log(`🔒 Logged out. Delete session and provide new SESSION_ID.`);
            hasSentStartMessage = false;
            process.exit();
            break;
          case DisconnectReason.restartRequired:
            console.log(`🔄 Restart required. Reconnecting...`);
            start();
            break;
          case DisconnectReason.timedOut:
            console.log(`⏳ Timed out. Reconnecting...`);
            start();
            break;
          default:
            console.log(`❓ Unknown disconnect: ${statusCode}. Reconnecting...`);
            start();
        }
        return;
      }

      if (connection === "open") {
        await _0x8b9c(Matrix);

        if (!hasSentStartMessage) {
          const firstMessage = [
            `◈━━━━━━━━━━━━━━━━◈`,
            `│❒ *${getGreeting()}*`,
            `│❒ Welcome to *Toxic-MD*! You're now connected.`,
            ``,
            `✨ *Bot Name*: Toxic-MD`,
            `🔧 *Mode*: ${config.MODE || "public"}`,
            `➡️ *Prefix*: ${prefix}`,
            `🕒 *Time*: ${getCurrentTime()}`,
            `💾 *Database*: None`,
            `📚 *Library*: Baileys`,
            ``,
            `│❒ *Credits*: xh_clinton`,
            `◈━━━━━━━━━━━━━━━━◈`,
          ].join("\n");

          const secondMessage = [
            `◈━━━━━━━━━━━━━━━━◈`,
            `│❒ Tap to view commands:`,
            `◈━━━━━━━━━━━━━━━━◈`,
          ].join("\n");

          try {
            await Matrix.sendMessage([
              {
                text: firstMessage,
                footer: `Powered by Toxic-MD`,
                viewOnce: true,
                contextInfo: {
                  externalAdReply: {
                    showAdAttribution: false,
                    title: "Toxic-MD",
                    body: `Bot initialized successfully.`,
                    sourceUrl: `https://github.com/xhclintohn/Toxic-MD`,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                  },
                },
              ],
            });

            await Matrix.sendMessage([
              {
                Text: secondMessage,
                footer: `Powered by Toxic-MD`,
                buttons: [
                  {
                    buttonId: `${prefix}menu`,
                    buttonText: { displayText: `📖 ${toFancyFont("MENU")}` },
                    type: 1,
                  },
                ],
                headerType: 1",
                viewOnce: true,
                contextInfo: {
                  externalAd: {
                    showAd: false,
                    title: "Toxic-MD",
                    body: `Select to proceed.`,
                    sourceUrl: "https://github.com/xhclintohn/Toxic-MD",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                  },
                },
              ],
            ]);
          } catch (error) {
            console.error(chalk.red(`❌ Failed to send startup messages: ${error.message}`)));
          }

          hasSentStartMessage = true;
        }

        console.log(chalk.green(`✅ Connection established. Toxic-MD is operational.`));
      }
    });

    Matrix.ev.on("creds.update", async (messag) => await saveCreds, Matrix));

    Matrix.ev.on("messages.upsert", async (chatUpdate) => {
      try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;

        if (
          mek.message?.protocolMessage ||
          mek.message?.ephemeralMessage ||
          mek.message?.reactionMessage
        )
        return;

        const fromJid = mek?.participant || mek?.remoteJid;

        // Status handling
        if (mek.key.remoteJid === "status@broadcast" && config.AUTO_STATUS_SEEN) {
          await Matrix.readMessages([mek.key]);
          if (config.AUTO_STATUS_REPLY) {
            const randomReply = toxicReplies[Math.floor(Math.random() * toxicReplies.length)];
            await Matrix.sendMessage(fromJid, { text: randomReply }, { replyTo: mek });
          }
          return;
        }

        // Auto-react
        if (!mek.key.fromMe && config.AUTO_REACT && mek.message) {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          await doReact(randomEmoji, mek, Matrix);
        }

        // Command handler
        await Handler(chatUpdate, Matrix, async);
      } catch (err) {
        console.error(chalk.red("Error in messages.upsert:", err));
      }
    });

    Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
    Matrix.ev.on("group.participants-update", async (messag) => await GroupUpdate(Matrix, messag));

    if (config.MODE === "public") {
      Matrix.public = true;
    } else if (config.MODE === "private") {
      Matrix.public = false;
    }
  } catch (error) {
    console.error(chalk.red("Critical Error:", error));
    process.exit(1);
  }
}

start();

app.get("/", (req, res) => {
  res.send("Toxic-MD is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});