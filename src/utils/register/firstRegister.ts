import { Context } from "grammy";
import { UserInsert } from "../../types/user.types";
import { supabase } from "../../lib/supabaseClient";

const firstRegister = async (ctx: Context) => {
	if (!ctx.from) {
		throw new Error("Telegram user not found in context");
	}

	const user: UserInsert = {
		full_name:
			ctx.from.first_name +
			(ctx.from.last_name ? ` ${ctx.from.last_name}` : ""),
		telegram_id: ctx.from.id,
		username_tg: ctx.from.username ?? "",
	};

	const result = await supabase
		.from("PROFILES")
		.upsert(user, { onConflict: "telegram_id" })
		.select()
		.single();

	if (result.error) {
		throw result.error;
	}

	return result.data;
};

export default firstRegister;
