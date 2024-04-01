const { Bot } = require('botgram');
const fetch = require('node-fetch');
const fs = require('fs');

const bot = new Bot({
    token: '6861294909:AAEf5aupZPVgBeWmfM864AWcLSoRyutDrnY'
});

bot.command('start', (msg, reply) => {
    reply.text('Welcome! Send me a direct URL to download a file.');
});

bot.text((msg, reply) => {
    const url = msg.text;

    fetch(url)
        .then(response => {
            const fileStream = fs.createWriteStream('downloaded_file');
            response.body.pipe(fileStream);

            fileStream.on('finish', () => {
                reply.document({ filename: 'downloaded_file', file: fs.createReadStream('downloaded_file') });
            });
        })
        .catch(err => {
            console.error('Error downloading file:', err);
            reply.text('Error downloading file.');
        });
});

bot.start();
