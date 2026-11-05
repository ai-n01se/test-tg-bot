import { supabase } from "../../lib/supabaseClient";
import { Teacher } from "../../types/user.types";

const getTeacherContact = async (teacher: Teacher) => {
	const { data, error } = await supabase
		.from("PROFILES")
		.select("telegram_id, full_name")
		.eq("id", teacher.user_id)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data;
};

export default getTeacherContact;
