# Agent Model - Sistema de Gestão de Agentes IA

Sistema integrado para gerenciamento de agentes de IA, mensagens unificadas e marketplace.

## Funcionalidades

### Gerenciamento de Agentes
- Criação e configuração de agentes de IA
- Personalização de prompts e capacidades
- Monitoramento de atividades
- Estatísticas de uso

### Central de Mensagens
- Inbox unificado para múltiplas plataformas
- Suporte para WhatsApp, Instagram e Telegram
- Gestão de conversas e status
- Histórico de mensagens

### Marketplace Integrado
- Integração com Olist via TinyERP
- Gestão de pedidos e status
- Sistema de tickets e atendimento
- Métricas e análises

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta na OpenAI (para os agentes IA)
- Credenciais das APIs (WhatsApp, Instagram, Telegram, TinyERP)

## Instalação

```bash
# Clone o repositório
git clone https://github.com/mateussegna/agent-model.git

# Entre no diretório
cd agent-model

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

## Configuração

1. Crie um arquivo `.env.local` na raiz do projeto
2. Configure as seguintes variáveis:

```env
# OpenAI
OPENAI_API_KEY=sua-chave-aqui

# WhatsApp Business API
WHATSAPP_API_TOKEN=seu-token-aqui
WHATSAPP_PHONE_ID=seu-phone-id-aqui

# TinyERP
TINYERP_API_TOKEN=seu-token-aqui
```

## Estrutura do Projeto

```
/
├── app/                    # Rotas e layouts Next.js
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   └── ...               # Componentes específicos
├── hooks/                # Hooks React
├── lib/                  # Utilitários
├── public/              # Assets estáticos
├── styles/              # Estilos globais
└── types/               # Definições TypeScript
```

## Uso

1. Acesse http://localhost:3000
2. Configure seus agentes na página inicial
3. Gerencie mensagens na aba Messaging
4. Acompanhe pedidos e tickets na aba Marketplace

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## Contato

Mateus Segna - [@MateusBNB](https://twitter.com/MateusBNB)

Link do projeto: [https://github.com/mateussegna/agent-model](https://github.com/mateussegna/agent-model)