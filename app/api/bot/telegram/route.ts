import { NextRequest, NextResponse } from "next/server";
import { TelegramService } from "@/lib/services/telegram-service";

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const telegramService = TelegramService.getInstance();

    switch (action) {
      case 'start':
        await telegramService.start();
        return NextResponse.json({ success: true, message: 'Bot iniciado com sucesso' });

      case 'stop':
        await telegramService.stop();
        return NextResponse.json({ success: true, message: 'Bot encerrado com sucesso' });

      default:
        return NextResponse.json(
          { success: false, message: 'Ação inválida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erro na ação do bot:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      },
      { status: 500 }
    );
  }
}

// Necessário para o Next.js não cachear as respostas da API
export const dynamic = 'force-dynamic';