import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { handleStart } from "./controllers/startController";
import { handleBuy } from "./controllers/buyController";
import { handleSwap } from "./controllers/swapController";
import { handleDCA } from "./controllers/dcaController";
import { handlePriceAlert } from "./controllers/priceAlertController";
import { schedulePriceAlerts } from "./controllers/priceAlertController";
import { scheduleDCAJobs } from "./controllers/dcaController";
import { handleSwapConfirmation } from "./controllers/swapController";
import winston from "winston";

dotenv.config();

// Initialize Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "solana-telegram-bot" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.Console(),
  ],
});

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, {
  polling: true,
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Schedule DCA Jobs and Price Alerts
scheduleDCAJobs(bot);
schedulePriceAlerts(bot);

// Handle '/start' command
bot.onText(/\/start/, (msg) => handleStart(bot, msg));

// Handle '/buy' command
bot.onText(/\/buy (.+)/, (msg, match) => handleBuy(bot, msg, match));

// Handle '/swap' command
bot.onText(/\/swap (.+)/, (msg, match) => handleSwap(bot, msg, match));

// Handle '/dca' command
bot.onText(/\/dca (.+)/, (msg, match) => handleDCA(bot, msg, match));

// Handle '/setalert' command
bot.onText(/\/setalert (.+)/, (msg, match) =>
  handlePriceAlert(bot, msg, match)
);

// Handle Callback Queries
bot.on("callback_query", (callbackQuery) => {
  handleSwapConfirmation(bot, callbackQuery);
});

bot.on("polling_error", (error) => {
  logger.error("Polling error:", error);
});

// Export bot for use in other modules
export default bot;
export { logger };
