import getStudentByTelegramId from "./getStudentByTelegramId";
import { supabase } from "../../lib/supabaseClient";
import { FindStudentByTelegramId } from "../../types/user.types";

const getStudentTeachersByTelegramId = async ({
	telegramId,
}: FindStudentByTelegramId) => {
	const student = await getStudentByTelegramId({ telegramId });

	if (!student || student.studentRelations.length === 0) {
		return [];
	}

	const teacherIds = [...new Set(student.studentRelations.map((item) => item.teacher_id))];

	const { data: teachers, error } = await supabase
		.from("TEACHER_PROFILES")
		.select("*")
		.in("id", teacherIds);

	if (error) {
		throw error;
	}

	const teachersMap = new Map(teachers.map((teacher) => [teacher.id, teacher]));

	return teacherIds
		.map((teacherId) => teachersMap.get(teacherId))
		.filter((teacher) => teacher !== undefined);
};

export default getStudentTeachersByTelegramId;
