const getTeacherLink = (botUsername: string, teacherId: number) =>
	`https://t.me/${botUsername}?start=teacher_${teacherId}`;

export default getTeacherLink;
