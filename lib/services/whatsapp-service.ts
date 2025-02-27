import { WhatsAppConfig } from "@/types/agent";
import { Message, TextMessage } from "@/types/messaging";
import { CONFIG } from "@/lib/config";
import OpenAI from "openai";

export class WhatsAppService {
  private static instance: WhatsAppService;
  private config: WhatsAppConfig | null = null;
  private openai: OpenAI;

  private constructor() {
    if (typeof window !== 'undefined') {
      throw new Error("WhatsAppService só pode ser usado no servidor");
    }

    if (!CONFIG.openai.apiKey) {
      throw new Error("A chave da API OpenAI não está configurada");
    }
    
    this.openai = new OpenAI({
      apiKey: CONFIG.openai.apiKey,
      baseURL: CONFIG.openai.baseUrl,
    });
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  public async ensureInitialized(): Promise<void> {
    if (!this.config) {
      await this.loadConfig();
    }
  }

  private async loadConfig(): Promise<void> {
    this.config = {
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "",
      testNumber: process.env.WHATSAPP_TEST_NUMBER || "",
      apiBaseUrl: process.env.WHATSAPP_API_BASE_URL || "https://graph.facebook.com/v17.0",
      webhookToken: process.env.WHATSAPP_WEBHOOK_TOKEN || "",
      isEnabled: true,
    };

    if (!this.config.accessToken || !this.config.phoneNumberId) {
      throw new Error("Configuração do WhatsApp incompleta");
    }
  }

  public setConfig(config: WhatsAppConfig): void {
    this.config = config;
  }

  public async testConnection(): Promise<boolean> {
    try {
      if (!this.config) {
        throw new Error("WhatsApp não configurado");
      }

      const response = await fetch(
        `${this.config.apiBaseUrl}/${this.config.phoneNumberId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      return false;
    }
  }

  private async generateAIResponse(message: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: CONFIG.openai.model,
        messages: [
          {
            role: "system",
            content: "Você é um assistente útil que responde de forma clara e concisa em português. Limite suas respostas a no máximo 2 parágrafos."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: CONFIG.openai.temperature || 0.7,
        max_tokens: CONFIG.openai.maxTokens || 150
      });

      return completion.choices[0].message.content || "Desculpe, não consegui processar sua mensagem.";
    } catch (error) {
      console.error("Erro ao gerar resposta com IA:", error);
      return "Desculpe, estou tendo problemas para processar sua mensagem no momento.";
    }
  }

  public async sendMessage(message: TextMessage): Promise<void> {
    try {
      if (!this.config) {
        throw new Error("WhatsApp não configurado");
      }

      // Gerar resposta usando OpenAI se a mensagem não for do sistema
      const messageContent = message.source === "system" 
        ? message.content 
        : await this.generateAIResponse(message.content);

      const response = await fetch(
        `${this.config.apiBaseUrl}/${this.config.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: message.toId,
            type: "text",
            text: {
              body: messageContent,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Erro ao enviar mensagem: ${error.error?.message || "Erro desconhecido"}`
        );
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      throw error;
    }
  }

  public async handleWebhook(
    body: any,
    token: string | null
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await this.ensureInitialized();

      // Verificar token do webhook
      if (
        token !== this.config?.webhookToken &&
        token !== process.env.WHATSAPP_WEBHOOK_TOKEN
      ) {
        throw new Error("Token de webhook inválido");
      }

      // Processar mensagens recebidas
      if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
        const messages = body.entry[0].changes[0].value.messages;
        
        for (const msg of messages) {
          if (msg.type === "text") {
            // Criar objeto de mensagem
            const message: TextMessage = {
              id: msg.id,
              type: "text",
              source: "whatsapp",
              timestamp: new Date(parseInt(msg.timestamp) * 1000),
              status: "received",
              fromId: msg.from,
              toId: this.config?.phoneNumberId || "",
              content: msg.text.body,
            };

            // Gerar e enviar resposta automática
            const response: TextMessage = {
              id: crypto.randomUUID(),
              type: "text",
              source: "bot",
              timestamp: new Date(),
              status: "pending",
              fromId: this.config?.phoneNumberId || "",
              toId: message.fromId,
              content: await this.generateAIResponse(message.content),
            };

            await this.sendMessage(response);
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }
}