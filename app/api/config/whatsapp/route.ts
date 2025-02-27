import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

async function updateEnvFile(config: any) {
  const envPath = path.join(process.cwd(), ".env");
  try {
    // Ler o arquivo .env atual
    let envContent = await fs.readFile(envPath, "utf-8");
    
    // Atualizar ou adicionar cada variável
    const updates = {
      WHATSAPP_ACCESS_TOKEN: config.accessToken,
      WHATSAPP_PHONE_NUMBER_ID: config.phoneNumberId,
      WHATSAPP_BUSINESS_ACCOUNT_ID: config.businessAccountId,
      WHATSAPP_TEST_NUMBER: config.testNumber,
      WHATSAPP_API_BASE_URL: config.apiBaseUrl,
      WHATSAPP_WEBHOOK_TOKEN: config.webhookToken,
    };

    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, "m");
      const newLine = `${key}="${value}"`;
      
      if (envContent.match(regex)) {
        // Atualizar variável existente
        envContent = envContent.replace(regex, newLine);
      } else {
        // Adicionar nova variável
        envContent += `\n${newLine}`;
      }
    });

    // Salvar alterações
    await fs.writeFile(envPath, envContent);
    
    // Atualizar variáveis de ambiente em runtime
    Object.entries(updates).forEach(([key, value]) => {
      process.env[key] = value as string;
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar arquivo .env:", error);
    throw error;
  }
}

export async function GET() {
  try {
    // Enviar apenas as informações seguras para o cliente
    const config = {
      isConfigured: Boolean(
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
      ),
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
      testNumber: process.env.WHATSAPP_TEST_NUMBER,
      apiBaseUrl: process.env.WHATSAPP_API_BASE_URL || "https://graph.facebook.com/v17.0",
      webhookToken: process.env.WHATSAPP_WEBHOOK_TOKEN,
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error("Erro ao buscar configuração do WhatsApp:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();

    // Validar dados obrigatórios
    const requiredFields = [
      "accessToken",
      "phoneNumberId",
      "businessAccountId",
      "testNumber",
      "webhookToken",
    ];

    const missingFields = requiredFields.filter(field => !config[field]);
    if (missingFields.length > 0) {
      return new NextResponse(
        `Campos obrigatórios faltando: ${missingFields.join(", ")}`,
        { status: 400 }
      );
    }

    // Atualizar arquivo .env
    await updateEnvFile(config);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar configuração do WhatsApp:", error);
    return new NextResponse("Erro ao salvar configurações", { status: 500 });
  }
}

// Necessário para o Next.js não cachear as respostas da API
export const dynamic = "force-dynamic";