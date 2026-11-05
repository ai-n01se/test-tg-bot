import dayjs from "dayjs";
import type { Conversation } from "@grammyjs/conversations";
import { MyContext } from "../types/bot.types";
import createTeacherProfile from "../services/teacher/createTeacherProfile";
import getTeacherByUserId from "../services/teacher/getTeacherByUserId";
import syncTelegramUser from "../utils/register/syncTelegramUser";
import getTeacherLink from "../utils/teacher/getTeacherLink";

type BotConversation = Conversation<MyContext, MyContext>;
type Parsed<T> = { value: T } | { error: string };

const CANCEL_TEXT = "Скасовано. Щоб почати знову, натисніть «Стати вчителем».";

// Повертає текст відповіді, або null, якщо користувач надіслав команду (скасування)
const askText = async (
	conversation: BotConversation,
	ctx: MyContext,
	question: string,
) => {
	await ctx.reply(question);
	const answer = await conversation.waitFor("message:text");
	const text = answer.message.text.trim();

	if (text.startsWith("/")) {
		await ctx.reply(CANCEL_TEXT);
		return null;
	}

	return text;
};

// Питає, поки відповідь не пройде перевірку. null означає скасування
const askParsed = async <T>(
	conversation: BotConversation,
	ctx: MyContext,
	question: string,
	parse: (text: string) => Parsed<T>,
) => {
	let prompt = question;

	while (true) {
		const text = await askText(conversation, ctx, prompt);
		if (text === null) {
			return null;
		}

		const result = parse(text);
		if ("value" in result) {
			return result;
		}

		prompt = result.error;
	}
};

const parseRequiredText = (text: string): Parsed<string> =>
	text.length >= 2
		? { value: text }
		: { error: "Занадто коротко, спробуйте ще раз." };

const parsePrice = (text: string): Parsed<number> => {
	const price = Number(text.replace(",", "."));
	return Number.isFinite(price) && price >= 0
		? { value: price }
		: { error: "Потрібне число, наприклад 300." };
};

const parseZoom = (text: string): Parsed<string | null> => {
	if (text === "-") {
		return { value: null };
	}
	return text.startsWith("http")
		? { value: text }
		: { error: "Посилання має починатися з http. Або надішліть «-»." };
};

const parseCard = (text: string): Parsed<string | null> => {
	if (text === "-") {
		return { value: null };
	}
	const digits = text.replace(/\s/g, "");
	return /^\d{16}$/.test(digits)
		? { value: digits }
		: { error: "Номер картки має містити 16 цифр. Або надішліть «-»." };
};

const becomeTeacher = async (conversation: BotConversation, ctx: MyContext) => {
	const user = await conversation.external(() => syncTelegramUser(ctx));

	const existing = await conversation.external(() =>
		getTeacherByUserId(user.id),
	);
	if (existing) {
		await ctx.reply(
			`Ви вже вчитель. Ваше посилання для учнів:\n${getTeacherLink(ctx.me.username, existing.id)}`,
		);
		return;
	}

	const name = await askParsed(
		conversation,
		ctx,
		"Як вас називати для учнів? Напишіть ім'я та прізвище.",
		parseRequiredText,
	);
	if (!name) return;

	const subjects = await askParsed(
		conversation,
		ctx,
		"Який предмет ви викладаєте?",
		parseRequiredText,
	);
	if (!subjects) return;

	const price = await askParsed(
		conversation,
		ctx,
		"Скільки коштує один урок? Напишіть число, наприклад 300.",
		parsePrice,
	);
	if (!price) return;

	const zoom = await askParsed(
		conversation,
		ctx,
		"Надішліть своє zoom-посилання або «-», щоб пропустити.",
		parseZoom,
	);
	if (!zoom) return;

	const card = await askParsed(
		conversation,
		ctx,
		"Надішліть номер картки для оплат від учнів або «-», щоб пропустити.",
		parseCard,
	);
	if (!card) return;

	const teacher = await conversation.external(() =>
		createTeacherProfile({
			user_id: user.id,
			full_name_teacher: name.value,
			subjects: subjects.value,
			price_per_lesson: price.value,
			zoom_link: zoom.value,
			number_card: card.value,
			subscription_status: true,
			subscription_expires_at: dayjs().add(14, "day").toISOString(),
		}),
	);

	await ctx.reply(
		`Профіль створено. Перші 14 днів безкоштовні.\n\nВаше посилання для учнів:\n${getTeacherLink(ctx.me.username, teacher.id)}`,
	);
};

export default becomeTeacher;
