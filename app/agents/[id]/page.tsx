"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Agent, AgentConfig } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Edit, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentDetailsPageProps {
  params: {
    id: string;
  };
}

interface AgentStats {
  messageCount: number;
  successRate: number;
  averageResponseTime: number;
  totalInteractions: number;
  lastInteraction: string;
  platformStats: {
    whatsapp: {
      messagesSent: number;
      messagesReceived: number;
      activeChats: number;
    };
    marketplace: {
      ordersProcessed: number;
      questionsAnswered: number;
      activeSales: number;
    };
  };
}

const mockStats: AgentStats = {
  messageCount: 1234,
  successRate: 95.5,
  averageResponseTime: 8.2,
  totalInteractions: 2500,
  lastInteraction: "2024-02-21T10:30:00Z",
  platformStats: {
    whatsapp: {
      messagesSent: 850,
      messagesReceived: 780,
      activeChats: 12,
    },
    marketplace: {
      ordersProcessed: 156,
      questionsAnswered: 423,
      activeSales: 45,
    },
  },
};

export default function AgentDetailsPage({ params }: AgentDetailsPageProps) {
  const [agent, setAgent] = useState<(Agent & { config?: AgentConfig }) | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        // TODO: Implementar integração com a API
        const response = await fetch(`/api/agents/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Falha ao carregar agente");
        }

        const data = await response.json();
        setAgent(data);
        setStats(mockStats); // Substituir por dados reais da API
      } catch (error) {
        console.error("Erro ao carregar dados do agente:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container py-8">
        <p>Agente não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agents">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
            <p className="text-muted-foreground">{agent.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/agents/${agent.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/agents/${agent.id}/stats`}>
              <BarChart2 className="h-4 w-4 mr-2" />
              Estatísticas
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Mensagens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.messageCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Sucesso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.successRate}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tempo Médio de Resposta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.averageResponseTime}s</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Interações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalInteractions}</div>
                </CardContent>
              </Card>
            </div>

            {agent.capabilities.apiIntegration.whatsapp && (
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Mensagens Enviadas</p>
                    <p className="text-2xl font-bold">
                      {stats?.platformStats.whatsapp.messagesSent}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mensagens Recebidas</p>
                    <p className="text-2xl font-bold">
                      {stats?.platformStats.whatsapp.messagesReceived}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Conversas Ativas</p>
                    <p className="text-2xl font-bold">
                      {stats?.platformStats.whatsapp.activeChats}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {agent.capabilities.apiIntegration.marketplace && (
              <Card>
                <CardHeader>
                  <CardTitle>Marketplace</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Pedidos Processados</p>
                    <p className="text-2xl font-bold">
                      {stats?.platformStats.marketplace.ordersProcessed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Perguntas Respondidas</p>
                    <p className="text-2xl font-bold">
                      {stats?.platformStats.marketplace.questionsAnswered}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vendas Ativas</p>
                    <p className="text-2xl font-bold">
                      {stats?.platformStats.marketplace.activeSales}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {/* TODO: Implementar gráficos e métricas detalhadas */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Agente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Modelo</p>
                  <Badge variant="outline">{agent.model}</Badge>
                </div>
                <div>
                  <p className="font-medium">Função</p>
                  <Badge variant="outline">{agent.role}</Badge>
                </div>
                <div>
                  <p className="font-medium">Capacidades</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {agent.capabilities.fileProcessing && (
                      <Badge variant="secondary">Processamento de Arquivos</Badge>
                    )}
                    {agent.capabilities.imageGeneration && (
                      <Badge variant="secondary">Geração de Imagens</Badge>
                    )}
                    {agent.capabilities.internetAccess && (
                      <Badge variant="secondary">Acesso à Internet</Badge>
                    )}
                    {agent.capabilities.codeExecution && (
                      <Badge variant="secondary">Execução de Código</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Integrações</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {agent.capabilities.apiIntegration.whatsapp && (
                      <Badge variant="secondary">WhatsApp</Badge>
                    )}
                    {agent.capabilities.apiIntegration.marketplace && (
                      <Badge variant="secondary">Marketplace</Badge>
                    )}
                    {agent.capabilities.apiIntegration.payment && (
                      <Badge variant="secondary">Pagamentos</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}