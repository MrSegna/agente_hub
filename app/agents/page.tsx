import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageContainer } from "@/components/page-container";

// Esta é uma página do servidor que será hidratada no cliente
// Os dados reais virão do banco de dados
const mockAgents = [
  {
    id: "1",
    name: "Assistente de Vendas",
    description: "Atendimento a clientes e processamento de pedidos",
    role: "CUSTOMER_SERVICE" as const,
    model: "gpt-3.5-turbo" as const,
    isActive: true,
    capabilities: {
      fileProcessing: false,
      imageGeneration: false,
      internetAccess: true,
      codeExecution: false,
      apiIntegration: {
        whatsapp: true,
        marketplace: true,
        payment: false,
      },
    },
  },
  {
    id: "2",
    name: "Suporte Técnico",
    description: "Resolução de problemas e documentação",
    role: "TECH_SUPPORT" as const,
    model: "gpt-4" as const,
    isActive: true,
    capabilities: {
      fileProcessing: true,
      imageGeneration: false,
      internetAccess: true,
      codeExecution: true,
      apiIntegration: {
        whatsapp: true,
        marketplace: false,
        payment: false,
      },
    },
  },
];

function AgentCard({ agent }: { agent: typeof mockAgents[0] }) {
  return (
    <Card className="relative">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{agent.name}</CardTitle>
          <Badge variant={agent.isActive ? "default" : "secondary"}>
            {agent.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{agent.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{agent.model}</Badge>
          <Badge variant="outline">{agent.role}</Badge>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Integrações:</p>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.apiIntegration.whatsapp && (
              <Badge variant="secondary">WhatsApp</Badge>
            )}
            {agent.capabilities.apiIntegration.marketplace && (
              <Badge variant="secondary">Marketplace</Badge>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/agents/${agent.id}`}>Detalhes</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/agents/${agent.id}/edit`}>Editar</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/agents/${agent.id}/stats`}>Estatísticas</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AgentsPage() {
  return (
    <PageContainer 
      title="Meus Agentes"
      description="Gerencie seus agentes e suas integrações"
      action={
        <Button asChild>
          <Link href="/agents/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Link>
        </Button>
      }
    >
      {mockAgents.length === 0 ? (
        <Alert>
          <AlertTitle>Nenhum agente encontrado</AlertTitle>
          <AlertDescription>
            Você ainda não possui agentes cadastrados. Crie um novo agente para começar.
          </AlertDescription>
        </Alert>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </ScrollArea>
      )}
    </PageContainer>
  );
}