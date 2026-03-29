import { Context } from 'grammy';
import dayjs from 'dayjs';
import { generateCalendar } from '../utils/calendar/calendarGenerator';

export const commandSchedule = async (ctx: Context) => {
  // За замовчуванням показуємо поточний місяць
  const now = dayjs().format('YYYY-MM-DD');
  await ctx.reply('Оберіть дату для налаштування уроків:', {
    reply_markup: generateCalendar(now),
  });
};
