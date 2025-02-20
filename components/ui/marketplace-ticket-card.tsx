"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, AlertCircle, Clock } from "lucide-react"
import type { Ticket, TicketStatus, TicketType, TicketPriority } from "@/types/marketplace"

const statusConfig: Record<TicketStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "Aberto", variant: "default" },
  pending: { label: "Pendente", variant: "secondary" },
  resolved: { label: "Resolvido", variant: "outline" },
}

const typeConfig: Record<TicketType, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  dispute: { label: "Disputa", variant: "destructive" },
  question: { label: "Dúvida", variant: "default" },
  complaint: { label: "Reclamação", variant: "secondary" },
}

const priorityConfig: Record<TicketPriority, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  low: { label: "Baixa", variant: "secondary" },
  medium: { label: "Média", variant: "default" },
  high: { label: "Alta", variant: "destructive" },
}

interface MarketplaceTicketCardProps {
  ticket: Ticket
  className?: string
  onClick?: () => void
}

const MarketplaceTicketCard = forwardRef<HTMLDivElement, MarketplaceTicketCardProps>(
  ({ ticket, className, onClick }, ref) => {
    const status = statusConfig[ticket.status]
    const type = typeConfig[ticket.type]
    const priority = priorityConfig[ticket.priority]
    const formattedDate = new Date(ticket.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

    const messageCount = ticket.messages.length

    return (
      <Card
        ref={ref}
        className={cn("cursor-pointer transition-shadow hover:shadow-md", className)}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
              <Badge variant={type.variant}>{type.label}</Badge>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {ticket.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                <Badge variant={priority.variant}>{priority.label}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{messageCount} {messageCount === 1 ? "mensagem" : "mensagens"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
            {ticket.assignedTo && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Atribuído para: </span>
                <span className="font-medium">{ticket.assignedTo.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

MarketplaceTicketCard.displayName = "MarketplaceTicketCard"

export { MarketplaceTicketCard }