import { TinyERPService } from '@/lib/services/tiny-erp-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'Código de autorização não fornecido'
      }, { status: 400 });
    }

    const tinyService = TinyERPService.getInstance({
      clientId: process.env.TINY_CLIENT_ID!,
      clientSecret: process.env.TINY_CLIENT_SECRET!,
      redirectUri: process.env.TINY_REDIRECT_URI!
    });

    // Obter tokens usando o código de autorização
    const tokens = await tinyService.getTokens(code);

    return NextResponse.json({
      success: true,
      message: 'Autenticação realizada com sucesso'
    });

  } catch (error) {
    console.error('Erro no callback:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao processar autenticação'
    }, { status: 500 });
  }
}