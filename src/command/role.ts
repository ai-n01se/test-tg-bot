import { Context, InlineKeyboard } from 'grammy';

export const commandRole = async (ctx: Context) => {
  if (!ctx.from) return;

  const keyboard = new InlineKeyboard()
    .text('Вчитель', 'set_role_teacher')
    .text('Учень', 'set_role_students');

  await ctx.reply('Оберіть вашу роль у системі:', {
    reply_markup: keyboard,
  });
};
