export type MessageType = 
  | "text" 
  | "image" 
  | "audio" 
  | "document"
  | "location"
  | "contact"
  | "order_update"
  | "question"
  | "system";

export type MessageSource = 
  | "system" 
  | "user" 
  | "bot" 
  | "whatsapp" 
  | "marketplace";

export type MessageStatus = 
  | "pending"
  | "sent" 
  | "delivered" 
  | "read" 
  | "received" 
  | "failed";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Message {
  id: string;
  type: MessageType;
  source: MessageSource;
  timestamp: Date;
  status: MessageStatus;
  fromId: string;
  toId: string;
  agentId?: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface TextMessage extends Message {
  type: "text";
  content: string;
}

export interface MediaMessage extends Message {
  type: "image" | "audio" | "document";
  url: string;
  caption?: string;
}

export interface LocationMessage extends Message {
  type: "location";
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface ContactMessage extends Message {
  type: "contact";
  name: string;
  phoneNumber: string;
  email?: string;
}

export interface OrderMessage extends Message {
  type: "order_update";
  orderId: string;
  orderStatus: OrderStatus;
  details: any;
}

export interface QuestionMessage extends Message {
  type: "question";
  question: string;
  options?: string[];
}

export interface SystemMessage extends Message {
  type: "system";
  content: string;
  metadata?: any;
}

export interface ConversationMetadata {
  customerInfo?: {
    name?: string;
    phoneNumber?: string;
    email?: string;
  };
  platformData?: {
    platform: "whatsapp" | "marketplace";
    externalId?: string;
    [key: string]: any;
  };
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  status: "active" | "archived" | "deleted";
  createdAt: Date;
  updatedAt: Date;
  metadata?: ConversationMetadata;
  platform?: "whatsapp" | "marketplace";
}