import dotenv from "dotenv";
dotenv.config();

import {
  makeWASocket,
  Browsers,
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
import config from "./config.cjs";
import pkg from "./lib/autoreact.cjs";
const { emojis, doReact } = pkg;
const prefix = process.env.PREFIX || config.PREFIX;
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
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
    return false;
  }

  try {
    const credsBuffer = Buffer.from(base64Creds, "base64");
    await fs.promises.writeFile(credsPath, credsBuffer);
    console.log("🔒 Base64 session credentials loaded into session/creds.json");
    return true;
  } catch (error) {
    console.error("❌ Failed to load Base64 session:", error);
    return false;
  }
}

async function start() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`🤖 Toxic-MD using WA v${version.join(".")}, isLatest: ${isLatest}`);

    const Matrix = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: useQR,
      browser: ["Toxic-MD", "Chrome", "1.0.0"], // Unique browser ID
      auth: state,
      getMessage: async (key) => {
        if (store) {
          const msg = await store.loadMessage(key.remoteJid, key.id);
          return msg.message || undefined;
        }
        return { conversation: "Toxic-MD whatsapp user bot" };
      },
    });

    Matrix.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
          start();
        }
      } else if (connection === "open") {
        if (initialConnection) {
          console.log(chalk.green("Connected Successfully Toxic-MD 🤍"));
          Matrix.sendMessage(Matrix.user.id, {
            image: { url: "https://files.catbox.moe/pf270b.jpg" },
            caption: `*Hello there xh_clinton User! 👋🏻*

> Simple, Straightforward, But Loaded With Features 🎊. Meet Toxic-MD WhatsApp Bot.

*Thanks for using Toxic-MD 🚩*

> Join WhatsApp Channel: ⤵️
https://whatsapp.com/channel/0029VagJlnG6xCSU2tS1Vz19

- *YOUR PREFIX:* = ${prefix}

Don't forget to give a star to the repo ⬇️
https://github.com/xhclintohn/Toxic-MD

> © Powered BY 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧🖤`,
          });
          initialConnection = false;
        } else {
          console.log(chalk.blue("♻️ Connection reestablished after restart."));
        }
      }
    });

    Matrix.ev.on("creds.update", saveCreds);

    Matrix.ev.on("messages.upsert", async (chatUpdate) => {
      try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;

        // Skip protocol messages and reactions
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
          console.log(chalk.blue(`Viewed status ${mek.key.id}`));
          if (config.AUTO_STATUS_REPLY) {
            const customMessage = config.STATUS_READ_MSG || "✅ Auto Status Seen Bot By Toxic-MD";
            await Matrix.sendMessage(fromJid, { text: customMessage }, { quoted: mek });
            console.log(chalk.blue(`Replied to status ${mek.key.id}`));
          }
          return; // Skip further processing for statuses
        }

        // Auto-react
        if (!mek.key.fromMe && config.AUTO_REACT && mek.message) {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          await doReact(randomEmoji, mek, Matrix);
          console.log(chalk.blue(`Auto-reacted with ${randomEmoji} to ${mek.key.id}`));
        }

        // Command handler
        await Handler(chatUpdate, Matrix, logger);
      } catch (err) {
        console.error(chalk.red("Error in messages.upsert:", err));
      }
    });

    Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
    Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

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

async function init() {
  if (fs.existsSync(credsPath)) {
    console.log("🔒 Session file found, proceeding without QR code.");
    await start();
  } else {
    const sessionLoaded = await loadBase64Session();
    if (sessionLoaded) {
      console.log("🔒 Base64 session loaded, starting bot.");
      await start();
    } else {
      console.log("No session found or loaded, QR code will be printed for authentication.");
      useQR = true;
      await start();
    }
  }
}

init();

app.get("/", (req, res) => {
  res.send("Toxic-MD is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});