import * as dotenv from 'dotenv';
dotenv.config();

import { supabase } from './src/lib/supabaseClient';
import { bot } from './src/lib/tgBot';
import { commandStart } from './src/command/start';
import { commandRole } from './src/command/role';
import { changeRole } from './src/utils/user/changeRole';
import { successRole } from './messages/successRole';
import { commandSchedule } from './src/command/schedule';
import { getNextAndPrevMonth } from './src/utils/calendar/nextAndPrevMonth';

async function main() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('bot_id', Number(process.env.BOT_ID));

  if (error) console.error(error);
  else console.log(data);
}

// Команди бота
bot.command('start', commandStart);
bot.command('role', commandRole);
bot.command('schedule', commandSchedule);

// Обробка вибору ролі
bot.callbackQuery('set_role_teacher', async (ctx) => {
  const success = await changeRole(ctx, 'teacher');
  await successRole(ctx, 'Вчитель', success);
});

bot.callbackQuery('set_role_students', async (ctx) => {
  const success = await changeRole(ctx, 'students');
  await successRole(ctx, 'Учень', success);
});

// Обробка вибору дати
bot.callbackQuery(/^cal:/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const selectedDate = ctx.callbackQuery.data.split(':')[1];
  await ctx.reply(`Ви обрали дату: ${selectedDate}. Тепер оберіть час:`);
});

// Навігація
bot.callbackQuery(/^next_month:/, async (ctx) => {
  const currentDate = ctx.callbackQuery.data.split(':')[1];
  await getNextAndPrevMonth(ctx, 'next', currentDate);
});

bot.callbackQuery(/^prev_month:/, async (ctx) => {
  const currentDate = ctx.callbackQuery.data.split(':')[1];
  await getNextAndPrevMonth(ctx, 'prev', currentDate);
});

bot.catch((err) => console.error('Error in bot:', err));

main();
bot.start();
