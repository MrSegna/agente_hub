import { NextRequest, NextResponse } from "next/server";
import { WhatsAppService } from "@/lib/services/whatsapp-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Os campos 'to' e 'message' são obrigatórios" },
        { status: 400 }
      );
    }

    const whatsappService = WhatsAppService.getInstance();
    await whatsappService.sendMessage({
      id: crypto.randomUUID(),
      type: "text",
      source: "system",
      timestamp: new Date(),
      status: "pending",
      fromId: "system",
      toId: to,
      content: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const whatsappService = WhatsAppService.getInstance();
    const isConnected = await whatsappService.testConnection();

    return NextResponse.json({ isConnected });
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return NextResponse.json(
      { error: "Erro ao testar conexão" },
      { status: 500 }
    );
  }
}