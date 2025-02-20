"use client"

import { forwardRef } from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import type { Conversation, MessagePlatform } from "@/types/messaging"

const platformColors: Record<MessagePlatform, string> = {
  whatsapp: "bg-green-500",
  instagram: "bg-purple-500",
  telegram: "bg-blue-500",
}

interface ConversationItemProps {
  conversation: Conversation
  isSelected?: boolean
  className?: string
  onClick?: () => void
}

const ConversationItem = forwardRef<HTMLDivElement, ConversationItemProps>(
  ({ conversation, isSelected, className, onClick }, ref) => {
    const formattedDate = new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    return (
      <div
        ref={ref}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent",
          isSelected && "bg-accent",
          className
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <Avatar className="h-12 w-12">
          <div className={cn("h-full w-full rounded-full", platformColors[conversation.platform])} />
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{conversation.customerName}</h4>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="truncate text-sm text-muted-foreground">
              {conversation.lastMessage.content}
            </p>
            {conversation.unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
          <div className="mt-1 flex gap-2">
            {conversation.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

ConversationItem.displayName = "ConversationItem"

interface BaseConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  onSelect?: (conversation: Conversation) => void
}

type ConversationListProps = BaseConversationListProps &
  Omit<React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>, keyof BaseConversationListProps>

const ConversationList = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ConversationListProps
>(({ conversations, selectedId, onSelect, className, ...props }, ref) => {
  return (
    <ScrollArea className={cn("h-[800px]", className)} {...props}>
      <div className="space-y-2 p-4">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedId === conversation.id}
            onClick={() => onSelect?.(conversation)}
          />
        ))}
      </div>
    </ScrollArea>
  )
})

ConversationList.displayName = "ConversationList"

export { ConversationList, ConversationItem }