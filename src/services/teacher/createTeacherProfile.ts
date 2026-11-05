import { supabase } from "../../lib/supabaseClient";
import { TeacherInsert } from "../../types/user.types";

const createTeacherProfile = async (teacher: TeacherInsert) => {
	const { data, error } = await supabase
		.from("TEACHER_PROFILES")
		.insert(teacher)
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
};

export default createTeacherProfile;
