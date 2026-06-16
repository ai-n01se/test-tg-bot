import { Context } from "grammy";
import getStudentTeachersByTelegramId from "../services/student/getStudentTeachersByTelegramId";
import syncTelegramUser from "../utils/register/syncTelegramUser";
import sendStudentTeachersListMessage from "../utils/start/sendStudentTeachersListMessage";
import sendTeacherLinkRequiredMessage from "../utils/start/sendTeacherLinkRequiredMessage";

export const commandTeachers = async (ctx: Context) => {
	try {
		const user = await syncTelegramUser(ctx);
		if (!user) {
			await ctx.reply("Проблема з реєстрацією");
			return;
		}

		const teachers = await getStudentTeachersByTelegramId({
			telegramId: user.telegram_id,
		});

		if (teachers.length === 0) {
			await sendTeacherLinkRequiredMessage(ctx);
			return;
		}

		await sendStudentTeachersListMessage(ctx, teachers);
	} catch (error) {
		console.error("Teachers command error:", error);
		await ctx.reply("Сталася помилка. Спробуйте пізніше");
	}
};
