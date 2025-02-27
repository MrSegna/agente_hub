"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgentForm } from "@/components/agents/agent-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsCreating(true);
      
      // TODO: Implementar integração com a API
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar agente");
      }

      router.push("/agents");
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar agente:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agents">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Agente</h1>
          <p className="text-muted-foreground">
            Configure um novo agente para sua equipe
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <AgentForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}