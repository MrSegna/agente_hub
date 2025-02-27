import { Context } from 'telegraf';

export interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    type: string;
  };
  text: string;
  date: number;
}

export interface TelegramUpdate {
  update_id: number;
  message: TelegramMessage;
}

export interface TelegramResponse {
  reply?: string;
  error?: string;
}

export type TelegramContext = Context & {
  message: TelegramMessage;
};