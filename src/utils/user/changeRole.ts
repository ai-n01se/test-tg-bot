import { Context } from 'grammy';
import { ensureUser } from './ensureUser';
import { supabase } from '../../lib/supabaseClient';
import { UserRole } from '../../types/user.types';

export const changeRole = async (ctx: Context, role: UserRole) => {
  if (!ctx.from) return;

  const user = await ensureUser(ctx);

  if (!user) {
    await ctx.reply('Пользователь не найден. Пожалуйста, попробуйте снова.');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role: role })
      .eq('telegram_id', user.telegram_id);

    console.log('Результат обновления роли:', role, error);
    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Ошибка в commandRole:', error);
    await ctx.reply('Произошла ошибка при обработке команды роли.');
    return false;
  }
};
