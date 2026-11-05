import { Context } from "grammy";
import dayjs, { getSlotTime, TIMEZONE } from "../../lib/dayjs";
import getTeacherSlotsByDate from "../../services/slots/getTeacherSlotsByDate";
import toggleSlot from "../../services/slots/toggleSlot";
import { generateCalendar } from "../../utils/calendar/calendarGenerator";
import {
	generateHoursKeyboard,
	WORK_HOURS,
} from "../../utils/schedule/generateHoursKeyboard";
import getCurrentTeacher from "../../utils/teacher/getCurrentTeacher";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseDate = (data: string | undefined) => {
	const value = data?.split(":")[1];
	return value && DATE_PATTERN.test(value) ? value : null;
};

const renderDay = async (ctx: Context, teacherId: number, date: string) => {
	const slots = await getTeacherSlotsByDate(teacherId, date);
	const title = dayjs.tz(date, TIMEZONE).format("D MMMM YYYY, dddd");

	await ctx.editMessageText(
		`📅 ${title}\n\nНатискайте години, щоб відкрити або закрити їх для учнів.\n✅ відкрито · 🔒 заброньовано`,
		{ reply_markup: generateHoursKeyboard(date, slots) },
	);
};

const safeAnswer = async (ctx: Context, text?: string, alert = false) => {
	try {
		await ctx.answerCallbackQuery({ text, show_alert: alert });
	} catch {
		// відповідь на callback могла вже бути надіслана
	}
};

// Вчитель обрав дату в календарі
export const handleDatePick = async (ctx: Context) => {
	try {
		const teacher = await getCurrentTeacher(ctx);
		if (!teacher) {
			await safeAnswer(ctx, "Доступно лише вчителям", true);
			return;
		}

		const date = parseDate(ctx.callbackQuery?.data);
		if (!date) {
			await safeAnswer(ctx);
			return;
		}

		await safeAnswer(ctx);
		await renderDay(ctx, teacher.id, date);
	} catch (error) {
		console.error("Date pick error:", error);
		await safeAnswer(ctx, "Сталася помилка");
	}
};

// Вчитель натиснув годину: відкрити або закрити слот
export const handleSlotToggle = async (ctx: Context) => {
	try {
		const teacher = await getCurrentTeacher(ctx);
		if (!teacher) {
			await safeAnswer(ctx, "Доступно лише вчителям", true);
			return;
		}

		const data = ctx.callbackQuery?.data;
		const date = parseDate(data);
		const hour = Number(data?.split(":")[2]);

		if (!date || !WORK_HOURS.includes(hour)) {
			await safeAnswer(ctx);
			return;
		}

		const startsAt = getSlotTime(date, hour);
		if (startsAt.isBefore(dayjs())) {
			await safeAnswer(ctx, "Цей час уже минув", true);
			return;
		}

		const result = await toggleSlot({
			teacherId: teacher.id,
			startsAt: startsAt.toISOString(),
		});

		if (result === "booked") {
			await safeAnswer(ctx, "Цей слот заброньований", true);
			return;
		}

		await safeAnswer(ctx);
		await renderDay(ctx, teacher.id, date);
	} catch (error) {
		console.error("Slot toggle error:", error);
		await safeAnswer(ctx, "Сталася помилка");
	}
};

// Повернутися з годин до календаря
export const handleBackToCalendar = async (ctx: Context) => {
	try {
		const date = parseDate(ctx.callbackQuery?.data);
		await safeAnswer(ctx);

		if (!date) {
			return;
		}

		await ctx.editMessageText("Оберіть дату, щоб відкрити години для учнів:", {
			reply_markup: generateCalendar(date),
		});
	} catch (error) {
		console.error("Back to calendar error:", error);
	}
};

export const handleBusySlot = async (ctx: Context) => {
	await safeAnswer(ctx, "Цей слот заброньований", true);
};

export const handleIgnore = async (ctx: Context) => {
	await safeAnswer(ctx);
};
