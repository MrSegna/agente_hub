import { NextRequest, NextResponse } from "next/server";
import { Conversation, TextMessage } from "@/types/messaging";

// TODO: Implementar integração com banco de dados
// Por enquanto, usando dados mockados para teste
const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: ["+5511999999999"],
    agentId: "agent1",
    messages: [
      {
        id: "msg1",
        type: "text",
        source: "whatsapp",
        timestamp: new Date(),
        status: "delivered",
        fromId: "+5511999999999",
        toId: "agent1",
        content: "Olá, preciso de ajuda",
      } as TextMessage,
      {
        id: "msg2",
        type: "text",
        source: "system",
        timestamp: new Date(),
        status: "delivered",
        fromId: "agent1",
        toId: "+5511999999999",
        content: "Olá! Como posso ajudar?",
      } as TextMessage,
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      platform: "whatsapp",
      customerInfo: {
        phoneNumber: "+5511999999999",
        name: "Cliente Teste",
      },
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar paginação e filtros
    return NextResponse.json(mockConversations);
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId, message } = body;

    if (!participantId || !message) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    // TODO: Implementar criação de conversa no banco de dados
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      participants: [participantId],
      messages: [
        {
          id: crypto.randomUUID(),
          type: "text",
          source: "system",
          timestamp: new Date(),
          status: "pending",
          fromId: "system",
          toId: participantId,
          content: message,
        } as TextMessage,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        platform: "whatsapp",
        customerInfo: {
          phoneNumber: participantId,
        },
      },
    };

    mockConversations.push(newConversation);

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

// Necessário para o Next.js não cachear as respostas da API
export const dynamic = "force-dynamic";