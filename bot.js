const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// Replace with your Telegram bot token
const token = '7087733832:AAElTO6xQ3Lmc0MLlOKZkS8JVhe28SuzGBA';

const bot = new TelegramBot(token);

// Function to upload downloaded file (replace with your implementation)
function uploadToTelegram(data) {
  // Implement your logic here to upload the file to Telegram and return the downloadable URL
  // This could involve Telegram's built-in upload functionality or a third-party service

  console.warn('Upload logic not implemented. Please replace this function with your chosen upload method.');
  return 'https://example.com/placeholder_file.txt'; // Placeholder URL for demonstration
}

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

    const uploadedUrl = await uploadToTelegram(response.data);

    // Send downloadable URL
    await bot.sendMessage(chatId, `Downloaded file: ${uploadedUrl}`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});

// HTTP server for bot live status
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bot is running!');
});

server.listen(8080, () => console.log('Server listening on port 8080'));
