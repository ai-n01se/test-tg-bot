import { Database, Tables } from "./database.types";

export type User = Tables<"PROFILES">;
export type UserInsert = Database["public"]["Tables"]["PROFILES"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["PROFILES"]["Update"];

export type Teacher = Tables<"TEACHER_PROFILES">;
export type FindTeacherById = Pick<Teacher, "id">;
