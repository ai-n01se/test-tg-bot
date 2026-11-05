import { supabase } from "../../lib/supabaseClient";

type JoinTeacherParams = {
	studentProfileId: number;
	teacherId: number;
};

const joinTeacher = async ({
	studentProfileId,
	teacherId,
}: JoinTeacherParams) => {
	const { data, error } = await supabase
		.from("STUDENT_TEACHER_RELATIONS")
		.upsert(
			{ users_id: studentProfileId, teacher_id: teacherId },
			{ onConflict: "users_id,teacher_id", ignoreDuplicates: true },
		)
		.select()
		.maybeSingle();

	if (error) {
		throw error;
	}

	// Якщо зв'язок уже був, upsert нічого не повертає
	return { created: data !== null };
};

export default joinTeacher;
