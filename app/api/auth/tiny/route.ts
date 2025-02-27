import { TinyERPService } from '@/lib/services/tiny-erp-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tinyService = TinyERPService.getInstance({
      clientId: process.env.TINY_CLIENT_ID!,
      clientSecret: process.env.TINY_CLIENT_SECRET!,
      redirectUri: process.env.TINY_REDIRECT_URI!
    });

    const authUrl = tinyService.getAuthorizationUrl();

    return NextResponse.json({
      success: true,
      auth_url: authUrl
    });
  } catch (error) {
    console.error('Erro ao gerar URL de autenticação:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao gerar URL de autenticação'
    }, { status: 500 });
  }
}