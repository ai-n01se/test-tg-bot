import dayjs, { TIMEZONE } from "../../lib/dayjs";
import { supabase } from "../../lib/supabaseClient";
import { Database } from "../../types/database.types";

type SlotStatus = Database["public"]["Enums"]["status"];

const getTeacherSlotsByDate = async (teacherId: number, date: string) => {
	const dayStart = dayjs.tz(date, TIMEZONE).startOf("day");
	const dayEnd = dayStart.add(1, "day");

	const { data, error } = await supabase
		.from("SLOTS")
		.select("appointment_time, status")
		.eq("teacher_id", teacherId)
		.gte("appointment_time", dayStart.toISOString())
		.lt("appointment_time", dayEnd.toISOString());

	if (error) {
		throw error;
	}

	// година (у часовому поясі вчителя) -> статус слота
	return new Map<number, SlotStatus>(
		data.map((slot) => [
			dayjs(slot.appointment_time).tz(TIMEZONE).hour(),
			slot.status,
		]),
	);
};

export default getTeacherSlotsByDate;
