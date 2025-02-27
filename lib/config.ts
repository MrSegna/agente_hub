export const CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_API_BASE_URL,
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
    maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 150,
  },
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    username: process.env.TELEGRAM_BOT_USERNAME,
  },
  tiny: {
    clientId: process.env.TINY_CLIENT_ID,
    clientSecret: process.env.TINY_CLIENT_SECRET,
    redirectUri: process.env.TINY_REDIRECT_URI,
  }
} as const;

export function validateConfig() {
  if (typeof window !== 'undefined') {
    // Não executar no lado do cliente
    return;
  }

  const requiredVars = {
    'OPENAI_API_KEY': CONFIG.openai.apiKey,
    'TELEGRAM_BOT_TOKEN': CONFIG.telegram.token,
    'TINY_CLIENT_ID': CONFIG.tiny.clientId,
    'TINY_CLIENT_SECRET': CONFIG.tiny.clientSecret,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Variáveis de ambiente ausentes:\n${missingVars.join('\n')}\n` +
      'Configure estas variáveis no arquivo .env'
    );
  }
}