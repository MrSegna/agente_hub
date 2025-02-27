import axios from 'axios';

class TinyERPService {
  static instance;
  tokens = null;
  apiBaseUrl = 'https://api.tiny.com.br/public-api/v3';
  authBaseUrl = 'https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect';
  
  constructor(config) {
    this.config = config;
  }

  static getInstance(config) {
    if (!TinyERPService.instance) {
      TinyERPService.instance = new TinyERPService(config);
    }
    return TinyERPService.instance;
  }

  // Gera a URL de autorização para o usuário
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'openid',
      response_type: 'code'
    });

    return `${this.authBaseUrl}/auth?${params.toString()}`;
  }

  // Obtém tokens usando o código de autorização
  async getTokens(authorizationCode) {
    try {
      const response = await axios.post(`${this.authBaseUrl}/token`, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
          code: authorizationCode
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        refreshExpiresIn: response.data.refresh_expires_in,
        tokenType: response.data.token_type
      };

      return this.tokens;
    } catch (error) {
      console.error('Erro ao obter tokens:', error);
      throw new Error('Falha na autenticação com o Tiny ERP');
    }
  }

  // Atualiza o token usando refresh token
  async refreshAccessToken() {
    if (!this.tokens?.refreshToken) {
      throw new Error('Refresh token não disponível');
    }

    try {
      const response = await axios.post(`${this.authBaseUrl}/token`, null, {
        params: {
          grant_type: 'refresh_token',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.tokens.refreshToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        refreshExpiresIn: response.data.refresh_expires_in,
        tokenType: response.data.token_type
      };
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      throw new Error('Falha ao atualizar o token de acesso');
    }
  }

  // Consulta estoque de um produto
  async consultarEstoque(query) {
    try {
      if (!this.tokens?.accessToken) {
        throw new Error('Token de acesso não disponível');
      }

      const endpoint = query.id 
        ? `/estoque/${query.id}`
        : `/produtos?pesquisa=${query.codigo}`;

      const response = await axios.get(`${this.apiBaseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.tokens.accessToken}`
        }
      });

      return {
        status: 'success',
        data: response.data
      };
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.consultarEstoque(query);
      }

      return {
        status: 'error',
        error: error.message || 'Erro ao consultar estoque'
      };
    }
  }

  // Formata a resposta de estoque para texto
  formatarRespostaEstoque(produto) {
    return `${produto.nome} (${produto.codigo}):\n` +
           `Quantidade em estoque: ${produto.saldo} ${produto.unidade}\n` +
           `Preço: R$ ${produto.preco.toFixed(2)}`;
  }

  // Verifica se o token está válido
  isAuthenticated() {
    return !!this.tokens?.accessToken;
  }
}

export { TinyERPService };