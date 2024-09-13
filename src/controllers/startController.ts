import { Message } from "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import User from "../models/User";
import { generateKeypair, encryptPrivateKey } from "../services/solanaService";
import { logger } from "../index";

export async function handleStart(bot: TelegramBot, msg: Message) {
  const chatId = msg.chat.id;

  try {
    // Check if user exists
    let user = await User.findOne({ chatId });

    if (!user) {
      // Create new user with generated keypair
      const keypair = generateKeypair();
      const encryptedPrivateKey = encryptPrivateKey(keypair.secretKey);

      user = new User({
        chatId,
        publicKey: keypair.publicKey.toBase58(),
        encryptedPrivateKey,
      });

      await user.save();
    }

    await bot.sendMessage(chatId, "Welcome to the Solana Purchase Bot!");
    await bot.sendMessage(chatId, `Your wallet address is: ${user.publicKey}`);
  } catch (error) {
    logger.error("Start Command Error:", error);
    await bot.sendMessage(
      chatId,
      "An error occurred while setting up your account."
    );
  }
}
