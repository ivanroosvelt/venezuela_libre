const { Telegraf } = require('telegraf');
const conversation = require('./conversation');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(conversation);

bot.launch().then(() => {
  console.log('Bot started');
});

module.exports = bot;
