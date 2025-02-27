import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AgentIcon, ApiIcon, MarketIcon } from "@/components/icons/home";
import { PageContainer } from "@/components/page-container";

export default function HomePage() {
  return (
    <PageContainer
      title="Bem-vindo ao Agent Model"
      description="Sistema centralizado para gestão de agentes IA e integrações"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card Agentes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AgentIcon className="text-primary" />
              <CardTitle className="text-sm font-medium">Agentes IA</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Configure e gerencie seus agentes inteligentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild variant="default" size="sm" className="w-full">
                <Link href="/agents">
                  Acessar Agentes
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/agents/new">
                  Criar Novo Agente
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card APIs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ApiIcon className="text-primary" />
              <CardTitle className="text-sm font-medium">Integrações</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Gerencie APIs e conexões externas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild variant="default" size="sm" className="w-full">
                <Link href="/apis">
                  Ver Integrações
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/apis/new">
                  Nova Integração
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card Marketplace */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MarketIcon className="text-primary" />
              <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Acompanhe pedidos e tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="default" size="sm" className="w-full">
              <Link href="/marketplace">
                Ver Pedidos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status do Sistema */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/status">Ver Detalhes</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">API Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">Banco de Dados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">Integrações</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
