const getTeacherIdFromStartPayload = (payload: string) => {
	if (!payload.startsWith("teacher_")) {
		return null;
	}

	const teacherId = Number(payload.replace("teacher_", ""));

	return Number.isNaN(teacherId) ? null : teacherId;
};

export default getTeacherIdFromStartPayload;
