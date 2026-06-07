import { supabase } from "../lib/supabaseClient";
import { FindTeacherById } from "../types/user.types";

const findTeacher = async ({ id }: FindTeacherById) => {
	return supabase.from("TEACHER_PROFILES").select("*").eq("id", id).single();
};

export default findTeacher;
