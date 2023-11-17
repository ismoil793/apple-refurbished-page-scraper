const axios = require('axios');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();

// Function to check the webpage and send Telegram notification
const checkPageAndNotify = async ({notification}) => {
  try {
    // Fetch the webpage content
    const response = await axios.get('https://www.apple.com/shop/refurbished/iphone');
    const html = response.data;

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Check for the desired text
    const desiredTextExists = $('body').text().includes('Refurbished iPhone 13 Pro');

    // If the text is found, send a Telegram notification
    const token = process.env.BOT_TOKEN;
    const chatId = process.env.MY_CHAT_ID;
    const bot = new TelegramBot(token, { polling: false });

    if (desiredTextExists) {
      // Send a notification to the Telegram chat
      bot.sendMessage(chatId, 'Refurbished iPhone 13 Pro found on Apple Store!');
    }
    if(notification?.length) {
        bot.sendMessage(chatId, notification);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the function periodically (for example, every morning and evening)
// You can use node-cron or another scheduler library to handle the scheduling.

// For example, using node-cron to run the function every day at 8 AM and 8 PM
const cron = require('node-cron');
const { log } = require('console');

cron.schedule('0 8,20 * * *', () => {
  checkPageAndNotify();
});
checkPageAndNotify({notification: "deploy succeded!"});