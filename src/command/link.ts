import { Context } from "grammy";
import getTeacherByUserId from "../services/teacher/getTeacherByUserId";
import syncTelegramUser from "../utils/register/syncTelegramUser";
import getTeacherLink from "../utils/teacher/getTeacherLink";

export const commandLink = async (ctx: Context) => {
	try {
		const user = await syncTelegramUser(ctx);
		const teacher = await getTeacherByUserId(user.id);

		if (!teacher) {
			await ctx.reply(
				"Ви ще не вчитель. Надішліть /start і натисніть «Стати вчителем».",
			);
			return;
		}

		await ctx.reply(
			`Ваше посилання для учнів:\n${getTeacherLink(ctx.me.username, teacher.id)}`,
		);
	} catch (error) {
		console.error("Link command error:", error);
		await ctx.reply("Сталася помилка. Спробуйте пізніше");
	}
};
