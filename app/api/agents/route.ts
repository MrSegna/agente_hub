import { NextRequest, NextResponse } from "next/server";
import { AgentService } from "@/lib/services/agent-service";
import { Agent, AgentRole, AIModel } from "@/types/agent";
import * as z from "zod";

const agentService = AgentService.getInstance();

const createAgentSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  role: z.enum(["CUSTOMER_SERVICE", "TASK_EXECUTOR", "PERSONAL_ASSISTANT", "TECH_SUPPORT", "PROJECT_MANAGER"] as const),
  model: z.enum(["gpt-4", "gpt-3.5-turbo"] as const),
  personality: z.object({
    tone: z.enum(["professional", "casual", "friendly", "technical"] as const),
    language: z.enum(["pt-BR", "en-US"] as const),
  }),
  systemPrompt: z.string().min(10, "Prompt do sistema deve ter pelo menos 10 caracteres"),
  capabilities: z.object({
    fileProcessing: z.boolean(),
    imageGeneration: z.boolean(),
    internetAccess: z.boolean(),
    codeExecution: z.boolean(),
    apiIntegration: z.object({
      whatsapp: z.boolean(),
      marketplace: z.boolean(),
      payment: z.boolean(),
    }),
  }),
  config: z.object({
    whatsapp: z.object({
      phoneNumber: z.string().optional(),
      apiKey: z.string().optional(),
      webhookUrl: z.string().optional(),
      isEnabled: z.boolean(),
    }).optional(),
    marketplace: z.object({
      platform: z.enum(["mercadolivre", "shopee"] as const).optional(),
      apiKey: z.string().optional(),
      sellerId: z.string().optional(),
      webhookUrl: z.string().optional(),
      isEnabled: z.boolean(),
    }).optional(),
  }).optional(),
});

export async function GET(req: NextRequest) {
  try {
    // TODO: Implementar paginação e filtros
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Mock de dados por enquanto
    const agents = [
      {
        id: "1",
        name: "Assistente de Vendas",
        description: "Atendimento a clientes e processamento de pedidos",
        role: "CUSTOMER_SERVICE" as AgentRole,
        model: "gpt-3.5-turbo" as AIModel,
        personality: {
          tone: "professional" as const,
          language: "pt-BR" as const,
        },
        systemPrompt: "Você é um assistente especializado em vendas...",
        isActive: true,
        capabilities: {
          fileProcessing: false,
          imageGeneration: false,
          internetAccess: true,
          codeExecution: false,
          apiIntegration: {
            whatsapp: true,
            marketplace: true,
            payment: false,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return NextResponse.json({
      agents,
      pagination: {
        page,
        limit,
        total: agents.length,
        totalPages: Math.ceil(agents.length / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar agentes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validar dados
    const validationResult = createAgentSchema.safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos",
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    // TODO: Persistir no banco de dados
    const agent: Agent = {
      id: crypto.randomUUID(),
      ...validationResult.data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}