const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // For downloading files

// Replace with your Telegram bot token
const token = '7087733832:AAElTO6xQ3Lmc0MLlOKZkS8JVhe28SuzGBA';

const bot = new TelegramBot(token);

bot.on('text', async (msg) => {
  const chatId = msg.chat.id;
  const url = msg.text;

  // Validate URL format (http/https)
  if (!url.startsWith('http')) {
    bot.sendMessage(chatId, 'Please provide a valid URL.');
    return;
  }

  try {
    const response = await axios.get(url, { responseType: 'stream' }); // Download the file

    // Upload logic (replace with your preferred hosting provider's API)
    const uploadedUrl = await uploadToTelegram(response.data); // Replace with your upload function

    // Send downloadable URL
    await bot.sendMessage(chatId, `Downloaded file: ${uploadedUrl}`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});

// Replace this function with your upload logic
function uploadToTelegram(data) {
  // Replace with your upload function to return the downloadable URL on Telegram
}
// HTTP server to indicate bot is running (optional)
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bot is running!');
});

server.listen(8080, () => console.log('Server listening on port 8080'));
