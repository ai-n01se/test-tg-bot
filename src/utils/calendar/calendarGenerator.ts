import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { InlineKeyboard } from 'grammy';

dayjs.locale('uk');

export const generateCalendar = (currentDate: string) => {
  const monthsLimits = 2;
  const maxDate = dayjs().add(monthsLimits, 'month').endOf('month');
  const today = dayjs().startOf('day');

  const date = dayjs(currentDate);
  const startOfMonth = date.startOf('month');
  const endOfMonth = date.endOf('month');

  const daysInMonth = endOfMonth.date();
  const startDayOfWeek = startOfMonth.day();
  const endOfDayOfWeek = endOfMonth.day();

  const keyboard = new InlineKeyboard();

  keyboard.text(`${date.format('MMMM YYYY')}`, 'ignore').row();

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  weekdays.forEach((day) => keyboard.text(day, 'ignore'));
  keyboard.row();

  for (let i = 1; i < (startDayOfWeek === 0 ? 7 : startDayOfWeek); i++) {
    keyboard.text(' ', 'ignore');
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = date.date(day).startOf('day');
    const isPast = fullDate.isBefore(today);
    const isTooFar = fullDate.isAfter(maxDate);

    if (isPast || isTooFar) {
      keyboard.text('·', 'ignore');
    } else {
      keyboard.text(`${day}`, `cal:${fullDate.format('YYYY-MM-DD')}`);
    }

    if ((startDayOfWeek + day - 1) % 7 === 0) {
      keyboard.row();
    }
  }

  if (endOfDayOfWeek !== 0) {
    for (let i = endOfDayOfWeek + 1; i <= 7; i++) {
      keyboard.text(' ', 'ignore');
    }
  }

  keyboard.row();

  if (date.isSame(today, 'month')) {
  } else {
    keyboard.text('⬅️ Попередній', `prev_month:${currentDate}`);
  }

  const nextMonth = date.add(1, 'month');
  if (nextMonth.isAfter(maxDate)) {
  } else {
    keyboard.text('Наступний ➡️', `next_month:${currentDate}`);
  }

  return keyboard;
};
