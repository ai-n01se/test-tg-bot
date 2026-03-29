import { supabase } from '../../lib/supabaseClient';
import { UserInsert } from '../../types/user.types';

export const syncUser = async (user: UserInsert) => {
  const { data, error } = await supabase
    .from('users')
    .upsert(user, { onConflict: 'bot_id, telegram_id' })
    .select()
    .single();

  if (error) {
    console.error('Помилка синхронізації:', error.message);
    return null;
  }
  return data;
};
