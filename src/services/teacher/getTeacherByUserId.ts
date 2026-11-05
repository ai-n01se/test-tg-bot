import { supabase } from "../../lib/supabaseClient";

const getTeacherByUserId = async (userId: number) => {
	const { data, error } = await supabase
		.from("TEACHER_PROFILES")
		.select("*")
		.eq("user_id", userId)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data;
};

export default getTeacherByUserId;
