import { Message, TextMessage } from "@/types/messaging";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useConversations } from "@/hooks/use-conversations";

interface MessageListProps {
  className?: string;
}

export function MessageList({ className }: MessageListProps) {
  const { selectedConversation } = useConversations();

  if (!selectedConversation) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Selecione uma conversa para ver as mensagens
        </span>
      </div>
    );
  }

  const getMessageContent = (message: Message): string => {
    switch (message.type) {
      case "text":
        return (message as TextMessage).content;
      case "image":
      case "audio":
      case "document":
        return "[Mídia]";
      case "location":
        return "[Localização]";
      case "contact":
        return `[Contato: ${(message as any).name}]`;
      case "order_update":
        return `[Atualização de Pedido: ${(message as any).orderStatus}]`;
      case "question":
        return `[Pergunta: ${(message as any).question}]`;
      case "system":
        return `[Sistema: ${(message as any).action}]`;
      default:
        return "[Mensagem não suportada]";
    }
  };

  if (selectedConversation.messages.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Nenhuma mensagem nesta conversa
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4 p-4", className)}>
      {selectedConversation.messages.map((message) => {
        const isAgent = message.fromId === selectedConversation.agentId;
        const content = getMessageContent(message);
        
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              isAgent ? "flex-row" : "flex-row-reverse"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={isAgent ? "/placeholder-logo.svg" : "/placeholder-user.jpg"}
                alt={isAgent ? "Agent" : "User"}
              />
              <AvatarFallback>
                {isAgent ? "A" : "U"}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                "flex max-w-[80%] flex-col gap-1 rounded-lg p-3",
                isAgent
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <p className="text-sm">{content}</p>
              <span className="text-xs opacity-70">
                {formatDistanceToNow(new Date(message.timestamp), {
                  addSuffix: true,
                  locale: ptBR,
                })}
                {message.status === "failed" && (
                  <span className="ml-2 text-destructive">⚠️ Falha no envio</span>
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}