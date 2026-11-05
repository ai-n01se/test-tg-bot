import { Context } from "grammy";
import getStudentTeachersByTelegramId from "../services/student/getStudentTeachersByTelegramId";
import joinTeacher from "../services/student/joinTeacher";
import getTeacherById from "../services/teacher";
import getTeacherContact from "../services/teacher/getTeacherContact";
import syncTelegramUser from "../utils/register/syncTelegramUser";
import getTeacherIdFromStartPayload from "../utils/start/getTeacherIdFromStartPayload";
import sendStudentTeachersListMessage from "../utils/start/sendStudentTeachersListMessage";
import sendTeacherLinkRequiredMessage from "../utils/start/sendTeacherLinkRequiredMessage";

export const commandStart = async (ctx: Context) => {
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

		if (teacher.user_id === user.id) {
			await ctx.reply(
				"Це ваше особисте посилання. Поділіться ним зі своїми учнями.",
			);
			return;
		}

		const teacherName =
			teacher.full_name_teacher?.trim() || `Викладач #${teacher.id}`;

		const { created } = await joinTeacher({
			studentProfileId: user.id,
			teacherId: teacher.id,
		});

		if (!created) {
			await ctx.reply(`Ви вже приєднані до вчителя ${teacherName}.`);
			return;
		}

		await ctx.reply(`Ви приєдналися до вчителя ${teacherName}.`);

		// Сповіщення вчителя. Якщо він не відповідає (заблокував бота), це не помилка
		try {
			const contact = await getTeacherContact(teacher);
			if (contact) {
				await ctx.api.sendMessage(
					contact.telegram_id,
					`У вас новий учень: ${user.full_name}`,
				);
			}
		} catch (notifyError) {
			console.error("Не вдалося сповістити вчителя:", notifyError);
		}
	} catch (error) {
		console.error("Start command error:", error);
		await ctx.reply("Сталася помилка. Спробуйте пізніше");
	}
};
