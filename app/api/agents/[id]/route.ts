import { NextRequest, NextResponse } from "next/server";
import { AgentService } from "@/lib/services/agent-service";

const agentService = AgentService.getInstance();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Buscar do banco de dados
    const mockAgent = {
      id: params.id,
      name: "Assistente de Vendas",
      description: "Atendimento a clientes e processamento de pedidos",
      role: "CUSTOMER_SERVICE" as const,
      model: "gpt-3.5-turbo" as const,
      personality: {
        tone: "professional" as const,
        language: "pt-BR" as const,
      },
      systemPrompt: "Você é um assistente especializado em vendas...",
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
      isActive: true,
      config: {
        whatsapp: {
          phoneNumber: "+5511999999999",
          apiKey: "xxx",
          webhookUrl: "https://...",
          isEnabled: true,
        },
        marketplace: {
          platform: "mercadolivre" as const,
          apiKey: "xxx",
          sellerId: "123",
          webhookUrl: "https://...",
          isEnabled: true,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!mockAgent) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(mockAgent);
  } catch (error) {
    console.error("Erro ao buscar agente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const data = await req.json();

    // TODO: Validar dados com Zod
    // TODO: Atualizar no banco de dados

    const updatedAgent = {
      ...data,
      id: params.id,
      updatedAt: new Date(),
    };

    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error("Erro ao atualizar agente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Implementar lógica de deleção
    // await prisma.agent.delete({ where: { id: params.id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erro ao deletar agente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}