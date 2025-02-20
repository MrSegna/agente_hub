# Plano de Implementação: Messaging e Marketplace

## 1. Visão Geral

Este documento detalha o plano de implementação para duas novas funcionalidades principais:
- Sistema unificado de mensagens (Messaging)
- Integração com marketplace Olist via TinyERP (Marketplace)

## 2. Interface do Usuário

### 2.1 Componentes Compartilhados
```typescript
// Novos componentes a serem adicionados em /components/ui/
- MessageList
- ConversationView
- ChannelBadge
- StatusIndicator
- MarketplaceCard
- OrderStatus
- MetricsDisplay
```

### 2.2 Tab Messaging

#### Layout Principal
```tsx
<Tabs defaultValue="inbox">
  <TabsList>
    <TabsTrigger value="inbox">Caixa de Entrada</TabsTrigger>
    <TabsTrigger value="archived">Arquivadas</TabsTrigger>
    <TabsTrigger value="settings">Configurações</TabsTrigger>
  </TabsList>
  
  <TabsContent value="inbox">
    <div className="grid grid-cols-12 gap-4">
      {/* Lista de Conversas (4 colunas) */}
      <div className="col-span-4">
        <ConversationsList />
      </div>
      
      {/* Visualização de Mensagens (8 colunas) */}
      <div className="col-span-8">
        <MessageViewer />
      </div>
    </div>
  </TabsContent>
</Tabs>
```

#### Estados de Interface
- Loading: Skeleton loaders para listas e cards
- Empty: Mensagens amigáveis para listas vazias
- Error: Tratamento visual de erros com opção de retry
- Dark/Light: Suporte aos temas existentes

### 2.3 Tab Marketplace

#### Layout Principal
```tsx
<Tabs defaultValue="orders">
  <TabsList>
    <TabsTrigger value="orders">Pedidos</TabsTrigger>
    <TabsTrigger value="tickets">Tickets</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  
  <TabsContent value="orders">
    <div className="space-y-4">
      {/* Filtros e Busca */}
      <MarketplaceFilters />
      
      {/* Grid de Pedidos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OrderCards />
      </div>
      
      {/* Paginação */}
      <Pagination />
    </div>
  </TabsContent>
</Tabs>
```

## 3. Modelos de Dados

### 3.1 Messaging
```typescript
interface Message {
  id: string;
  conversationId: string;
  platform: 'whatsapp' | 'instagram' | 'telegram';
  type: 'text' | 'image' | 'file';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  metadata: {
    customerName: string;
    platformId: string;
    attachments?: Array<{
      type: string;
      url: string;
    }>;
  };
}

interface Conversation {
  id: string;
  platform: string;
  customerId: string;
  customerName: string;
  lastMessage: Message;
  unreadCount: number;
  status: 'active' | 'archived';
  tags: string[];
  assignedAgentId?: string;
}
```

### 3.2 Marketplace
```typescript
interface Order {
  id: string;
  platform: 'olist';
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    id: string;
  };
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  shipping: ShippingInfo;
  payment: PaymentInfo;
}

interface Ticket {
  id: string;
  orderId: string;
  type: 'dispute' | 'question' | 'complaint';
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  description: string;
  createdAt: Date;
  updatedAt: Date;
  messages: TicketMessage[];
}
```

## 4. Integrações de API

### 4.1 WhatsApp Business API
```typescript
interface WhatsAppConfig {
  apiVersion: '2.0';
  baseUrl: 'https://graph.facebook.com/v2.0';
  webhookUrl: string;
  verifyToken: string;
}

// Endpoints principais
- POST /messages - Enviar mensagem
- GET /messages - Recuperar histórico
- POST /webhook - Receber atualizações
```

### 4.2 TinyERP API
```typescript
interface TinyERPConfig {
  baseUrl: string;
  apiToken: string;
  refreshToken: string;
}

// Endpoints principais
- GET /orders - Listar pedidos
- GET /orders/{id} - Detalhes do pedido
- GET /tickets - Listar tickets
- PUT /tickets/{id} - Atualizar ticket
```

## 5. Segurança

### 5.1 Autenticação
- Implementar JWT para autenticação de API
- Armazenar tokens de forma segura
- Rotação automática de tokens
- Rate limiting por usuário/IP

### 5.2 Dados Sensíveis
- Criptografar dados em repouso
- Mascarar informações sensíveis na UI
- Implementar logs de auditoria
- Sanitizar inputs do usuário

## 6. Estratégia de Testes

### 6.1 Testes Unitários
```typescript
// Exemplo de teste de componente
describe('MessageList', () => {
  it('should render messages in correct order', () => {});
  it('should display correct status indicators', () => {});
  it('should handle empty state', () => {});
});
```

### 6.2 Testes de Integração
- Mocks para APIs externas
- Testes de fluxo completo
- Cenários de erro e retry
- Testes de performance

## 7. Infraestrutura

### 7.1 Requisitos
- Cache Redis para mensagens
- Queue system para processamento assíncrono
- CDN para assets
- Elastic Search para busca

### 7.2 Monitoramento
- Métricas de performance
- Alertas de erro
- Dashboards de uso
- Rastreamento de requisições

## 8. Fases de Implementação

### Fase 1: Interface Visual (2 semanas)
1. Implementar layouts responsivos
2. Criar componentes reutilizáveis
3. Implementar estados de loading/erro
4. Adicionar suporte a temas

### Fase 2: Integrações (3 semanas)
1. Configurar clientes de API
2. Implementar webhooks
3. Configurar autenticação
4. Desenvolver cache layer

### Fase 3: Backend (4 semanas)
1. Criar modelos de dados
2. Implementar APIs
3. Configurar queues
4. Implementar busca

### Fase 4: Testes e Otimização (2 semanas)
1. Escrever testes
2. Otimizar performance
3. Configurar monitoramento
4. Documentação final

## 9. Metas de Performance

### 9.1 Métricas Alvo
- Tempo de carregamento inicial: < 2s
- Time to Interactive: < 3s
- First Input Delay: < 100ms
- Layout Shift: < 0.1
- Cache Hit Rate: > 90%

### 9.2 Objetivos de Negócio
- Redução de 50% no tempo de resposta
- Aumento de 30% na satisfação do cliente
- Redução de 40% em tickets reabertos
- Taxa de erro < 0.1%

## 10. Plano de Monitoramento

### 10.1 Métricas Técnicas
- Latência de API
- Taxa de erro
- Uso de recursos
- Performance de queries

### 10.2 Métricas de Negócio
- Tempo médio de resposta
- Taxa de resolução
- Satisfação do cliente
- Volume de conversas

## 11. Considerações de Escalabilidade

### 11.1 Backend
- Sharding de banco de dados
- Cache distribuído
- Load balancing
- Auto-scaling

### 11.2 Frontend
- Code splitting
- Lazy loading
- Service Workers
- PWA features