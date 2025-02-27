import { TinyOrder, TinyProduct, TinyResponse, TinyTokens } from "@/types/tiny-erp";
import { getTokens, setTokens } from "@/lib/config/tiny";

interface TinyErrorResponse {
  codigo: string;
  erro: {
    codigo: string;
    mensagem: string;
  };
}

class TinyError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'TinyError';
  }
}

const BASE_URL = 'https://api.tiny.com.br/api2';

async function makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const { accessToken } = getTokens();
  
  const searchParams = new URLSearchParams({
    token: accessToken,
    formato: 'json',
    ...params
  });

  const response = await fetch(`${BASE_URL}/${endpoint}?${searchParams}`);
  const data = await response.json();

  if ('erro' in data) {
    const error = data as TinyErrorResponse;
    throw new TinyError(error.erro.mensagem, error.erro.codigo);
  }

  return data as T;
}

export async function refreshTokenIfNeeded(): Promise<TinyTokens> {
  const tokens = getTokens();
  
  // Se o token ainda é válido, não precisa renovar
  if (tokens.expiresAt > Date.now()) {
    return tokens;
  }

  try {
    const response = await makeRequest<TinyResponse<{ token: string }>>('refresh_token', {
      refresh_token: tokens.refreshToken
    });

    const newTokens = {
      accessToken: response.retorno.token,
      refreshToken: tokens.refreshToken,
      expiresAt: Date.now() + 3600000 // 1 hora
    };

    setTokens(newTokens);
    return newTokens;
  } catch (error) {
    if (error instanceof TinyError && error.code === 'token_invalido') {
      throw new Error('Refresh token inválido. Necessário reautenticar.');
    }
    throw error;
  }
}

export async function listOrders(): Promise<TinyOrder[]> {
  await refreshTokenIfNeeded();
  
  const response = await makeRequest<TinyResponse<{ pedidos: TinyOrder[] }>>('pedidos.pesquisa.php');
  return response.retorno.pedidos;
}

export async function getOrder(id: string): Promise<TinyOrder> {
  await refreshTokenIfNeeded();
  
  const response = await makeRequest<TinyResponse<{ pedido: TinyOrder }>>('pedido.obter.php', {
    id
  });
  return response.retorno.pedido;
}

export async function listProducts(): Promise<TinyProduct[]> {
  await refreshTokenIfNeeded();
  
  const response = await makeRequest<TinyResponse<{ produtos: TinyProduct[] }>>('produtos.pesquisa.php');
  return response.retorno.produtos;
}

export async function getProduct(id: string): Promise<TinyProduct> {
  await refreshTokenIfNeeded();
  
  const response = await makeRequest<TinyResponse<{ produto: TinyProduct }>>('produto.obter.php', {
    id
  });
  return response.retorno.produto;
}

export async function updateStock(productId: string, quantity: number): Promise<void> {
  await refreshTokenIfNeeded();
  
  await makeRequest('produto.atualizar.estoque.php', {
    id: productId,
    estoque: quantity
  });
}