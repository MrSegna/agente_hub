import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useConversations } from "@/hooks/use-conversations";
import { Conversation, TextMessage } from "@/types/messaging";

interface ConversationListProps {
  className?: string;
}

export function ConversationList({ className }: ConversationListProps) {
  const { conversations, selectedConversation, setSelectedConversation, isLoading } = useConversations();

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-sm text-muted-foreground">Carregando conversas...</span>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-sm text-muted-foreground">Nenhuma conversa encontrada</span>
      </div>
    );
  }

  const getLastMessageContent = (conversation: Conversation): string => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return "";

    switch (lastMessage.type) {
      case "text":
        return (lastMessage as TextMessage).content;
      case "image":
        return "[Imagem]";
      case "audio":
        return "[Áudio]";
      case "document":
        return "[Documento]";
      case "location":
        return "[Localização]";
      case "contact":
        return "[Contato]";
      default:
        return "[Mensagem]";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const isSelected = selectedConversation?.id === conversation.id;
        const customerInfo = conversation.metadata.customerInfo;
        const unread = false; // TODO: Implementar sistema de mensagens não lidas

        return (
          <Card
            key={conversation.id}
            className={`cursor-pointer transition-colors hover:bg-accent ${
              isSelected ? "border-primary bg-accent" : ""
            } ${unread ? "border-primary" : ""}`}
            onClick={() => setSelectedConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {customerInfo?.name || customerInfo?.phoneNumber || "Desconhecido"}
                  </span>
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    {getLastMessageContent(conversation)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">
                    {lastMessage &&
                      formatDistanceToNow(new Date(lastMessage.timestamp), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                  </span>
                  {unread && (
                    <Badge variant="default" className="h-5 w-5 justify-center rounded-full">
                      1
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}