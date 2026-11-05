import { Context } from "grammy";
import getTeacherByUserId from "../../services/teacher/getTeacherByUserId";
import syncTelegramUser from "../register/syncTelegramUser";

const getCurrentTeacher = async (ctx: Context) => {
	const user = await syncTelegramUser(ctx);
	return getTeacherByUserId(user.id);
};

export default getCurrentTeacher;
