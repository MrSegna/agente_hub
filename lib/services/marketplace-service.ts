import type { Order, Ticket } from "@/types/marketplace";

// Mock de pedidos
export const mockOrders: Order[] = [
  {
    id: "1",
    platform: "mercadolivre",
    externalId: "123456",
    status: "pending",
    buyer: {
      id: "cust1",
      name: "João Silva",
      email: "joao@example.com",
    },
    items: [
      {
        productId: "prod1",
        quantity: 1,
        price: 1299.99,
        title: "Smartphone XYZ",
      }
    ],
    shipping: {
      address: {
        street: "Rua Principal",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        country: "Brasil",
        zipCode: "01001-000",
      },
      method: "PAC",
    },
    payment: {
      method: "credit_card",
      total: 1299.99,
      status: "approved",
      installments: 3,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    platform: "mercadolivre",
    externalId: "123457",
    status: "shipped",
    buyer: {
      id: "cust2",
      name: "Maria Santos",
      email: "maria@example.com",
    },
    items: [
      {
        productId: "prod2",
        quantity: 1,
        price: 3499.99,
        title: "Notebook ABC",
      }
    ],
    shipping: {
      address: {
        street: "Av. Secundária",
        number: "456",
        neighborhood: "Jardins",
        city: "Rio de Janeiro",
        state: "RJ",
        country: "Brasil",
        zipCode: "20000-000",
      },
      method: "Sedex",
      trackingNumber: "BR123456789",
    },
    payment: {
      method: "credit_card",
      total: 3499.99,
      status: "approved",
      installments: 6,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(),
  },
];

// Mock de tickets
export const mockTickets: Ticket[] = [
  {
    id: "1",
    orderId: "1",
    type: "question",
    status: "open",
    priority: "medium",
    description: "Cliente com dúvida sobre prazo de entrega",
    messages: [
      {
        id: "msg1",
        ticketId: "1",
        content: "Qual o prazo de entrega do pedido?",
        createdAt: new Date(),
        createdBy: {
          id: "cust1",
          name: "João Silva",
          type: "customer",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    orderId: "2",
    type: "dispute",
    status: "pending",
    priority: "high",
    description: "Produto recebido com defeito",
    messages: [
      {
        id: "msg2",
        ticketId: "2",
        content: "O produto chegou com a tela quebrada",
        createdAt: new Date(),
        createdBy: {
          id: "cust2",
          name: "Maria Santos",
          type: "customer",
        },
      },
    ],
    assignedTo: {
      id: "agent1",
      name: "Carlos Suporte",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(),
  },
];

export async function getOrders(): Promise<Order[]> {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockOrders;
}

export async function getTickets(): Promise<Ticket[]> {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockTickets;
}