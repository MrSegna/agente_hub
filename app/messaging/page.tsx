"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageList } from "@/components/ui/message-list";
import { ConversationList } from "@/components/ui/conversation-list";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { useConversations } from "@/hooks/use-conversations";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function MessagingPage() {
  const { isConnected, isConfigured, isLoading: whatsappLoading, error: whatsappError, testConnection, sendMessage } = useWhatsApp();
  const { selectedConversation, createConversation, refreshConversations } = useConversations();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleTestConnection = async () => {
    try {
      await testConnection();
      toast({
        title: isConnected ? "Conexão estabelecida" : "Falha na conexão",
        description: whatsappError || "Teste de conexão realizado com sucesso.",
        variant: isConnected ? "default" : "destructive",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao testar conexão com WhatsApp",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !messageText) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o número e a mensagem",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);

      // Se não houver conversa selecionada ou o número for diferente, criar nova conversa
      if (!selectedConversation || selectedConversation.participants[0] !== phoneNumber) {
        await createConversation(phoneNumber, messageText);
      }

      // Enviar mensagem pelo WhatsApp
      await sendMessage(phoneNumber, messageText);
      
      // Limpar campo de mensagem e atualizar conversas
      setMessageText("");
      await refreshConversations();

      toast({
        title: "Mensagem enviada",
        description: "A mensagem foi enviada com sucesso",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuração Necessária</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 p-4 text-center">
              <p className="text-lg font-medium">
                Por favor, configure sua integração com WhatsApp para prosseguir.
              </p>
              <p className="text-sm text-muted-foreground">
                Você precisa configurar suas credenciais do WhatsApp Business API no arquivo .env
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/settings">Configurar WhatsApp</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Voltar</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 md:grid-cols-12">
        {/* Status da Conexão */}
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>Status da Integração WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span>{isConnected ? "Conectado" : "Desconectado"}</span>
              </div>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={whatsappLoading}
              >
                {whatsappLoading ? "Testando..." : "Testar Conexão"}
              </Button>
            </div>
            {whatsappError && (
              <p className="mt-2 text-sm text-destructive">{whatsappError}</p>
            )}
          </CardContent>
        </Card>

        {/* Lista de Conversas */}
        <Card className="md:col-span-4 h-[600px] overflow-y-auto">
          <CardHeader>
            <CardTitle>Conversas</CardTitle>
          </CardHeader>
          <CardContent>
            <ConversationList />
          </CardContent>
        </Card>

        {/* Área de Mensagens */}
        <div className="flex flex-col gap-4 md:col-span-8">
          <Card className="flex-1 h-[450px] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {selectedConversation ? 
                  `Conversa com ${selectedConversation.metadata.customerInfo?.name || selectedConversation.participants[0]}` :
                  "Mensagens"
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MessageList />
            </CardContent>
          </Card>

          {/* Área de Envio */}
          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4" onSubmit={handleSendMessage}>
                <div className="flex gap-4">
                  <Input
                    type="tel"
                    placeholder="Número do WhatsApp"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="Mensagem"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSending || !isConnected || whatsappLoading}
                >
                  {isSending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}