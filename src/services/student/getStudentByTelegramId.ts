import { supabase } from "../../lib/supabaseClient";
import { FindStudentByTelegramId } from "../../types/user.types";

const getStudentByTelegramId = async ({ telegramId }: FindStudentByTelegramId) => {
	const { data: profile, error: profileError } = await supabase
		.from("PROFILES")
		.select("*")
		.eq("telegram_id", telegramId)
		.maybeSingle();

	if (profileError) {
		throw profileError;
	}

	if (!profile) {
		return null;
	}

	const { data: studentRelations, error: studentError } = await supabase
		.from("STUDENT_TEACHER_RELATIONS")
		.select("*")
		.eq("users_id", profile.id);

	if (studentError) {
		throw studentError;
	}

	return {
		profile,
		studentRelations,
	};
};

export default getStudentByTelegramId;
