"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageList } from "@/components/ui/message-list"
import { ConversationList } from "@/components/ui/conversation-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SendHorizontal } from "lucide-react"
import type { Conversation, Message } from "@/types/messaging"

// Dados de exemplo - substituir pela integração real
const mockConversations: Conversation[] = [
  {
    id: "1",
    platform: "whatsapp",
    customerId: "customer1",
    customerName: "João Silva",
    lastMessage: {
      id: "msg1",
      conversationId: "1",
      platform: "whatsapp",
      type: "text",
      content: "Olá, preciso de ajuda com meu pedido",
      timestamp: new Date(),
      status: "read",
      metadata: {
        customerName: "João Silva",
        platformId: "customer1",
      },
    },
    unreadCount: 2,
    status: "active",
    tags: ["suporte", "pedido"],
  },
  {
    id: "2",
    platform: "instagram",
    customerId: "customer2",
    customerName: "Maria Santos",
    lastMessage: {
      id: "msg2",
      conversationId: "2",
      platform: "instagram",
      type: "text",
      content: "Quando vocês terão novos produtos?",
      timestamp: new Date(),
      status: "delivered",
      metadata: {
        customerName: "Maria Santos",
        platformId: "customer2",
      },
    },
    unreadCount: 0,
    status: "active",
    tags: ["vendas"],
  },
]

const mockMessages: Message[] = [
  {
    id: "msg1",
    conversationId: "1",
    platform: "whatsapp",
    type: "text",
    content: "Olá, preciso de ajuda com meu pedido",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
    status: "read",
    metadata: {
      customerName: "João Silva",
      platformId: "customer1",
    },
  },
  {
    id: "msg2",
    conversationId: "1",
    platform: "whatsapp",
    type: "text",
    content: "Claro! Em que posso ajudar?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutos atrás
    status: "read",
    metadata: {
      customerName: "Atendente",
      platformId: "agent1",
    },
  },
]

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return
    
    // Aqui implementar a lógica de envio real
    console.log("Enviando mensagem:", {
      conversationId: selectedConversation.id,
      content: newMessage,
    })
    
    setNewMessage("")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Central de Mensagens</h1>
        <p className="text-muted-foreground">Gerencie todas as conversas em um só lugar</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Lista de Conversas */}
        <div className="col-span-12 md:col-span-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversas</CardTitle>
                <Badge variant="secondary">
                  {mockConversations.filter(c => c.unreadCount > 0).length} não lidas
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="mb-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="unread">Não lidas</TabsTrigger>
                  <TabsTrigger value="assigned">Atribuídas</TabsTrigger>
                </TabsList>
              </Tabs>
              <ConversationList
                conversations={mockConversations}
                selectedId={selectedConversation?.id}
                onSelect={setSelectedConversation}
              />
            </CardContent>
          </Card>
        </div>

        {/* Área de Chat */}
        <div className="col-span-12 md:col-span-8">
          <Card className="h-full">
            {selectedConversation ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedConversation.customerName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        via {selectedConversation.platform}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {selectedConversation.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[600px] flex-col">
                    <MessageList
                      className="flex-1"
                      messages={mockMessages}
                      currentUserId="agent1"
                    />
                    <div className="mt-4 flex gap-2">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        <SendHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  Selecione uma conversa para começar
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}