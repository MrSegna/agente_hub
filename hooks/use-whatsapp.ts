import { useState, useEffect } from "react";

interface UseWhatsAppReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  testConnection: () => Promise<void>;
  sendMessage: (to: string, message: string) => Promise<void>;
}

export function useWhatsApp(): UseWhatsAppReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/whatsapp");
      const data = await response.json();

      setIsConnected(data.isConnected);
      
      if (!data.isConnected) {
        setError("Falha na conexão com WhatsApp");
      }
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : "Erro ao testar conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (to: string, message: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, message }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao enviar mensagem");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar mensagem");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    isConfigured,
    testConnection,
    sendMessage,
  };
}