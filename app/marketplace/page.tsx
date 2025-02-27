"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MarketplaceOrderCard } from "@/components/ui/marketplace-order-card"
import { MarketplaceTicketCard } from "@/components/ui/marketplace-ticket-card"
import { PageContainer } from "@/components/page-container"
import { getOrders, getTickets } from "@/lib/services/marketplace-service"
import type { Order, Ticket, OrderStatus, TicketStatus } from "@/types/marketplace"

export default function MarketplacePage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [ticketStatusFilter, setTicketStatusFilter] = useState<TicketStatus | "all">("all")

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersData, ticketsData] = await Promise.all([
          getOrders(),
          getTickets()
        ]);
        setOrders(ordersData)
        setTickets(ticketsData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.externalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = ticketStatusFilter === "all" || ticket.status === ticketStatusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <PageContainer 
      title="Marketplace"
      description="Gerencie seus pedidos e atendimentos"
    >
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
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="refunded">Devolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="orders" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="h-[200px] rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
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

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="h-[150px] rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
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
                    console.log("Visualizar ticket:", ticket.id)
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}