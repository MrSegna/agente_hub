"use client"

import { forwardRef } from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import type { Message, MessagePlatform } from "@/types/messaging"

const platformIcons: Record<MessagePlatform, React.ReactNode> = {
  whatsapp: "💬",
  instagram: "📸",
  telegram: "📱",
}

const platformColors: Record<MessagePlatform, string> = {
  whatsapp: "bg-green-500",
  instagram: "bg-purple-500",
  telegram: "bg-blue-500",
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <div className={cn("h-full w-full rounded-full", platformColors[message.platform])} />
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <p className="text-sm">{message.content}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.status && (
            <Badge variant="outline" className="h-4 px-1 text-xs">
              {message.status}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export interface MessageListProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  messages: Message[]
  currentUserId: string
}

const MessageList = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  MessageListProps
>(({ messages, currentUserId, className, ...props }, ref) => {
  return (
    <ScrollArea className={cn("h-[600px] rounded-md border", className)} {...props}>
      <div className="flex flex-col gap-4 p-4">
        {messages.map((message: Message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.metadata.platformId === currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  )
})

MessageList.displayName = "MessageList"

export { MessageList }