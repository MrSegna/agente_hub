import { NextResponse } from "next/server";
import prisma from "@/lib/config/prisma";
import ngrok from "ngrok";
import { getTelegramBot } from "@/lib/services/telegram-service";
import { getTokens as getTinyTokens } from "@/lib/config/tiny";

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function checkTelegramBot() {
  try {
    const bot = getTelegramBot();
    return bot !== null;
  } catch {
    return false;
  }
}

async function checkTinyConnection() {
  try {
    const tokens = getTinyTokens();
    return !!tokens.accessToken;
  } catch {
    return false;
  }
}

async function checkNgrokTunnel() {
  try {
    const url = await ngrok.getUrl();
    return !!url;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const [databaseStatus, telegramStatus, tinyStatus, tunnelStatus] = await Promise.all([
      checkDatabaseConnection(),
      checkTelegramBot(),
      checkTinyConnection(),
      checkNgrokTunnel()
    ]);

    return NextResponse.json({
      // Serviços Core
      api: true, // Se chegou aqui, a API está funcionando
      database: databaseStatus,
      
      // Integrações
      telegram: telegramStatus,
      tiny: tinyStatus,
      whatsapp: false, // Será implementado posteriormente
      
      // Recursos
      tunnel: tunnelStatus,
      cache: true, // Implementar verificação real
      queue: true, // Implementar verificação real
      
      // Metadata
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao verificar status dos serviços:", error);
    return NextResponse.json({
      error: "Falha ao verificar status dos serviços",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}