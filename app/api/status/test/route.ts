import { NextResponse } from 'next/server';

// Estado simulado dos serviços
let mockStatus = {
  api: true,
  database: true,
  telegram: false,
  tiny: false,
  tunnel: false,
  whatsapp: false,
  cache: true,
  queue: true,
  timestamp: new Date().toISOString()
};

export async function GET() {
  return NextResponse.json(mockStatus);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Atualiza o estado simulado
    if (body.service && typeof body.status === 'boolean') {
      mockStatus = {
        ...mockStatus,
        [body.service]: body.status,
        timestamp: new Date().toISOString()
      };
    }

    return NextResponse.json(mockStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}