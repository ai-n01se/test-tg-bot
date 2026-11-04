import * as mod from "grammy";
import getStudentTeachersByTelegramId from "../services/student/getStudentTeachersByTelegramId";
import getTeacherById from "../services/teacher";
import syncTelegramUser from "../utils/register/syncTelegramUser";
import getTeacherIdFromStartPayload from "../utils/start/getTeacherIdFromStartPayload";
import sendStudentTeachersListMessage from "../utils/start/sendStudentTeachersListMessage";
import sendTeacherLinkRequiredMessage from "../utils/start/sendTeacherLinkRequiredMessage";

export const commandStart = async (ctx: mod.Context) => {
	const payload = typeof ctx.match === "string" ? ctx.match : "";

	try {
		const user = await syncTelegramUser(ctx);
		if (!user) {
			await ctx.reply("Проблема з реєстрацією");
			return;
		}

		const teacherId = getTeacherIdFromStartPayload(payload);
		if (teacherId === null) {
			const teachers = await getStudentTeachersByTelegramId({
				telegramId: user.telegram_id,
			});

			if (teachers.length > 0) {
				await sendStudentTeachersListMessage(ctx, teachers);
				return;
			}

			await sendTeacherLinkRequiredMessage(ctx);
			return;
		}

		const teacher = await getTeacherById({ id: teacherId });
		if (!teacher) {
			await ctx.reply("Проблема з знаходженням викладача");
			return;
		}
	} catch (error) {
		console.error("Start command error:", error);
		await ctx.reply("Сталася помилка. Спробуйте пізніше");
	}
};
