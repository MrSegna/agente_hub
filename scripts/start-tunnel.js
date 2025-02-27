import ngrok from 'ngrok';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações
const NGROK_CONFIG = {
  addr: process.env.PORT || 3000,
  authtoken: process.env.NGROK_AUTH_TOKEN,
  region: process.env.NGROK_REGION || 'sa',
};

// Arquivo temporário para salvar a URL
const TEMP_FILE = join(__dirname, '../ngrok.temp.yml');

async function startTunnel() {
  try {
    // Inicia o túnel
    const url = await ngrok.connect({
      ...NGROK_CONFIG,
      onStatusChange: status => {
        console.log(`[Túnel] Status alterado: ${status}`);
      },
      onLogEvent: data => {
        if (data.includes('error')) {
          console.error(`[Túnel] ${data}`);
        }
      }
    });

    // Salva a URL em um arquivo temporário
    const config = `url: ${url}\ntimestamp: ${new Date().toISOString()}`;
    fs.writeFileSync(TEMP_FILE, config, 'utf8');

    console.log(`[Túnel] Túnel online em: ${url}`);
    
    // Atualiza webhook do Telegram se necessário
    if (process.env.TELEGRAM_BOT_TOKEN) {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: `${url}/api/bot/telegram`,
              drop_pending_updates: true
            }),
          }
        );

        const data = await response.json();
        if (data.ok) {
          console.log('[Túnel] Webhook do Telegram atualizado com sucesso');
        } else {
          console.error('[Túnel] Erro ao atualizar webhook do Telegram:', data.description);
        }
      } catch (error) {
        console.error('[Túnel] Erro ao atualizar webhook do Telegram:', error);
      }
    }

  } catch (error) {
    console.error('[Túnel] Erro ao iniciar túnel:', error);
    process.exit(1);
  }
}

// Limpa o arquivo temporário ao finalizar
process.on('SIGINT', async () => {
  try {
    if (fs.existsSync(TEMP_FILE)) {
      fs.unlinkSync(TEMP_FILE);
    }
    await ngrok.kill();
    console.log('[Túnel] Túnel finalizado');
    process.exit(0);
  } catch (error) {
    console.error('[Túnel] Erro ao finalizar túnel:', error);
    process.exit(1);
  }
});

// Inicia o túnel
console.log('[Túnel] Iniciando túnel...');
startTunnel();