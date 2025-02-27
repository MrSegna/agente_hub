interface TinyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let tokens: TinyTokens | null = null;

export function setTokens(newTokens: TinyTokens) {
  tokens = newTokens;
}

export function getTokens(): TinyTokens {
  if (!tokens) {
    const accessToken = process.env.TINY_ACCESS_TOKEN;
    const refreshToken = process.env.TINY_REFRESH_TOKEN;
    
    if (!accessToken || !refreshToken) {
      throw new Error('Tokens do Tiny ERP não configurados');
    }

    tokens = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 3600000 // 1 hora
    };
  }

  return tokens;
}

export function clearTokens() {
  tokens = null;
}

export function isConfigured() {
  try {
    getTokens();
    return true;
  } catch {
    return false;
  }
}