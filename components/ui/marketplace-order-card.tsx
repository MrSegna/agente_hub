"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, DollarSign, MapPin } from "lucide-react"
import type { Order, OrderStatus } from "@/types/marketplace"

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "secondary" },
  confirmed: { label: "Confirmado", variant: "default" },
  shipped: { label: "Enviado", variant: "default" },
  delivered: { label: "Entregue", variant: "outline" },
  canceled: { label: "Cancelado", variant: "destructive" },
  returned: { label: "Devolvido", variant: "destructive" },
}

interface MarketplaceOrderCardProps {
  order: Order
  className?: string
  onClick?: () => void
}

const MarketplaceOrderCard = forwardRef<HTMLDivElement, MarketplaceOrderCardProps>(
  ({ order, className, onClick }, ref) => {
    const status = statusConfig[order.status]
    const formattedDate = new Date(order.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })

    return (
      <Card
        ref={ref}
        className={cn("cursor-pointer transition-shadow hover:shadow-md", className)}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Pedido #{order.orderNumber}</CardTitle>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{order.items.length} {order.items.length === 1 ? "item" : "itens"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {order.shipping.address.city}, {order.shipping.address.state}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

MarketplaceOrderCard.displayName = "MarketplaceOrderCard"

export { MarketplaceOrderCard }