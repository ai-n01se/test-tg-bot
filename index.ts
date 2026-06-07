import * as dotenv from "dotenv";
dotenv.config();

import { bot } from "./src/lib/tgBot";
import { commandStart } from "./src/command/start";
import { commandSchedule } from "./src/command/schedule";
import { getNextAndPrevMonth } from "./src/utils/calendar/nextAndPrevMonth";
import firstRegister from "./src/utils/register/firstRegister";

// Команди бота
bot.command("start", commandStart);
bot.command("schedule", commandSchedule);

// Обробка вибору дати
bot.callbackQuery(/^cal:/, async (ctx) => {
	await ctx.answerCallbackQuery();
	const selectedDate = ctx.callbackQuery.data.split(":")[1];
	await ctx.reply(`Ви обрали дату: ${selectedDate}. Тепер оберіть час:`);
});

// Навігація
bot.callbackQuery(/^next_month:/, async (ctx) => {
	const currentDate = ctx.callbackQuery.data.split(":")[1];
	await getNextAndPrevMonth(ctx, "next", currentDate);
});

bot.callbackQuery(/^prev_month:/, async (ctx) => {
	const currentDate = ctx.callbackQuery.data.split(":")[1];
	await getNextAndPrevMonth(ctx, "prev", currentDate);
});

bot.catch((err) => console.error("Error in bot:", err));

bot.start();
