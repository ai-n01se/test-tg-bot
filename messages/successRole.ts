import { Context } from 'grammy';

export const successRole = async (
  ctx: Context,
  role: string,
  success: boolean | undefined,
) => {
  if (!ctx.from) return;
  if (success === undefined) {
    await ctx.answerCallbackQuery('Статус обновления роли неизвестен.');
    await ctx.editMessageText(
      '⚠️ Не удалось определить статус обновления роли.',
    );
    return;
  }
  if (success) {
    await ctx.answerCallbackQuery('Ви тепер ' + role + '!');
    await ctx.editMessageText('✅ Вашу роль оновлено: ' + role, {
      parse_mode: 'Markdown',
    });
  } else {
    await ctx.answerCallbackQuery('Виникла помилка при оновленні ролі.');
    await ctx.editMessageText('❌ Помилка оновлення. Спробуйте пізніше.');
  }
};
