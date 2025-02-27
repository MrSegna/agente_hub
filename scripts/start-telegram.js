import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as dotenv from 'dotenv';
import { TelegramService } from '../lib/services/telegram-service.js';
import { TinyERPService } from '../lib/services/tiny-erp-service.js';
import { validateConfig } from '../lib/config.js';

// Configurar caminhos para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');

// Carregar variáveis de ambiente
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Erro ao carregar .env:', result.error);
  process.exit(1);
}

async function checkTinyAuth() {
  try {
    const tinyService = TinyERPService.getInstance();
    
    if (!tinyService.isAuthenticated()) {
      console.log('\nAtenção: Autenticação com Tiny ERP necessária!');
      console.log('Por favor, siga os passos abaixo:');
      console.log('1. Inicie o servidor Next.js em outro terminal:');
      console.log('   npm run dev');
      console.log('\n2. Acesse no navegador:');
      console.log('   http://localhost:3000/auth/tiny');
      console.log('\n3. Siga o processo de autorização');
      console.log('\n4. Após autorizar, reinicie este bot');
      process.exit(1);
    }

    return true;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    process.exit(1);
  }
}

async function startBot() {
  try {
    console.log('Validando configurações...');
    validateConfig();
    
    console.log('Verificando autenticação com Tiny ERP...');
    await checkTinyAuth();
    
    console.log('Iniciando bot do Telegram...');
    const telegramService = TelegramService.getInstance();
    await telegramService.start();
    
    // Gerenciar encerramento gracioso
    process.on('SIGINT', async () => {
      console.log('\nEncerrando bot...');
      await telegramService.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\nEncerrando bot...');
      await telegramService.stop();
      process.exit(0);
    });

    console.log('Bot iniciado! Pressione Ctrl+C para encerrar.');
  } catch (error) {
    console.error('Erro ao iniciar bot:', error);
    process.exit(1);
  }
}

startBot();