import dayjs from 'dayjs';
import { Context } from 'grammy';
import { generateCalendar } from './calendarGenerator';

export const getNextAndPrevMonth = async (
  ctx: Context,
  getMonth: string,
  currentDate: string,
) => {
  if (getMonth === 'next') {
    const nextMonthDate = dayjs(currentDate)
      .add(1, 'month')
      .format('YYYY-MM-DD');

    await ctx.editMessageReplyMarkup({
      reply_markup: generateCalendar(nextMonthDate),
    });
  } else if (getMonth === 'prev') {
    const prevMonthDate = dayjs(currentDate)
      .subtract(1, 'month')
      .format('YYYY-MM-DD');

    await ctx.editMessageReplyMarkup({
      reply_markup: generateCalendar(prevMonthDate),
    });
  }
};
