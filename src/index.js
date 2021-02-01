require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;

const Bot = require('./lib/bot');
const bot = new Bot(BOT_TOKEN);
bot.start();