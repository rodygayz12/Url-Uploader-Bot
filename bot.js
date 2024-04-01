const botgram = require("botgram")
const bot = botgram("6861294909:AAEf5aupZPVgBeWmfM864AWcLSoRyutDrnY")

bot.command("start", "help", (msg, reply) =>
  reply.text("To schedule an alert, do: /alert <seconds> <text>"))

bot.command("alert", (msg, reply, next) => {
  var [ seconds, text ] = msg.args(2)
  if (!seconds.match(/^\d+$/) || !text) return next()

  setTimeout(() => reply.text(text), Number(seconds) * 1000)
})

bot.command((msg, reply) =>
  reply.text("Invalid command."))
