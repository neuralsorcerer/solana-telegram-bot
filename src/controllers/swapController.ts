import { Message, CallbackQuery } from "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import { getSwapQuote, executeSwap } from "../services/jupiterService";
import User from "../models/User";
import { decryptPrivateKey } from "../services/solanaService";
import { validateAmount } from "../utils/validation";
import { logger } from "../index";
import { Keypair } from "@solana/web3.js";

export async function handleSwap(
  bot: TelegramBot,
  msg: Message,
  match: RegExpExecArray | null
) {
  const chatId = msg.chat.id;

  try {
    const params = match ? match[1].split(" ") : [];
    const [inputMint, outputMint, amountStr] = params;

    if (!validateAmount(parseFloat(amountStr))) {
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

    const quote = await getSwapQuote(inputMint, outputMint, amountStr);
    const bestRoute = quote.data[0];

    // Store the route in session or database if necessary
    // For simplicity, we'll send it back in the callback data

    await bot.sendMessage(
      chatId,
      `Best quote found: ${bestRoute.outAmount} tokens for ${amountStr} input. Confirm swap?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Confirm",
                callback_data: `confirm_swap_${Buffer.from(
                  JSON.stringify(bestRoute)
                ).toString("base64")}`,
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    logger.error("Swap Command Error:", error);
    await bot.sendMessage(
      chatId,
      "An error occurred while fetching the swap quote."
    );
  }
}

// Callback Query Handler for Swap Confirmation
export async function handleSwapConfirmation(
  bot: TelegramBot,
  callbackQuery: CallbackQuery
) {
  const chatId = callbackQuery.message?.chat.id;

  if (!chatId) return;

  try {
    const data = callbackQuery.data;

    if (data?.startsWith("confirm_swap_")) {
      const routeBase64 = data.replace("confirm_swap_", "");
      const routeJson = Buffer.from(routeBase64, "base64").toString("utf-8");
      const route = JSON.parse(routeJson);

      const user = await User.findOne({ chatId });

      if (!user) {
        await bot.sendMessage(
          chatId,
          "User not found. Please send /start to initialize."
        );
        return;
      }

      const privateKey = decryptPrivateKey(user.encryptedPrivateKey);
      const userKeypair = Keypair.fromSecretKey(privateKey);

      const txId = await executeSwap(userKeypair, route);

      await bot.sendMessage(
        chatId,
        `Swap executed successfully. Transaction ID: ${txId}`
      );
    }
  } catch (error) {
    logger.error("Swap Confirmation Error:", error);
    await bot.sendMessage(
      chatId,
      "An error occurred while executing the swap."
    );
  }
}
