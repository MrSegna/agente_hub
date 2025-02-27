import { Telegraf, Context } from "telegraf";

let bot: Telegraf | null = null;

export function initTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("Token do Telegram não configurado");
    return null;
  }

  try {
    bot = new Telegraf(token);
    return bot;
  } catch (error) {
    console.error("Erro ao inicializar bot do Telegram:", error);
    return null;
  }
}

export function getTelegramBot() {
  if (!bot) {
    return initTelegramBot();
  }
  return bot;
}

export async function sendTelegramMessage(chatId: number, text: string) {
  const currentBot = getTelegramBot();
  if (!currentBot) {
    throw new Error("Bot do Telegram não inicializado");
  }

  try {
    await currentBot.telegram.sendMessage(chatId, text);
    return true;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return false;
  }
}

export async function startTelegramBot() {
  const currentBot = getTelegramBot();
  if (!currentBot) {
    throw new Error("Bot do Telegram não inicializado");
  }

  try {
    // Configurar handlers básicos
    currentBot.command("start", (ctx: Context) => {
      ctx.reply("Bot iniciado! 🤖");
    });

    currentBot.command("status", (ctx: Context) => {
      ctx.reply("Bot está operacional! ✅");
    });

    // Iniciar bot
    await currentBot.launch();
    console.log("Bot do Telegram iniciado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao iniciar bot:", error);
    return false;
  }
}

export async function stopTelegramBot() {
  if (bot) {
    await bot.stop();
    bot = null;
  }
}

// Handler para mensagens
export async function handleTelegramMessage(message: any) {
  const currentBot = getTelegramBot();
  if (!currentBot) {
    throw new Error("Bot do Telegram não inicializado");
  }

  try {
    const chatId = message.chat.id;
    const text = message.text || "";

    // Logging para debug
    console.log(`Mensagem recebida de ${chatId}:`, text);

    // Resposta padrão
    await currentBot.telegram.sendMessage(
      chatId,
      "Mensagem recebida! Processando..."
    );

    return true;
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    return false;
  }
}

export function isBotInitialized() {
  return bot !== null;
}