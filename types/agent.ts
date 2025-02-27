export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  testNumber: string;
  apiBaseUrl: string;
  webhookToken: string;
  isEnabled: boolean;
}

export interface OpenAIConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export type AgentRole = "CUSTOMER_SERVICE" | "TASK_EXECUTOR" | "PERSONAL_ASSISTANT" | "TECH_SUPPORT" | "PROJECT_MANAGER";

export type AIModel = "gpt-4" | "gpt-3.5-turbo";

export type AgentPersonality = {
  tone: "professional" | "casual" | "friendly" | "technical";
  language: "pt-BR" | "en-US";
};

export interface Agent {
  id: string;
  name: string;
  description?: string;
  type: "whatsapp" | "marketplace";
  role: AgentRole;
  model: AIModel;
  personality: AgentPersonality;
  systemPrompt: string;
  config: {
    whatsapp?: WhatsAppConfig;
    openai?: OpenAIConfig;
  };
  status: "active" | "inactive" | "error";
  lastError?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  settings?: {
    responseTemplate?: string;
    maxTokens?: number;
    temperature?: number;
    language?: string;
    contextWindow?: number;
  };
  capabilities?: {
    fileProcessing: boolean;
    imageGeneration: boolean;
    internetAccess: boolean;
    codeExecution: boolean;
    apiIntegration: {
      whatsapp: boolean;
      marketplace: boolean;
      payment: boolean;
    };
  };
}

export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  whatsapp?: WhatsAppConfig;
  openai?: OpenAIConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AgentType = Agent["type"];
export type AgentStatus = Agent["status"];
