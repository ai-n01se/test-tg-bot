import { Context, InlineKeyboard } from "grammy";

const sendTeacherLinkRequiredMessage = async (ctx: Context) => {
	const keyboard = new InlineKeyboard().text(
		"Стати вчителем",
		"become_teacher",
	);

	await ctx.reply(
		"Щоб користуватися ботом, вам потрібне посилання від вчителя.\n\nЯкщо ви хочете стати вчителем, натисніть кнопку нижче.",
		{
			reply_markup: keyboard,
		},
	);
};

export default sendTeacherLinkRequiredMessage;
