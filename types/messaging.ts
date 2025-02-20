export type MessagePlatform = 'whatsapp' | 'instagram' | 'telegram'
export type MessageType = 'text' | 'image' | 'file'
export type MessageStatus = 'sent' | 'delivered' | 'read'
export type ConversationStatus = 'active' | 'archived'

export interface MessageAttachment {
  type: string
  url: string
}

export interface Message {
  id: string
  conversationId: string
  platform: MessagePlatform
  type: MessageType
  content: string
  timestamp: Date
  status: MessageStatus
  metadata: {
    customerName: string
    platformId: string
    attachments?: MessageAttachment[]
  }
}

export interface Conversation {
  id: string
  platform: MessagePlatform
  customerId: string
  customerName: string
  lastMessage: Message
  unreadCount: number
  status: ConversationStatus
  tags: string[]
  assignedAgentId?: string
}