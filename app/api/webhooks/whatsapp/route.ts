import { NextRequest, NextResponse } from "next/server";
import { WhatsAppService } from "@/lib/services/whatsapp-service";

export async function GET(request: NextRequest) {
  try {
    const mode = request.nextUrl.searchParams.get("hub.mode");
    const token = request.nextUrl.searchParams.get("hub.verify_token");
    const challenge = request.nextUrl.searchParams.get("hub.challenge");

    // Validar modo e token
    if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
      return new NextResponse(challenge);
    } else {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  } catch (error) {
    console.error("Erro na verificação do webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.nextUrl.searchParams.get("token");

    // Validar token do webhook
    if (token !== process.env.WHATSAPP_WEBHOOK_TOKEN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const whatsappService = WhatsAppService.getInstance();
    const result = await whatsappService.handleWebhook(body, token);

    if (!result.success) {
      throw new Error(result.message || "Erro ao processar webhook");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no processamento do webhook:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erro interno",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Necessário para o Next.js não cachear as respostas da API
export const dynamic = "force-dynamic";