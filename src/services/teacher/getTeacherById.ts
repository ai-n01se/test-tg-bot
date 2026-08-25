import { supabase } from "../../lib/supabaseClient";
import { FindTeacherById } from "../../types/user.types";

const getTeacherById = async ({ id }: FindTeacherById) => {
	const { data, error } = await supabase
		.from("TEACHER_PROFILES")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data;
};

export default getTeacherById;
