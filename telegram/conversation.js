// File: conversation.js
const { Composer } = require('telegraf');
const User = require('./models/user');
const redisClient = require('./redisClient');

const conversation = new Composer();

conversation.drop((example) => {
  console.log("drop", example);
});
conversation.use(async (ctx, next) => {
  console.log(ctx.update);
  await next();
})
conversation.on('text', async (ctx) => {
  const { id } = ctx.message.chat;
  const text = ctx.message.text;

  // Retrieve the user's current step from Redis
  redisClient.get(`step:${id}`, async (err, step) => {
    if (err) throw err;

    switch (step) {
      case null:
        await User.update({ firstName: text }, { where: { telegramId: id } });
        ctx.reply('¿Cuál es tu apellido?');
        redisClient.set(`step:${id}`, 'lastName');
        break;

      case 'lastName':
        await User.update({ lastName: text }, { where: { telegramId: id } });
        ctx.reply('¿Cuál es tu edad?');
        redisClient.set(`step:${id}`, 'age');
        break;

      case 'age':
        await User.update(
          { age: parseInt(text, 10) },
          { where: { telegramId: id } }
        );
        ctx.reply('¿Cuál es tu género?', {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Masculino', callback_data: 'male' }],
              [{ text: 'Femenino', callback_data: 'female' }]
            ]
          }
        });
        redisClient.set(`step:${id}`, 'gender');
        break;
    }
  });
});

conversation.action(['male', 'female'], async (ctx) => {
  const { id } = ctx.update.callback_query.message.chat;
  const gender = ctx.update.callback_query.data;

  await User.update({ gender }, { where: { telegramId: id } });
  await User.update({ confirmed: true }, { where: { telegramId: id } });

  // Clear all messages in chat
  const chatId = ctx.update.callback_query.message.chat.id;
  const messageId = ctx.update.callback_query.message.message_id;
  for (let i = messageId; i >= 0; i--) {
    try {
      await ctx.telegram.deleteMessage(chatId, i);
    } catch (e) {}
  }

  ctx.reply('Gracias por completar la información. Pronto se te contactará.');

  // Reset step in Redis
  redisClient.del(`step:${id}`);
});

module.exports = conversation;
