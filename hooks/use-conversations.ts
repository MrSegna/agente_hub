import { useState, useEffect } from "react";
import { Conversation, TextMessage } from "@/types/messaging";

interface UseConversationsReturn {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
  refreshConversations: () => Promise<void>;
  createConversation: (participantId: string, message: string) => Promise<Conversation>;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/conversations");
      
      if (!response.ok) {
        throw new Error("Falha ao buscar conversas");
      }

      const data: Conversation[] = await response.json();
      setConversations(data);

      // Se houver uma conversa selecionada, atualize seus dados
      if (selectedConversation) {
        const updated = data.find((conv: Conversation) => conv.id === selectedConversation.id);
        if (updated) {
          setSelectedConversation(updated);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar conversas");
    } finally {
      setIsLoading(false);
    }
  };

  const createConversation = async (participantId: string, message: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participantId, message }),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar conversa");
      }

      const newConversation: Conversation = await response.json();
      setConversations(prev => [...prev, newConversation]);
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conversa");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar conversas ao montar o componente
  useEffect(() => {
    fetchConversations();
  }, []);

  // Atualizar conversas a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    conversations,
    selectedConversation,
    isLoading,
    error,
    setSelectedConversation,
    refreshConversations: fetchConversations,
    createConversation,
  };
}