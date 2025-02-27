import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';
import { TinyERPService } from './tiny-erp-service.js';
import { CONFIG, validateConfig } from '../config.js';

export class TelegramService {
  static instance;
  bot = null;
  openai;
  tinyErp;
  commands = {};
  isRunning = false;

  constructor() {
    // Validar configuração antes de inicializar
    validateConfig();

    this.openai = new OpenAI({
      apiKey: CONFIG.openai.apiKey,
      baseURL: CONFIG.openai.baseUrl,
    });

    this.tinyErp = TinyERPService.getInstance({
      clientId: CONFIG.tiny.clientId,
      clientSecret: CONFIG.tiny.clientSecret,
      redirectUri: CONFIG.tiny.redirectUri
    });

    this.registerCommands();
  }

  static getInstance() {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  registerCommands() {
    this.commands = {
      start: {
        name: 'start',
        description: 'Iniciar o bot',
        handler: async (msg) => {
          const welcomeMessage = 
            'Olá! Eu sou um assistente que pode te ajudar com consultas de estoque e outras informações.\n\n' +
            'Para consultar um produto, você pode perguntar por exemplo:\n' +
            '"Qual o estoque do produto SF905-Preto-M?"\n\n' +
            'Use /help para ver todos os comandos disponíveis.';
          
          await this.sendMessage(msg.chat.id, welcomeMessage);
        }
      },
      help: {
        name: 'help',
        description: 'Mostrar ajuda',
        handler: async (msg) => {
          const helpMessage = 
            'Comandos disponíveis:\n\n' +
            '/start - Iniciar o bot\n' +
            '/help - Mostrar esta mensagem\n\n' +
            'Você também pode:\n' +
            '- Consultar estoque de produtos\n' +
            '- Fazer perguntas sobre produtos\n' +
            '- Obter informações de preços\n\n' +
            'Exemplo: "Quantas unidades temos do produto SF905-Preto-M?"';
          
          await this.sendMessage(msg.chat.id, helpMessage);
        }
      }
    };
  }

  async processarConsultaEstoque(texto) {
    // Extrai o código do produto do texto
    const match = texto.match(/\b([A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+)\b/);
    if (!match) {
      return "Desculpe, não consegui identificar o código do produto. Por favor, forneça o código no formato correto (exemplo: SF905-Preto-M)";
    }

    const codigoProduto = match[1];

    try {
      const response = await this.tinyErp.consultarEstoque({ codigo: codigoProduto });
      
      if (response.status === 'error' || !response.data) {
        return `Desculpe, não foi possível consultar o estoque do produto ${codigoProduto}. Erro: ${response.error || 'Produto não encontrado'}`;
      }

      const produto = response.data.produto;
      const dadosEstoque = this.tinyErp.formatarRespostaEstoque(produto);

      // Gera uma resposta contextual usando a IA
      const completion = await this.openai.chat.completions.create({
        model: CONFIG.openai.model,
        messages: [
          {
            role: "system",
            content: "Você é um assistente útil que fornece informações sobre produtos e estoque de forma natural e profissional. Use os dados fornecidos para criar uma resposta amigável e contextualizada em português."
          },
          {
            role: "user",
            content: `Crie uma resposta amigável para uma consulta de estoque com os seguintes dados:\n${dadosEstoque}`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return completion.choices[0].message.content || dadosEstoque;

    } catch (error) {
      console.error("Erro ao consultar estoque:", error);
      return "Desculpe, ocorreu um erro ao consultar o estoque. Por favor, tente novamente mais tarde.";
    }
  }

  async generateAIResponse(message) {
    try {
      // Verifica se é uma consulta de estoque
      if (message.toLowerCase().includes('estoque') || 
          message.toLowerCase().includes('quantidade') ||
          message.toLowerCase().includes('unidades')) {
        return await this.processarConsultaEstoque(message);
      }

      // Outras mensagens usam resposta padrão da IA
      const completion = await this.openai.chat.completions.create({
        model: CONFIG.openai.model,
        messages: [
          {
            role: "system",
            content: "Você é um assistente útil e amigável que responde de forma clara e concisa em português. Limite suas respostas a no máximo 2 parágrafos."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return completion.choices[0].message.content || "Desculpe, não consegui processar sua mensagem.";
    } catch (error) {
      console.error("Erro ao gerar resposta com IA:", error);
      return "Desculpe, estou tendo problemas para processar sua mensagem no momento.";
    }
  }

  async start() {
    try {
      if (this.isRunning) {
        console.log('Bot já está em execução.');
        return;
      }

      if (!CONFIG.telegram.token) {
        throw new Error('Token do bot não configurado');
      }

      // Encerra qualquer instância anterior
      if (this.bot) {
        await this.stop();
      }

      this.bot = new TelegramBot(CONFIG.telegram.token, { polling: true });
      this.isRunning = true;

      // Handler para comandos e mensagens
      this.bot.on('message', async (msg) => {
        try {
          const chatId = msg.chat.id;
          const text = msg.text || '';

          console.log(`Mensagem recebida de ${msg.from?.username || 'usuário'}: ${text}`);

          // Verificar se é um comando
          if (text.startsWith('/')) {
            const command = text.split(' ')[0].substring(1);
            if (this.commands[command]) {
              await this.commands[command].handler(msg);
              return;
            }
          }

          // Se não for um comando, gerar resposta
          const response = await this.generateAIResponse(text);
          await this.sendMessage(chatId, response);

        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
          await this.sendMessage(msg.chat.id, 'Desculpe, ocorreu um erro ao processar sua mensagem.');
        }
      });

      // Handler para erros de polling
      this.bot.on('polling_error', (error) => {
        console.error('Erro de polling:', error);
        if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
          this.stop().catch(console.error);
        }
      });

      console.log('Bot do Telegram iniciado com sucesso!');
      console.log(`Username do bot: ${CONFIG.telegram.username}`);

    } catch (error) {
      this.isRunning = false;
      console.error('Erro ao iniciar bot:', error);
      throw error;
    }
  }

  async sendMessage(chatId, text) {
    try {
      if (!this.bot) {
        throw new Error('Bot não inicializado');
      }

      await this.bot.sendMessage(chatId, text);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  async stop() {
    if (this.bot) {
      try {
        await this.bot.stopPolling();
        this.bot = null;
        this.isRunning = false;
        console.log('Bot do Telegram encerrado com sucesso!');
      } catch (error) {
        console.error('Erro ao encerrar bot:', error);
        throw error;
      }
    }
  }
}