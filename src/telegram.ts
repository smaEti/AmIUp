import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
const token = process.env.TELEGRAM_API;
const bot = new TelegramBot(token!, {polling: true});   
bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome your id is stored in our DB for monitoring");
    
    });