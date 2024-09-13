import { Message } from "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import schedule, { Job } from "node-schedule";
import { createPayment } from "../services/mercuryoService";
import DCAJob from "../models/DCAJob";
import { validateAmount, validateCronExpression } from "../utils/validation";
import { logger } from "../index";

const scheduledJobs: { [key: string]: Job } = {};

export async function handleDCA(
  bot: TelegramBot,
  msg: Message,
  match: RegExpExecArray | null
) {
  const chatId = msg.chat.id;

  try {
    const params = match ? match[1].split(" ") : [];
    const amountStr = params[0];
    const cronExpression = params.slice(1).join(" ");

    const amount = parseFloat(amountStr);

    if (!validateAmount(amount) || !validateCronExpression(cronExpression)) {
      await bot.sendMessage(
        chatId,
        "Invalid amount or cron expression. Usage: /dca <amount> <cron_expression>"
      );
      return;
    }

    // Save DCA job to the database
    const dcaJob = new DCAJob({ chatId, amount, cronExpression });
    await dcaJob.save();

    scheduleDCAJob(bot, dcaJob);

    await bot.sendMessage(chatId, "Your DCA strategy has been set up.");
  } catch (error) {
    logger.error("DCA Setup Error:", error);
    await bot.sendMessage(
      chatId,
      "An error occurred while setting up your DCA strategy."
    );
  }
}

export function scheduleDCAJob(bot: TelegramBot, dcaJob: any) {
  const job = schedule.scheduleJob(dcaJob.cronExpression, async () => {
    try {
      const payment = await createPayment(dcaJob.amount, "USD");
      await bot.sendMessage(
        dcaJob.chatId,
        `DCA Purchase initiated: ${payment.payment_url}`
      );
    } catch (error) {
      logger.error("DCA Job Error:", error);
    }
  });

  scheduledJobs[dcaJob._id] = job;
}

export async function scheduleDCAJobs(bot: TelegramBot) {
  const dcaJobs = await DCAJob.find({});
  for (const dcaJob of dcaJobs) {
    scheduleDCAJob(bot, dcaJob);
  }
}
