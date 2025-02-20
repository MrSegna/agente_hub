"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MarketplaceOrderCard } from "@/components/ui/marketplace-order-card"
import { MarketplaceTicketCard } from "@/components/ui/marketplace-ticket-card"
import type { Order, Ticket, OrderStatus, TicketStatus } from "@/types/marketplace"

// Dados de exemplo - substituir pela integração real com TinyERP
const mockOrders: Order[] = [
  {
    id: "1",
    platform: "olist",
    orderNumber: "123456",
    customer: {
      name: "João Silva",
      email: "joao@example.com",
      id: "cust1",
    },
    status: "confirmed",
    items: [
      {
        id: "item1",
        productId: "prod1",
        productName: "Smartphone XYZ",
        quantity: 1,
        price: 1299.99,
        total: 1299.99,
      },
    ],
    total: 1299.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    shipping: {
      address: {
        street: "Rua Principal",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01001-000",
      },
    },
    payment: {
      method: "credit_card",
      status: "approved",
      installments: 3,
      total: 1299.99,
      paidAt: new Date(),
    },
  },
  {
    id: "2",
    platform: "olist",
    orderNumber: "123457",
    customer: {
      name: "Maria Santos",
      email: "maria@example.com",
      id: "cust2",
    },
    status: "shipped",
    items: [
      {
        id: "item2",
        productId: "prod2",
        productName: "Notebook ABC",
        quantity: 1,
        price: 3499.99,
        total: 3499.99,
      },
    ],
    total: 3499.99,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    updatedAt: new Date(),
    shipping: {
      address: {
        street: "Av. Secundária",
        number: "456",
        neighborhood: "Jardins",
        city: "Rio de Janeiro",
        state: "RJ",
        zipCode: "20000-000",
      },
    },
    payment: {
      method: "credit_card",
      status: "approved",
      installments: 6,
      total: 3499.99,
      paidAt: new Date(),
    },
  },
]

const mockTickets: Ticket[] = [
  {
    id: "1",
    orderId: "1",
    type: "question",
    status: "open",
    priority: "medium",
    description: "Cliente com dúvida sobre prazo de entrega",
    createdAt: new Date(),
    updatedAt: new Date(),
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
  },
  {
    id: "2",
    orderId: "2",
    type: "dispute",
    status: "pending",
    priority: "high",
    description: "Produto recebido com defeito",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    updatedAt: new Date(),
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
  },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [ticketStatusFilter, setTicketStatusFilter] = useState<TicketStatus | "all">("all")

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = ticketStatusFilter === "all" || ticket.status === ticketStatusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Gerencie seus pedidos e atendimentos do Olist</p>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
              <SelectItem value="returned">Devolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="orders" className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.map((order) => (
                <MarketplaceOrderCard
                  key={order.id}
                  order={order}
                  onClick={() => {
                    // Implementar visualização detalhada do pedido
                    console.log("Visualizar pedido:", order.id)
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Select
            value={ticketStatusFilter}
            onValueChange={(value) => setTicketStatusFilter(value as TicketStatus | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status do Ticket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
            </SelectContent>
          </Select>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum ticket encontrado</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTickets.map((ticket) => (
                <MarketplaceTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => {
                    // Implementar visualização detalhada do ticket
                    console.log("Visualizar ticket:", ticket.id)
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}