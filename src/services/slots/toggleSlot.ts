import { supabase } from "../../lib/supabaseClient";

type ToggleSlotParams = {
	teacherId: number;
	startsAt: string;
};

type ToggleSlotResult = "opened" | "closed" | "booked";

const toggleSlot = async ({
	teacherId,
	startsAt,
}: ToggleSlotParams): Promise<ToggleSlotResult> => {
	const { data: existing, error } = await supabase
		.from("SLOTS")
		.select("id, status")
		.eq("teacher_id", teacherId)
		.eq("appointment_time", startsAt)
		.maybeSingle();

	if (error) {
		throw error;
	}

	if (!existing) {
		const { error: insertError } = await supabase
			.from("SLOTS")
			.insert({ teacher_id: teacherId, appointment_time: startsAt });

		if (insertError) {
			throw insertError;
		}

		return "opened";
	}

	// Заброньований чи проведений слот не чіпаємо
	if (existing.status !== "free") {
		return "booked";
	}

	const { error: deleteError } = await supabase
		.from("SLOTS")
		.delete()
		.eq("id", existing.id)
		.eq("status", "free");

	if (deleteError) {
		throw deleteError;
	}

	return "closed";
};

export default toggleSlot;
