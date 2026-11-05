import { InlineKeyboard } from "grammy";
import dayjs, { getSlotTime } from "../../lib/dayjs";
import { Database } from "../../types/database.types";

type SlotStatus = Database["public"]["Enums"]["status"];

// Години, які вчитель може відкривати: 08:00 - 21:00
export const WORK_HOURS = Array.from({ length: 14 }, (_, i) => i + 8);
const HOURS_PER_ROW = 4;

export const generateHoursKeyboard = (
	date: string,
	slots: Map<number, SlotStatus>,
) => {
	const keyboard = new InlineKeyboard();
	const now = dayjs();

	WORK_HOURS.forEach((hour, index) => {
		const label = `${String(hour).padStart(2, "0")}:00`;
		const status = slots.get(hour);

		if (status && status !== "free") {
			keyboard.text(`🔒 ${label}`, "slot_busy");
		} else if (getSlotTime(date, hour).isBefore(now)) {
			keyboard.text("·", "ignore");
		} else if (status === "free") {
			keyboard.text(`✅ ${label}`, `slot:${date}:${hour}`);
		} else {
			keyboard.text(label, `slot:${date}:${hour}`);
		}

		if ((index + 1) % HOURS_PER_ROW === 0) {
			keyboard.row();
		}
	});

	keyboard.row().text("⬅️ До календаря", `sched_back:${date}`);

	return keyboard;
};
