import { Context } from "grammy";
import dayjs from "../lib/dayjs";
import { generateCalendar } from "../utils/calendar/calendarGenerator";
import getCurrentTeacher from "../utils/teacher/getCurrentTeacher";

export const commandSchedule = async (ctx: Context) => {
	try {
		const teacher = await getCurrentTeacher(ctx);
		if (!teacher) {
			await ctx.reply(
				"Розклад доступний лише вчителям. Надішліть /start і натисніть «Стати вчителем».",
			);
			return;
		}

		await ctx.reply("Оберіть дату, щоб відкрити години для учнів:", {
			reply_markup: generateCalendar(dayjs().format("YYYY-MM-DD")),
		});
	} catch (error) {
		console.error("Schedule command error:", error);
		await ctx.reply("Сталася помилка. Спробуйте пізніше");
	}
};
