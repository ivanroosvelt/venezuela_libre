require('dotenv').config();
const redis = require('redis');
const { Sequelize, DataTypes } = require('sequelize');
const bot = require('./bot');
const redisClient = redis.createClient();
// File: app.js
const { connectDB } = require('./database');

connectDB();

// Redis connection check
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Sequelize initialization
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
  telegramId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: true
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

// Synchronize the models with the database
(async () => {
  await sequelize.sync();
  console.log('Database synchronized');
})();

bot.start((ctx) => {
  const { id } = ctx.message.chat;
  const { first_name, last_name } = ctx.message.from;

  // Create user in database if not exists
  User.findOrCreate({
    where: { telegramId: id },
    defaults: {
      firstName: first_name,
      lastName: last_name
    }
  });

  // Start conversation with user
  ctx.reply('Bienvenido. Por favor, responde las siguientes preguntas:');
  ctx.reply('¿Cuál es tu nombre?');
});
