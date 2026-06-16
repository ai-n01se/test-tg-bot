import { Context, InlineKeyboard } from "grammy";
import { Teacher } from "../../types/user.types";

const getTeacherButtonLabel = (teacher: Teacher) => {
	return teacher.full_name_teacher?.trim() || `Викладач #${teacher.id}`;
};

const sendStudentTeachersListMessage = async (
	ctx: Context,
	teachers: Teacher[],
) => {
	const keyboard = new InlineKeyboard();

	teachers.forEach((teacher) => {
		keyboard
			.text(getTeacherButtonLabel(teacher), `teacher:${teacher.id}`)
			.row();
	});

	keyboard.text("Стати вчителем", "become_teacher");

	await ctx.reply("Ваші викладачі. Оберіть потрібного:", {
		reply_markup: keyboard,
	});
};

export default sendStudentTeachersListMessage;
