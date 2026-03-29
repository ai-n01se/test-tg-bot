import { Database, Tables } from './database.types';

export type User = Tables<'users'>;
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type UserRole = User['role'];
