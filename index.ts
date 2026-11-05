import * as dotenv from "dotenv";
dotenv.config();

import { bot } from "./src/lib/tgBot";
import { commandStart } from "./src/command/start";
import { commandSchedule } from "./src/command/schedule";
import { commandTeachers } from "./src/command/teachers";
import getTeacherById from "./src/services/teacher";
import { getNextAndPrevMonth } from "./src/utils/calendar/nextAndPrevMonth";
import { conversations, createConversation } from "@grammyjs/conversations";
import becomeTeacher from "./src/conversations/becomeTeacher";
import { commandLink } from "./src/command/link";
import {
	handleBackToCalendar,
	handleBusySlot,
	handleDatePick,
	handleIgnore,
	handleSlotToggle,
} from "./src/handlers/teacher/schedule";

bot.use(conversations());
bot.use(createConversation(becomeTeacher, "becomeTeacher"));

// Команди бота
bot.command("start", commandStart);
bot.command("schedule", commandSchedule);
bot.command("teachers", commandTeachers);
bot.command("link", commandLink);

// Розклад вчителя
bot.callbackQuery(/^cal:/, handleDatePick);
bot.callbackQuery(/^slot:/, handleSlotToggle);
bot.callbackQuery(/^sched_back:/, handleBackToCalendar);
bot.callbackQuery("slot_busy", handleBusySlot);
bot.callbackQuery("ignore", handleIgnore);

// Навігація календаря
bot.callbackQuery(/^next_month:/, async (ctx) => {
	await ctx.answerCallbackQuery();
	const currentDate = ctx.callbackQuery.data.split(":")[1];
	await getNextAndPrevMonth(ctx, "next", currentDate);
});

bot.callbackQuery(/^prev_month:/, async (ctx) => {
	await ctx.answerCallbackQuery();
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
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("becomeTeacher");
});

bot.catch((err) => console.error("Error in bot:", err));

bot.start();
