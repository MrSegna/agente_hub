import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import type { Context } from 'telegraf';
import { TelegramContext, TelegramMessage, TelegramResponse } from '../types/telegram';
import fetch from 'node-fetch';

// Verifica token do bot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('[Bot] Token do Telegram não encontrado');
  process.exit(1);
}

// Cria instância do bot
const bot = new Telegraf<Context>(token);

// Handler de mensagens
bot.on(message('text'), async (ctx: Context) => {
  try {
    const messageId = ctx.message.message_id;
    const chatId = ctx.chat.id;
    const text = ctx.message.text;

    console.log(`[Bot] Mensagem recebida (${chatId}): ${text}`);

    // Envia para processamento via API
    const response = await fetch('http://localhost:3000/api/bot/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        update_id: messageId,
        message: {
          message_id: messageId,
          chat: {
            id: chatId,
            type: ctx.chat.type,
          },
          text: text,
          date: Math.floor(Date.now() / 1000),
        } as TelegramMessage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json() as TelegramResponse;
    
    // Responde se houver uma resposta da API
    if (data.reply) {
      await ctx.reply(data.reply, {
        reply_to_message_id: messageId,
      });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[Bot] Erro ao processar mensagem:', errorMessage);
    await ctx.reply('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.');
  }
});

// Handler de erros
bot.catch((err: Error) => {
  console.error('[Bot] Erro no bot:', err.message);
});

// Inicia o bot
console.log('[Bot] Iniciando bot...');

if (process.env.NODE_ENV === 'development') {
  // Modo de desenvolvimento: polling
  bot.launch()
    .then(() => {
      console.log('[Bot] Bot iniciado em modo de desenvolvimento (polling)');
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('[Bot] Erro ao iniciar bot:', errorMessage);
      process.exit(1);
    });
} else {
  // Modo de produção: webhook
  const webhookDomain = process.env.WEBHOOK_DOMAIN;
  if (!webhookDomain) {
    console.error('[Bot] WEBHOOK_DOMAIN não definido');
    process.exit(1);
  }

  bot.launch({
    webhook: {
      domain: webhookDomain,
      port: Number(process.env.WEBHOOK_PORT) || 3000,
    }
  })
    .then(() => {
      console.log('[Bot] Bot iniciado em modo de produção (webhook)');
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('[Bot] Erro ao iniciar bot:', errorMessage);
      process.exit(1);
    });
}

// Finalização limpa
process.once('SIGINT', () => {
  console.log('[Bot] Finalizando bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('[Bot] Finalizando bot...');
  bot.stop('SIGTERM');
});