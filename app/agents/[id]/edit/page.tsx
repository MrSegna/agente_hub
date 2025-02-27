"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AgentForm } from "@/components/agents/agent-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Agent, AgentConfig } from "@/types/agent";

interface EditAgentPageProps {
  params: {
    id: string;
  };
}

export default function EditAgentPage({ params }: EditAgentPageProps) {
  const router = useRouter();
  const [agent, setAgent] = useState<(Agent & { config?: AgentConfig }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        // TODO: Implementar integração com a API
        const response = await fetch(`/api/agents/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Falha ao carregar agente");
        }

        const data = await response.json();
        setAgent(data);
      } catch (error) {
        console.error("Erro ao carregar agente:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsUpdating(true);

      // TODO: Implementar integração com a API
      const response = await fetch(`/api/agents/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar agente");
      }

      router.push("/agents");
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar agente:", error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agents">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editando Agente</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agents">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agente não encontrado</h1>
            <p className="text-muted-foreground">
              O agente que você está tentando editar não existe.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agents">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editando {agent.name}
          </h1>
          <p className="text-muted-foreground">
            Atualize as configurações do seu agente
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <AgentForm initialData={agent} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}