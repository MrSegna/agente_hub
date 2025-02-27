"use client";

import { Fragment, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";
import { 
  ApiIcon, 
  DatabaseIcon, 
  ChatIcon,
  TunnelIcon,
  CacheIcon,
  QueueIcon 
} from "@/components/icons";

interface StatusData {
  api: boolean;
  database: boolean;
  tiny: boolean;
  telegram: boolean;
  whatsapp: boolean;
  tunnel: boolean;
  cache: boolean;
  queue: boolean;
  timestamp: string;
}

type ServiceKey = keyof Omit<StatusData, 'timestamp'>;

interface ServiceConfig {
  name: string;
  description: string;
  status: boolean;
  key: ServiceKey;
}

const serviceIcons: Record<ServiceKey, React.ComponentType<{ className?: string }>> = {
  api: ApiIcon,
  database: DatabaseIcon,
  tiny: ApiIcon,
  telegram: ChatIcon,
  whatsapp: ChatIcon,
  tunnel: TunnelIcon,
  cache: CacheIcon,
  queue: QueueIcon
};

export default function StatusPage() {
  const [status, setStatus] = useState<StatusData>({
    api: false,
    database: false,
    tiny: false,
    telegram: false,
    whatsapp: false,
    tunnel: false,
    cache: true,
    queue: true,
    timestamp: new Date().toISOString()
  });
  const [isClient, setIsClient] = useState(false);

  const updateStatus = async () => {
    try {
      const response = await fetch('/api/status/test');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const toggleService = async (service: ServiceKey, checked: boolean) => {
    try {
      const response = await fetch('/api/status/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service, status: checked })
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    updateStatus();
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatusBadge = ({ isOnline }: { isOnline: boolean }): JSX.Element => (
    <Badge variant={isOnline ? "success" : "destructive"} className="h-5 text-[11px]">
      {isOnline ? "Online" : "Offline"}
    </Badge>
  );

  const GroupStatusBadge = ({ services }: { services: Record<string, boolean> }): JSX.Element => {
    const total = Object.values(services).length;
    const online = Object.values(services).filter(Boolean).length;
    
    let variant: "success" | "destructive" | "outline" = "outline";
    if (online === total) variant = "success";
    else if (online === 0) variant = "destructive";
    
    return (
      <Badge variant={variant} className="h-5 text-[11px]">
        {online}/{total} Online
      </Badge>
    );
  };

  const ServiceCard = ({ 
    title, 
    description, 
    services 
  }: { 
    title: string;
    description: string;
    services: ServiceConfig[];
  }): JSX.Element => (
    <Card className="border rounded-lg shadow-sm">
      <CardHeader className="space-y-1 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <GroupStatusBadge services={
            Object.fromEntries(services.map(s => [s.key, s.status]))
          } />
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.key];
            return (
              <div key={service.key}>
                {index > 0 && <Separator className="my-2" />}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium truncate">{service.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{service.description}</p>
                    </div>
                  </div>
                  <StatusBadge isOnline={service.status} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const controlServices = [
    { key: 'api' as ServiceKey, label: 'API' },
    { key: 'database' as ServiceKey, label: 'Banco de Dados' },
    { key: 'tiny' as ServiceKey, label: 'Tiny ERP' },
    { key: 'telegram' as ServiceKey, label: 'Telegram' },
    { key: 'whatsapp' as ServiceKey, label: 'WhatsApp' },
    { key: 'tunnel' as ServiceKey, label: 'Túnel' }
  ];

  return (
    <div className="h-full pb-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between py-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 truncate">
              Status do Sistema
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitoramento em tempo real dos serviços
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={updateStatus}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Painel de Controle */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Painel de Controle</CardTitle>
              <CardDescription className="text-xs">
                Gerencie o estado dos serviços
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {controlServices.map(({ key, label }) => {
                  const Icon = serviceIcons[key];
                  return (
                    <div 
                      key={key} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-xs font-medium">{label}</span>
                      </div>
                      <Switch 
                        checked={status[key]}
                        onCheckedChange={(checked) => toggleService(key, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Serviços Principais */}
          <ServiceCard
            title="Serviços Principais"
            description="Status dos serviços core do sistema"
            services={[
              {
                name: "Frontend (Next.js)",
                description: "Interface do usuário",
                status: true,
                key: "api"
              },
              {
                name: "API Backend",
                description: "Serviços da API",
                status: status.api,
                key: "api"
              },
              {
                name: "Banco de Dados",
                description: "PostgreSQL",
                status: status.database,
                key: "database"
              }
            ]}
          />

          {/* Integrações */}
          <ServiceCard
            title="Integrações"
            description="Status das integrações externas"
            services={[
              {
                name: "Tiny ERP",
                description: "Integração ERP",
                status: status.tiny,
                key: "tiny"
              },
              {
                name: "Telegram",
                description: "Bot de mensagens",
                status: status.telegram,
                key: "telegram"
              },
              {
                name: "WhatsApp",
                description: "API Business",
                status: status.whatsapp,
                key: "whatsapp"
              }
            ]}
          />

          {/* Recursos do Sistema */}
          <ServiceCard
            title="Recursos do Sistema"
            description="Status dos recursos auxiliares"
            services={[
              {
                name: "Túnel ngrok",
                description: "Acesso externo",
                status: status.tunnel,
                key: "tunnel"
              },
              {
                name: "Cache",
                description: "Sistema de cache",
                status: status.cache,
                key: "cache"
              },
              {
                name: "Filas",
                description: "Processamento assíncrono",
                status: status.queue,
                key: "queue"
              }
            ]}
          />

          {/* Última atualização */}
          {isClient && (
            <div className="text-xs text-gray-500 text-right">
              Última atualização: {new Date(status.timestamp).toLocaleString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
