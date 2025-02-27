import { Agent, AgentConfig } from "@/types/agent";
import { Message, Conversation } from "@/types/messaging";
import { Order, Question } from "@/types/marketplace";

interface OpenAIError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export class AgentService {
  private static instance: AgentService;
  private openAIKey: string;
  private openAIBaseUrl: string;
  private maxRetries: number = 3;

  private constructor() {
    this.openAIKey = process.env.OPENAI_API_KEY || "";
    this.openAIBaseUrl = process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1";
  }

  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  private async makeOpenAIRequest<T>(
    endpoint: string,
    data: any,
    retryCount: number = 0
  ): Promise<T> {
    try {
      const response = await fetch(`${this.openAIBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.openAIKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as OpenAIError;
        throw new Error(
          `OpenAI API error: ${errorData.error.message} (${errorData.error.code})`
        );
      }

      return await response.json();
    } catch (error) {
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeOpenAIRequest(endpoint, data, retryCount + 1);
      }
      throw error;
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry em casos de erro de rede ou rate limiting
    if (error instanceof TypeError) return true; // Erro de rede
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("rate limit") ||
        message.includes("timeout") ||
        message.includes("network")
      );
    }
    return false;
  }

  private async generateResponse(
    agent: Agent,
    messages: ChatMessage[],
    functions?: Array<{
      name: string;
      description: string;
      parameters: Record<string, any>;
    }>
  ): Promise<string> {
    try {
      const requestData: any = {
        model: agent.model,
        messages: [
          { role: "system", content: agent.systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
      };

      if (functions?.length) {
        requestData.functions = functions;
        requestData.function_call = "auto";
      }

      const response = await this.makeOpenAIRequest<any>(
        "/chat/completions",
        requestData
      );

      const choice = response.choices[0];
      
      if (choice.function_call) {
        // Implementar lógica de chamada de função aqui se necessário
        return `Function call: ${JSON.stringify(choice.function_call)}`;
      }

      return choice.message.content;
    } catch (error) {
      console.error("Erro ao gerar resposta:", error);
      throw new Error(
        `Falha ao gerar resposta: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }

  public async handleWhatsAppMessage(
    message: Message,
    conversation: Conversation,
    agent: Agent
  ): Promise<Message> {
    try {
      // Preparar contexto da conversa
      const conversationHistory = this.prepareConversationContext(
        conversation,
        agent
      );

      // Adicionar a mensagem atual
      conversationHistory.push({
        role: "user" as const,
        content: "content" in message ? message.content : JSON.stringify(message),
      });

      // Gerar resposta
      const response = await this.generateResponse(agent, conversationHistory);

      // Criar mensagem de resposta
      const replyMessage: Message = {
        id: crypto.randomUUID(),
        type: "text",
        source: "system",
        timestamp: new Date(),
        status: "pending",
        fromId: agent.id,
        toId: message.fromId,
        agentId: agent.id,
        content: response,
      };

      return replyMessage;
    } catch (error) {
      console.error("Erro ao processar mensagem do WhatsApp:", error);
      throw error;
    }
  }

  private prepareConversationContext(
    conversation: Conversation,
    agent: Agent
  ): ChatMessage[] {
    // Pegar últimas 10 mensagens para contexto
    const recentMessages = conversation.messages.slice(-10);
    
    // Preparar contexto inicial com informações relevantes
    const initialContext: ChatMessage = {
      role: "system",
      content: `${agent.systemPrompt}\n\nContexto da conversa:\n- ID da conversa: ${
        conversation.id
      }\n- Plataforma: ${
        conversation.metadata.platform
      }\n- Início: ${conversation.createdAt.toISOString()}`,
    };

    // Converter mensagens em formato ChatMessage
    const messageHistory: ChatMessage[] = recentMessages.map(msg => ({
      role: msg.fromId === agent.id ? "assistant" : "user",
      content: "content" in msg ? msg.content : JSON.stringify(msg),
    }));

    return [initialContext, ...messageHistory];
  }

  public async handleMarketplaceOrder(
    order: Order,
    agent: Agent
  ): Promise<Message> {
    try {
      // Preparar mensagem sobre o pedido
      const orderContext = `Novo pedido recebido:
      ID: ${order.externalId}
      Plataforma: ${order.platform}
      Comprador: ${order.buyer.name}
      Valor Total: ${order.payment.total}
      Status: ${order.status}`;

      const response = await this.generateResponse(agent, [
        { role: "user", content: orderContext },
      ]);

      // Criar mensagem de resposta
      const replyMessage: Message = {
        id: crypto.randomUUID(),
        type: "order_update",
        source: "system",
        timestamp: new Date(),
        status: "pending",
        fromId: agent.id,
        toId: order.buyer.id,
        agentId: agent.id,
        orderId: order.id,
        orderStatus: order.status,
        platform: order.platform,
        details: order,
      };

      return replyMessage;
    } catch (error) {
      console.error("Erro ao processar pedido do marketplace:", error);
      throw error;
    }
  }

  public async handleMarketplaceQuestion(
    question: Question,
    agent: Agent
  ): Promise<Message> {
    try {
      // Preparar contexto da pergunta
      const questionContext = `Nova pergunta recebida:
      Produto: ${question.productId}
      Pergunta: ${question.question}`;

      const response = await this.generateResponse(agent, [
        { role: "user", content: questionContext },
      ]);

      // Criar mensagem de resposta
      const replyMessage: Message = {
        id: crypto.randomUUID(),
        type: "question",
        source: "system",
        timestamp: new Date(),
        status: "pending",
        fromId: agent.id,
        toId: question.buyerId,
        agentId: agent.id,
        productId: question.productId,
        question: question.question,
        platform: question.platform,
      };

      return replyMessage;
    } catch (error) {
      console.error("Erro ao processar pergunta do marketplace:", error);
      throw error;
    }
  }
}