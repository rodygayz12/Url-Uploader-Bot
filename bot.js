const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your Telegram bot token
const token = '7087733832:AAElTO6xQ3Lmc0MLlOKZkS8JVhe28SuzGBA';

// Create a Telegram bot instance
const bot = new TelegramBot(token);

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Check if message contains a link
  if (!msg.text.includes('http')) {
    return bot.sendMessage(chatId, 'Please send a message containing a direct link.');
  }

  const url = msg.text;

  try {
    // Download the file using axios
    const response = await axios.get(url, { responseType: 'stream' });

    // Extract filename from URL (optional)
    const filename = url.split('/').pop();

    // Upload the file using Telegram API
    await bot.sendDocument(chatId, response.data, { filename });

    bot.sendMessage(chatId, 'File uploaded successfully!');
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Error downloading or uploading file.');
  }
});

// Start the bot
bot.startPolling();
