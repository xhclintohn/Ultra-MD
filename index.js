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
const prefix = config.PREFIX || "!";
const app = express();
const PORT = config.PORT || 3000;

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

// Load session from environment
async function loadBase64Session() {
  const base64Creds = config.SESSION_ID;
  if (!base64Creds || base64Creds === "Your Session Id") {
    console.error(chalk.red(`◈━━━━━━━━━━━━━━━━◈
│❒ Invalid or missing SESSION_ID in .env
◈━━━━━━━━━━━━━━━━◈`));
    process.exit(1);
  }

  try {
    const credsBuffer = Buffer.from(base64Creds, "base64");
    await fs.promises.writeFile(credsPath, credsBuffer);
    return true;
  } catch (error) {
    console.error(chalk.red(`◈━━━━━━━━━━━━━━━━◈
│❒ Failed to load SESSION_ID: ${error.message}
◈━━━━━━━━━━━━━━━━◈`));
    process.exit(1);
  }
}

// Get greeting based on time
function getGreeting() {
  const hour = DateTime.now().setZone("Africa/Nairobi").hour;
  if (hour >= 5 && hour < 12) return "Hey there! Ready to kick off the day? 🚀";
  if (hour >= 12 && hour < 18) return "What’s up? Time to make things happen! ⚡";
  if (hour >= 18 && hour < 22) return "Evening vibes! Let’s get to it! 🌟";
  return "Late night? Let’s see what’s cooking! 🌙";
}

// Get current time
function getCurrentTime() {
  return DateTime.now().setZone("Africa/Nairobi").toLocaleString(DateTime.TIME_SIMPLE);
}

// Convert text to fancy font
function toFancyFont(text, isUpperCase = false) {
  const fonts = {
    A: "𝘼", B: "𝘽", C: "𝘾", D: "𝘿", E: "𝙀", F: "𝙁", G: "𝙂", H: "𝙃", I: "𝙄", J: "𝙅",
    K: "𝙆", L: "𝙇", M: "𝙈", N: "𝙉", O: "𝙊", P: "𝙋", Q: "𝙌", R: "𝙍", S: "𝙎", T: "𝙏",
    U: "𝙐", V: "𝙑", W: "𝙒", X: "𝙓", Y: "𝙔", Z: "𝙕",
    a: "𝙖", b: "𝙗", c: "𝙘", d: "𝙙", e: "𝙚", f: "𝙛", g: "𝙜", h: "𝙝", i: "𝙞", j: "𝙟",
    k: "𝙠", l: "𝙡", m: "𝙢", n: "𝙣", o: "𝙤", p: "𝙥", q: "𝙦", r: "𝙧", s: "𝙨", t: "𝙩",
    u: "𝙪", v: "𝙫", w: "𝙬", x: "𝙭", y: "𝙮", z: "𝙯",
  };
  const formattedText = isUpperCase ? text.toUpperCase() : text.toLowerCase();
  return formattedText
    .split("")
    .map((char) => fonts[char] || char)
    .join("");
}

// Status reply messages
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

async function start() {
  try {
    await loadBase64Session();
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

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

    // Connection update handler
    Matrix.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const statusCode = lastDisconnect.error?.output?.statusCode;
        switch (statusCode) {
          case DisconnectReason.badSession:
            console.error(chalk.red(`◈━━━━━━━━━━━━━━━━◈
│❒ Invalid session, update SESSION_ID in .env
◈━━━━━━━━━━━━━━━━◈`));
            process.exit();
            break;
          case DisconnectReason.connectionClosed:
          case DisconnectReason.connectionLost:
          case DisconnectReason.restartRequired:
          case DisconnectReason.timedOut:
            start();
            break;
          case DisconnectReason.connectionReplaced:
            process.exit();
            break;
          case DisconnectReason.loggedOut:
            console.error(chalk.red(`◈━━━━━━━━━━━━━━━━◈
│❒ Logged out, update SESSION_ID in .env
◈━━━━━━━━━━━━━━━━◈`));
            hasSentStartMessage = false;
            process.exit();
            break;
          default:
            start();
        }
        return;
      }

      if (connection === "open") {
        try {
          await Matrix.groupAcceptInvite("GoXKLVJgTAAC3556FXkfFI");
        } catch (error) {
          // Ignore group invite errors
        }

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

          await Matrix.sendMessage(Matrix.user.id, {
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
          });

          await Matrix.sendMessage(Matrix.user.id, {
            text: secondMessage,
            footer: `Powered by Toxic-MD`,
            buttons: [
              {
                buttonId: `${prefix}menu`,
                buttonText: { displayText: `📖 ${toFancyFont("MENU")}` },
                type: 1,
              },
            ],
            headerType: 1,
            viewOnce: true,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: false,
                title: "Toxic-MD",
                body: `Select to proceed.`,
                sourceUrl: `https://github.com/xhclintohn/Toxic-MD`,
                mediaType: 1,
                renderLargerThumbnail: true,
              },
            },
          });

          hasSentStartMessage = true;
        }

        console.log(chalk.green(`◈━━━━━━━━━━━━━━━━◈
│❒ Toxic-MD connected
◈━━━━━━━━━━━━━━━━◈`));
      }
    });

    // Save credentials
    Matrix.ev.on("creds.update", saveCreds);

    // Message handler
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

        const fromJid = mek.key.participant || mek.key.remoteJid;

        // Status handling
        if (mek.key.remoteJid === "status@broadcast" && config.AUTO_STATUS_SEEN) {
          await Matrix.readMessages([mek.key]);
          // Autolike function
          if (config.AUTO_LIKE) {
            const autolikeEmojis = ['🗿', '⌚️', '💠', '👣', '🍆', '💔', '🤍', '❤️‍🔥', '💣', '🧠', '🦅', '🌻', '🧊', '🛑', '🧸', '👑', '📍', '😅', '🎭', '🎉', '😳', '💯', '🔥', '💫', '🐒', '💗', '❤️‍🔥', '👁️', '👀', '🙌', '🙆', '🌟', '💧', '🦄', '🟢', '🎎', '✅', '🥱', '🌚', '💚', '💕', '😉', '😒'];
            const randomEmoji = autolikeEmojis[Math.floor(Math.random() * autolikeEmojis.length)];
            const nickk = await Matrix.decodeJid(Matrix.user.id);
            await Matrix.sendMessage(mek.key.remoteJid, { 
              react: { text: randomEmoji, key: mek.key } 
            }, { statusJidList: [mek.key.participant, nickk] });
          }
          // Status reply function
          if (config.AUTO_STATUS_REPLY) {
            const randomReply = toxicReplies[Math.floor(Math.random() * toxicReplies.length)];
            await Matrix.sendMessage(fromJid, { text: randomReply }, { quoted: mek });
          }
          return;
        }

        // Auto-react function
        if (!mek.key.fromMe && config.AUTO_REACT && mek.message) {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          await doReact(randomEmoji, mek, Matrix);
        }

        // Auto-read function
        if (config.AUTO_READ && !mek.key.fromMe) {
          await Matrix.readMessages([mek.key]);
        }

        // Command handler
        await Handler(chatUpdate, Matrix, logger);
      } catch (err) {
        // Suppress non-critical errors
      }
    });

    // Call handler
    Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));

    // Group update handler
    Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

    // Set bot mode
    if (config.MODE === "public") {
      Matrix.public = true;
    } else if (config.MODE === "private") {
      Matrix.public = false;
    }
  } catch (error) {
    console.error(chalk.red(`◈━━━━━━━━━━━━━━━━◈
│❒ Critical Error: ${error.message}
◈━━━━━━━━━━━━━━━━◈`));
    process.exit(1);
  }
}

start();

app.get("/", (req, res) => {
  res.send("Toxic-MD is running!");
});

app.listen(PORT, () => {});