import { Bot } from "grammy";
import { MyContext } from "../types/bot.types";

export const bot = new Bot<MyContext>(process.env.tgToken!);
