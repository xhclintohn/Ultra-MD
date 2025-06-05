import axios from 'axios';
import config from '../config.cjs';

const gpt = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const prompt = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['ai', 'gpt', 'g'];

  if (validCommands.includes(cmd)) {
    if (!prompt) {
      await Matrix.sendMessage(m.from, { text: 'Please give me a prompt' }, { quoted: m });
      return;
    }

    try {
      await m.React("⏳");

      const apiUrl = `https://api.giftedtech.web.id/api/ai/gpt?apikey=gifted_api_se5dccy&q=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.status === 200 && data.success) {
        const answer = data.result;
        await Matrix.sendMessage(m.from, { text: answer }, { quoted: m });
        await m.React("✅");
      } else {
        throw new Error('Invalid response from the API.');
      }
    } catch (err) {
      await Matrix.sendMessage(m.from, { text: "Something went wrong" }, { quoted: m });
      console.error('Error: ', err);
      await m.React("❌");
    }
  }
};

export default gpt;