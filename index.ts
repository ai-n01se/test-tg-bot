import * as dotenv from "dotenv";
dotenv.config();

import { bot } from "./src/lib/tgBot";
import { commandStart } from "./src/command/start";
import { commandSchedule } from "./src/command/schedule";
import { commandTeachers } from "./src/command/teachers";
import getTeacherById from "./src/services/teacher";
import { getNextAndPrevMonth } from "./src/utils/calendar/nextAndPrevMonth";

// Команди бота
bot.command("start", commandStart);
bot.command("schedule", commandSchedule);
bot.command("teachers", commandTeachers);

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

bot.callbackQuery(/^teacher:/, async (ctx) => {
	await ctx.answerCallbackQuery();

	const teacherId = Number(ctx.callbackQuery.data.split(":")[1]);
	if (Number.isNaN(teacherId)) {
		await ctx.reply("Некоректний ID викладача");
		return;
	}

	const teacher = await getTeacherById({ id: teacherId });
	if (!teacher) {
		await ctx.reply("Викладача не знайдено");
		return;
	}

	await ctx.reply(
		`Ви обрали викладача: ${teacher.full_name_teacher ?? `Викладач #${teacher.id}`}`,
	);
});

bot.callbackQuery("become_teacher", async (ctx) => {
	await ctx.answerCallbackQuery({
		text: "Функція для вчителів ще в розробці",
	});
});

bot.catch((err) => console.error("Error in bot:", err));

bot.start();
