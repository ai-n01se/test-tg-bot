import { UserInsert } from '../types/user.types';
import * as mod from 'grammy';
import { syncUser } from '../utils/user/syncUser';
import { welcomeMessages } from './../../messages/welcomeMessages';

export const commandStart = async (ctx: mod.Context) => {
  if (!ctx.from) return;

  const user: UserInsert = {
    telegram_id: ctx.from.id,
    username_tg: ctx.from.username || null,
    firstName_tg: ctx.from.first_name || null,
    lastName_tg: ctx.from.last_name || null,
    bot_id: Number(process.env.BOT_ID) || null,
  };

  try {
    const userDB = await syncUser(user);
    if (!userDB) {
      await ctx.reply('Вибачте, сталася помилка при реєстрації.');
      return;
    }
    console.log(
      `Користувач: ${userDB.username_tg} (ID: ${userDB.telegram_id}) успішно синхронізований з базою даних. ${userDB.created_at ? `Створено: ${userDB.created_at}` : ''}`,
    );

    const newFullName = [userDB.firstName_tg, userDB.lastName_tg]
      .filter(Boolean)
      .join(' ');

    await ctx.reply(
      welcomeMessages(newFullName, userDB.role || 'не визначено'),
      { parse_mode: 'Markdown' },
    );
  } catch (error) {
    console.error('Помилка в commandStart:', error);
    await ctx.reply('Вибачте, сталася помилка при реєстрації.');
  }
};
