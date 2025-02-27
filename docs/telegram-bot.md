# Documentação do Bot do Telegram com Integração Tiny ERP

## Configuração Inicial

### 1. Variáveis de Ambiente
Configure o arquivo `.env` com as seguintes variáveis:
```env
# OpenAI Configuration
OPENAI_API_KEY=sua_chave_api
OPENAI_API_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4-turbo-preview

# Telegram Configuration
TELEGRAM_BOT_TOKEN=seu_token_bot
TELEGRAM_BOT_USERNAME=seu_username_bot

# Tiny ERP Configuration
TINY_CLIENT_ID=seu_client_id
TINY_CLIENT_SECRET=seu_client_secret
TINY_REDIRECT_URI=sua_url_callback
```

### 2. Instalação
```bash
npm install
```

## Uso do Bot

### 1. Iniciar o Bot
```bash
npm run telegram:dev
```

### 2. Comandos Disponíveis
- `/start` - Iniciar o bot e ver mensagem de boas-vindas
- `/help` - Ver lista de comandos e funcionalidades

### 3. Consultas de Estoque
Para consultar o estoque de um produto, envie mensagens como:
- "Qual o estoque do produto SF905-Preto-M?"
- "Quantas unidades temos do SF905-Preto-M?"
- "Verificar quantidade em estoque do SF905-Preto-M"

## Funcionalidades Implementadas

### 1. Integração com Tiny ERP
- ✅ Autenticação OAuth2
- ✅ Consulta de estoque em tempo real
- ✅ Formatação amigável dos dados
- ✅ Renovação automática de tokens

### 2. Processamento de Linguagem Natural
- ✅ Integração com GPT-4
- ✅ Respostas contextualizadas
- ✅ Processamento em português
- ✅ Extração automática de códigos de produto

### 3. Gestão de Erros
- ✅ Validação de configurações
- ✅ Tratamento de erros de API
- ✅ Mensagens de erro amigáveis
- ✅ Logs detalhados

## Monitoramento

### 1. Logs do Sistema
O sistema registra:
- Status de inicialização
- Validação de configurações
- Mensagens recebidas
- Erros e exceções
- Status de conexão

### 2. Performance
- Tempo de resposta da IA
- Status das consultas ao Tiny ERP
- Renovação de tokens
- Estado do polling do Telegram

## Manutenção

### 1. Atualizações Necessárias
- Tokens do Tiny ERP expiram em 4 horas
- Refresh tokens expiram em 1 dia
- O sistema renova automaticamente

### 2. Monitoramento Recomendado
- Verificar logs periodicamente
- Monitorar uso da API da OpenAI
- Verificar status das conexões
- Acompanhar tempos de resposta

## Segurança

### 1. Práticas Implementadas
- Validação de variáveis de ambiente
- Tokens armazenados em memória
- Renovação automática de credenciais
- Sanitização de inputs

### 2. Recomendações
- Manter tokens seguros
- Atualizar dependências regularmente
- Monitorar acessos
- Fazer backup das configurações

## Próximas Atualizações Planejadas

1. **Melhorias de Funcionalidade**
   - Sistema de cache para consultas frequentes
   - Suporte a múltiplos formatos de código
   - Notificações de estoque baixo

2. **Otimizações**
   - Melhor gerenciamento de memória
   - Cache de respostas comuns
   - Rate limiting por usuário

3. **Novas Features**
   - Consulta de preços
   - Histórico de vendas
   - Alertas automáticos