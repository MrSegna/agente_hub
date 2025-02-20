export type AgentRole =
  | "customer_service"
  | "task_execution"
  | "personal_assistant"
  | "technical_support"
  | "project_manager"

export type AIModel = "gpt-4" | "gpt-3.5-turbo"

export interface AgentPersonality {
  tone: "professional" | "casual" | "friendly" | "technical"
  language: "pt-BR" | "en-US"
}

export interface AgentCapabilities {
  canProcessFiles: boolean
  canGenerateImages: boolean
  canAccessInternet: boolean
  canExecuteCode: boolean
}

export interface Task {
  id: string
  description: string
  completed: boolean
  result?: string
  createdAt: Date
}

export interface Agent {
  id: string
  name: string
  description: string
  role: AgentRole
  model: AIModel
  personality: AgentPersonality
  capabilities: AgentCapabilities
  systemPrompt: string
  isActive: boolean
  createdAt: Date
  tasks: Task[]
}

