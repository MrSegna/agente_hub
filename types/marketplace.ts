export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'returned'

export type TicketType = 'dispute' | 'question' | 'complaint'
export type TicketStatus = 'open' | 'pending' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface ShippingInfo {
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  tracking?: {
    code: string
    carrier: string
    status: string
    updatedAt: Date
  }
  estimatedDelivery?: Date
}

export interface PaymentInfo {
  method: string
  status: 'pending' | 'approved' | 'rejected'
  installments?: number
  total: number
  paidAt?: Date
}

export interface Order {
  id: string
  platform: 'olist'
  orderNumber: string
  customer: {
    name: string
    email: string
    id: string
  }
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: Date
  updatedAt: Date
  shipping: ShippingInfo
  payment: PaymentInfo
}

export interface TicketMessage {
  id: string
  ticketId: string
  content: string
  createdAt: Date
  createdBy: {
    id: string
    name: string
    type: 'customer' | 'agent' | 'system'
  }
  attachments?: Array<{
    type: string
    url: string
  }>
}

export interface Ticket {
  id: string
  orderId: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  description: string
  createdAt: Date
  updatedAt: Date
  messages: TicketMessage[]
  assignedTo?: {
    id: string
    name: string
  }
}