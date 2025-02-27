"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Chart } from "@/components/ui/chart";

interface StatsPageProps {
  params: {
    id: string;
  };
}

interface AgentStats {
  messageHistory: {
    date: string;
    total: number;
    successful: number;
  }[];
  responseTimeHistory: {
    date: string;
    averageTime: number;
  }[];
  platformUsage: {
    platform: string;
    messages: number;
  }[];
  hourlyActivity: {
    hour: number;
    messages: number;
  }[];
}

const mockStats: AgentStats = {
  messageHistory: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    total: Math.floor(Math.random() * 100) + 50,
    successful: Math.floor(Math.random() * 80) + 20,
  })),
  responseTimeHistory: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    averageTime: Math.random() * 10 + 2,
  })),
  platformUsage: [
    { platform: "WhatsApp", messages: 1234 },
    { platform: "Marketplace", messages: 567 },
    { platform: "Sistema", messages: 89 },
  ],
  hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    messages: Math.floor(Math.random() * 50) + 10,
  })),
};

export default function AgentStatsPage({ params }: StatsPageProps) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Implementar integração com a API
        const response = await fetch(`/api/agents/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Falha ao carregar agente");
        }

        const data = await response.json();
        setAgent(data);
        setStats(mockStats); // Substituir por dados reais
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!agent || !stats) {
    return (
      <div className="container py-8">
        <p>Agente não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/agents/${agent.id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Estatísticas: {agent.name}
          </h1>
          <p className="text-muted-foreground">
            Análise detalhada do desempenho do agente
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Volume de Mensagens</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Chart
              options={{
                chart: {
                  type: "line",
                  toolbar: { show: false },
                },
                stroke: {
                  curve: "smooth",
                },
                xaxis: {
                  type: "datetime",
                  categories: stats.messageHistory.map((d) => d.date),
                },
                yaxis: {
                  title: {
                    text: "Mensagens",
                  },
                },
                legend: {
                  position: "top",
                },
              }}
              series={[
                {
                  name: "Total",
                  data: stats.messageHistory.map((d) => d.total),
                },
                {
                  name: "Sucesso",
                  data: stats.messageHistory.map((d) => d.successful),
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio de Resposta</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Chart
              options={{
                chart: {
                  type: "line",
                  toolbar: { show: false },
                },
                stroke: {
                  curve: "smooth",
                },
                xaxis: {
                  type: "datetime",
                  categories: stats.responseTimeHistory.map((d) => d.date),
                },
                yaxis: {
                  title: {
                    text: "Segundos",
                  },
                },
              }}
              series={[
                {
                  name: "Tempo Médio",
                  data: stats.responseTimeHistory.map((d) => d.averageTime),
                },
              ]}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Uso por Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Chart
                options={{
                  chart: {
                    type: "pie",
                  },
                  labels: stats.platformUsage.map((d) => d.platform),
                  legend: {
                    position: "bottom",
                  },
                }}
                series={stats.platformUsage.map((d) => d.messages)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade por Hora</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Chart
                options={{
                  chart: {
                    type: "bar",
                    toolbar: { show: false },
                  },
                  xaxis: {
                    categories: stats.hourlyActivity.map((d) => 
                      `${d.hour.toString().padStart(2, "0")}:00`
                    ),
                  },
                  yaxis: {
                    title: {
                      text: "Mensagens",
                    },
                  },
                }}
                series={[
                  {
                    name: "Mensagens",
                    data: stats.hourlyActivity.map((d) => d.messages),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}