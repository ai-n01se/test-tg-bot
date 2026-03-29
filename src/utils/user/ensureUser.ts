import { Context } from 'grammy';
import { syncUser } from './syncUser';
import { User } from '../../types/user.types';

export const ensureUser = async (ctx: Context): Promise<User | null> => {
  if (!ctx.from) return null;

  const user = await syncUser({
    telegram_id: ctx.from.id,
    username_tg: ctx.from.username || null,
    firstName_tg: ctx.from.first_name || null,
    lastName_tg: ctx.from.last_name || null,
    bot_id: Number(process.env.BOT_ID),
  });

  return user;
};
