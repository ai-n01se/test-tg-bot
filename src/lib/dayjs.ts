import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/uk";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("uk");

// Часовий пояс, у якому вчителі вказують години. Змінити можна тут
export const TIMEZONE = "Europe/Kyiv";

export const getSlotTime = (date: string, hour: number) =>
	dayjs.tz(`${date} ${String(hour).padStart(2, "0")}:00`, TIMEZONE);

export default dayjs;
