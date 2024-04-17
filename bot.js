const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');
const progress = require('progress-stream');

// Replace with your Telegram bot token
const token = '7087733832:AAElTO6xQ3Lmc0MLlOKZkS8JVhe28SuzGBA';

// Create a Telegram bot instance
const bot = new TelegramBot(token);

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running!');
});

server.listen(8080, () => {
  console.log('HTTP server listening on port 8080');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Check if message contains a link
  if (!msg.text.includes('http')) {
    return bot.sendMessage(chatId, 'Please send a message containing a direct link.');
  }

  const url = msg.text;

  try {
    // Download the file using axios with progress bar
    const response = await axios.get(url, { responseType: 'stream' });

    const filename = url.split('/').pop();

    const progressBar = progress({
      length: parseInt(response.headers['content-length'], 10),
      total: parseInt(response.headers['content-length'], 10),
      char: '#',
      incomplete: '-',
      complete: '=',
      width: 50,
    });

    response.data.pipe(progressBar);

    progressBar.on('progress', (progress) => {
      const percentage = Math.floor(progress.completed * 100);
      bot.sendMessage(chatId, `Downloading: ${percentage}% complete`);
    });

    progressBar.on('end', async () => {
      // Upload the file using Telegram API with progress bar
      const fileStream = progressBar; // Assuming progress stream is compatible with Telegram API

      const uploadProgress = progress({
        length: parseInt(response.headers['content-length'], 10),
        total: parseInt(response.headers['content-length'], 10),
        char: '#',
        incomplete: '-',
        complete: '=',
        width: 50,
      });

      fileStream.pipe(uploadProgress);

      uploadProgress.on('progress', (progress) => {
        const percentage = Math.floor(progress.completed * 100);
        bot.sendMessage(chatId, `Uploading: ${percentage}% complete`);
      });

      await bot.sendDocument(chatId, fileStream, { filename });
      bot.sendMessage(chatId, 'File uploaded successfully!');
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Error downloading or uploading file.');
  }
});

// Start the bot
bot.startPolling();
