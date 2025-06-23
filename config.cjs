const fs = require("fs");
require("dotenv").config();

const config = {
  SESSION_ID: process.env.SESSION_ID || "Your Session Id",
  PREFIX: process.env.PREFIX || ".",
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? process.env.AUTO_STATUS_SEEN === "true" : true,
  AUTO_LIKE: process.env.AUTO_LIKE !== undefined ? process.env.AUTO_LIKE === "true" : true,
  AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY !== undefined ? process.env.AUTO_STATUS_REPLY === "true" : false,
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || "",
  ANTI_DELETE: process.env.ANTI_DELETE !== undefined ? process.env.ANTI_DELETE === "true" : false,
  ANTI_DELETE_PATH: process.env.ANTI_DELETE_PATH || "inbox",
  AUTO_DL: process.env.AUTO_DL !== undefined ? process.env.AUTO_DL === "true" : false,
  AUTO_READ: process.env.AUTO_READ !== undefined ? process.env.AUTO_READ === "true" : false,
  AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? process.env.AUTO_TYPING === "true" : false,
  AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? process.env.AUTO_RECORDING === "true" : false,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE !== undefined ? process.env.ALWAYS_ONLINE === "true" : true,
  AUTO_REACT: process.env.AUTO_REACT !== undefined ? process.env.AUTO_REACT === "true" : false,
  AUTO_BLOCK: process.env.AUTO_BLOCK !== undefined ? process.env.AUTO_BLOCK === "true" : false,
  REJECT_CALL: process.env.REJECT_CALL !== undefined ? process.env.REJECT_CALL === "true" : false,
  NOT_ALLOW: process.env.NOT_ALLOW !== undefined ? process.env.NOT_ALLOW === "true" : false,
  MODE: process.env.MODE || "public",
  BOT_NAME: process.env.BOT_NAME || "Toxic-MD",
  MENU_IMAGE: process.env.MENU_IMAGE || "https://files.catbox.moe/7l1tt5.jpg",
  DESCRIPTION: process.env.DESCRIPTION || "Savage WhatsApp Bot by Toxic-Master",
  OWNER_NAME: process.env.OWNER_NAME || "Toxic-Master",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "254735342808",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
  WELCOME: process.env.WELCOME !== undefined ? process.env.WELCOME === "true" : false,
};

module.exports = config;