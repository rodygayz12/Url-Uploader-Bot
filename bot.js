const botgram = require("botgram")
const bot = botgram("6861294909:AAEf5aupZPVgBeWmfM864AWcLSoRyutDrnY")

bot.command("start", "help", (msg, reply) =>
  reply.text("Wellcome to Url Uploader Bot"))

});

bot.text((msg, reply) => {
    const url = msg.text;

    fetch(url)
        .then(response => {
            const fileStream = fs.createWriteStream('downloaded_file');
            response.body.pipe(fileStream);

            fileStream.on('finish', () => {
                reply.document('downloaded_file');
            });
        })
        .catch(err => {
            console.error('Error downloading file:', err);
            reply.text('Error downloading file.');
        });
});
