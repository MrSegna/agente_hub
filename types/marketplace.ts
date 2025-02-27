export type MarketplacePlatform = "mercadolivre" | "shopee";

export type OrderStatus = 
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type TicketStatus =
  | "open"
  | "pending"
  | "resolved";

export type TicketType =
  | "question"
  | "dispute"
  | "return"
  | "other";

export interface Ticket {
  id: string;
  orderId: string;
  type: TicketType;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  description: string;
  messages: TicketMessage[];
  assignedTo?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  content: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    type: "customer" | "agent" | "system";
  };
}

export type QuestionStatus =
  | "pending"
  | "answered"
  | "deleted";

export interface Product {
  id: string;
  platform: MarketplacePlatform;
  externalId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  variations?: ProductVariation[];
  categories: string[];
  specifications: Record<string, string>;
  status: "active" | "paused" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariation {
  id: string;
  productId: string;
  name: string;
  price?: number;
  stock: number;
  specifications: Record<string, string>;
}

export interface Order {
  id: string;
  platform: MarketplacePlatform;
  externalId: string;
  status: OrderStatus;
  buyer: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
  };
  items: OrderItem[];
  shipping: {
    address: Address;
    method: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDeliveryDate?: Date;
  };
  payment: {
    method: string;
    total: number;
    status: "pending" | "approved" | "rejected";
    installments?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  variationId?: string;
  quantity: number;
  price: number;
  title: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Question {
  id: string;
  platform: MarketplacePlatform;
  externalId: string;
  productId: string;
  buyerId: string;
  question: string;
  answer?: string;
  status: QuestionStatus;
  createdAt: Date;
  answeredAt?: Date;
}

export interface MarketplaceMetrics {
  platform: MarketplacePlatform;
  metrics: {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalQuestions: number;
    pendingQuestions: number;
    revenue: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  updatedAt: Date;
}