import TelegramBot from 'node-telegram-bot-api';
import { CONFIG } from '../lib/config.js';

async function cleanup() {
  try {
    console.log('Iniciando limpeza de processos antigos...');
    
    // Cria uma instância temporária para limpar o polling
    const tempBot = new TelegramBot(CONFIG.telegram.token, {});
    
    // Remove webhooks e para polling de outras instâncias
    await tempBot.deleteWebHook();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Limpeza concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante limpeza:', error);
    process.exit(1);
  }
}

cleanup();