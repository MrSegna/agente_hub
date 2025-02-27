# Configuração do Tiny ERP

## 1. Pré-requisitos

- Conta ativa no Tiny ERP
- Node.js 18+ instalado
- NPM ou Yarn instalado

## 2. Configuração de Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto:
```env
# Tiny ERP Configuration
TINY_CLIENT_ID=seu_client_id
TINY_CLIENT_SECRET=seu_client_secret
TINY_REDIRECT_URI=http://localhost:3000/auth/tiny/callback
```

## 3. Obter Credenciais do Tiny ERP

1. Acesse o [Portal do Desenvolvedor do Tiny](https://dev.tiny.com.br/)
2. Faça login com sua conta Tiny ERP
3. Vá para "Minhas Aplicações"
4. Clique em "Nova Aplicação"
5. Preencha os dados:
   - Nome: Bot de Estoque
   - Descrição: Bot para consulta de estoque via Telegram
   - URL de Redirecionamento: http://localhost:3000/auth/tiny/callback
6. Copie as credenciais fornecidas:
   - Client ID
   - Client Secret
7. Cole as credenciais no arquivo `.env`

## 4. Processo de Autenticação

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra o navegador e acesse:
```
http://localhost:3000/auth/tiny
```

3. Clique no botão "Conectar com Tiny ERP"

4. Você será redirecionado para o Tiny ERP:
   - Faça login se necessário
   - Autorize o aplicativo
   - Aguarde o redirecionamento de volta

5. Se a autenticação for bem-sucedida:
   - Você verá uma mensagem de confirmação
   - O bot estará pronto para usar

## 5. Renovação de Tokens

O sistema gerencia automaticamente:
- Renovação de tokens de acesso (expiram em 4 horas)
- Renovação de refresh tokens (expiram em 24 horas)

## 6. Testando a Integração

1. Inicie o bot do Telegram:
```bash
npm run telegram:dev
```

2. No Telegram, envie uma mensagem:
```
Qual o estoque do produto SF905-Preto-M?
```

3. O bot deve responder com:
- Quantidade em estoque
- Preço atual
- Informações adicionais

## 7. Solução de Problemas

Se encontrar erros:

1. Verifique as variáveis de ambiente:
```bash
cat .env
```

2. Confirme que o servidor está rodando:
```bash
npm run dev
```

3. Verifique os logs do bot:
```bash
npm run telegram:dev
```

4. Caso necessário, repita o processo de autenticação:
   - Acesse http://localhost:3000/auth/tiny
   - Autorize novamente o aplicativo

## 8. Segurança

- Mantenha suas credenciais seguras
- Não compartilhe o .env
- Use HTTPS em produção
- Monitore o uso da API