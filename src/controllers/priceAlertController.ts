import { Message } from "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import CoinGecko from "coingecko-api";
import schedule from "node-schedule";
import PriceAlert from "../models/PriceAlert";
import { logger } from "../index";

const CoinGeckoClient = new CoinGecko();

export async function handlePriceAlert(
  bot: TelegramBot,
  msg: Message,
  match: RegExpExecArray | null
) {
  const chatId = msg.chat.id;

  try {
    const params = match ? match[1].split(" ") : [];
    const [tokenId, direction, priceStr] = params;

    const targetPrice = parseFloat(priceStr);

    if (
      !tokenId ||
      !["above", "below"].includes(direction) ||
      isNaN(targetPrice)
    ) {
      await bot.sendMessage(
        chatId,
        "Usage: /setalert <token_id> <above|below> <price>"
      );
      return;
    }

    const priceAlert = new PriceAlert({
      chatId,
      tokenId,
      direction,
      targetPrice,
    });
    await priceAlert.save();

    await bot.sendMessage(chatId, "Your price alert has been set.");
  } catch (error) {
    logger.error("Price Alert Setup Error:", error);
    await bot.sendMessage(
      chatId,
      "An error occurred while setting up your price alert."
    );
  }
}

export async function schedulePriceAlerts(bot: TelegramBot) {
  schedule.scheduleJob("*/5 * * * *", async () => {
    try {
      const alerts = await PriceAlert.find({});
      for (const alert of alerts) {
        const data = await CoinGeckoClient.simple.price({
          ids: [alert.tokenId],
          vs_currencies: ["usd"],
        });

        const currentPrice = data.data[alert.tokenId]?.usd;

        if (!currentPrice) continue;

        if (
          (alert.direction === "above" && currentPrice >= alert.targetPrice) ||
          (alert.direction === "below" && currentPrice <= alert.targetPrice)
        ) {
          await bot.sendMessage(
            alert.chatId,
            `Price alert: ${alert.tokenId} is now ${currentPrice} USD.`
          );
          await PriceAlert.deleteOne({ _id: alert._id });
        }
      }
    } catch (error) {
      logger.error("Price Alert Execution Error:", error);
    }
  });
}
