import { Message } from "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import { createPayment } from "../services/mercuryoService";
import { validateAmount } from "../utils/validation";
import User from "../models/User";
import { logger } from "../index";

export async function handleBuy(
  bot: TelegramBot,
  msg: Message,
  match: RegExpExecArray | null
) {
  const chatId = msg.chat.id;

  try {
    const amountStr = match ? match[1] : "";
    const amount = parseFloat(amountStr);

    if (!validateAmount(amount)) {
      await bot.sendMessage(chatId, "Please provide a valid amount.");
      return;
    }

    const user = await User.findOne({ chatId });

    if (!user) {
      await bot.sendMessage(
        chatId,
        "User not found. Please send /start to initialize."
      );
      return;
    }

    const payment = await createPayment(amount, "USD");

    // Send payment link or further instructions to the user
    await bot.sendMessage(
      chatId,
      `Please complete your purchase here: ${payment.payment_url}`
    );
  } catch (error) {
    logger.error("Buy Command Error:", error);
    await bot.sendMessage(
      chatId,
      "An error occurred while creating the payment."
    );
  }
}
