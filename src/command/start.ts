import * as mod from "grammy";
import firstRegister from "../utils/register/firstRegister";
import findTeacher from "../utils/findTeacher";

export const commandStart = async (ctx: mod.Context) => {
	const payload = typeof ctx.match === "string" ? ctx.match : "";
	console.log("START PAYLOAD:", payload);

	try {
		const user = await firstRegister(ctx);
		console.log(user);
		if (!user) {
			await ctx.reply("Проблема з реєстрацією");
			return;
		}

		if (!payload.startsWith("teacher_")) {
			console.log("Source unknown");
			return;
		}

		const teacherId = Number(payload.replace("teacher_", ""));
		console.log("User came from teacher:", teacherId);

		if (Number.isNaN(teacherId)) {
			await ctx.reply("Некоректний ID викладача");
			return;
		}

		const { data: teacher, error } = await findTeacher({ id: teacherId });
		console.log(teacher);

		if (error || !teacher) {
			await ctx.reply("Проблема з знаходженням викладача");
			return;
		}
	} catch (error) {
		console.error("Start command error:", error);
		await ctx.reply("Сталася помилка. Спробуйте пізніше");
	}
};
