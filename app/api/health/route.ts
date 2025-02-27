import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Telegraf } from 'telegraf';
import { headers } from 'next/headers';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    api: boolean;
    database: boolean;
    telegram: boolean;
    tiny: boolean;
    whatsapp: boolean;
    tunnel: boolean;
  };
  details?: Record<string, any>;
}

const prisma = new PrismaClient();

export async function GET() {
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: true,
      database: false,
      telegram: false,
      tiny: false,
      whatsapp: false,
      tunnel: false
    }
  };

  try {
    // Verifica banco de dados
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.services.database = true;

    // Verifica Telegram
    if (process.env.TELEGRAM_BOT_TOKEN) {
      const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
      await bot.telegram.getMe();
      healthStatus.services.telegram = true;
    }

    // Verifica Tiny ERP
    try {
      const tinyResponse = await fetch('https://api.tiny.com.br/api2/ping.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      healthStatus.services.tiny = tinyResponse.ok;
    } catch {
      healthStatus.services.tiny = false;
    }

    // Verifica WhatsApp
    if (process.env.WHATSAPP_TOKEN) {
      try {
        const whatsappResponse = await fetch(
          `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            },
          }
        );
        healthStatus.services.whatsapp = whatsappResponse.ok;
      } catch {
        healthStatus.services.whatsapp = false;
      }
    }

    // Verifica túnel
    try {
      const host = headers().get('host');
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const response = await fetch(`${protocol}://${host}/api/status/tunnel`);
      healthStatus.services.tunnel = response.ok;
    } catch {
      healthStatus.services.tunnel = false;
    }

    // Atualiza status geral
    healthStatus.status = Object.values(healthStatus.services).every(Boolean)
      ? 'healthy'
      : 'unhealthy';

  } catch (error) {
    healthStatus.status = 'unhealthy';
    healthStatus.details = {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(healthStatus);
}