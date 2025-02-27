import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="integrações" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrações">Integrações</TabsTrigger>
          <TabsTrigger value="notificações">Notificações</TabsTrigger>
          <TabsTrigger value="aparência">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="integrações" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Business</CardTitle>
              <CardDescription>
                Configure a integração com WhatsApp Business API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="waToken">Token de Acesso</Label>
                <Input id="waToken" placeholder="Insira o token do WhatsApp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waNumber">Número do WhatsApp</Label>
                <Input id="waNumber" placeholder="Ex: +5511999999999" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tiny ERP</CardTitle>
              <CardDescription>
                Configure a integração com Tiny ERP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tinyToken">Token de API</Label>
                <Input id="tinyToken" placeholder="Insira o token do Tiny ERP" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notificações">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como você deseja receber as notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email para Notificações</Label>
                <Input id="email" placeholder="seu@email.com" type="email" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="aparência">
          <Card>
            <CardHeader>
              <CardTitle>Tema</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Selecione o Tema</Label>
                <div className="flex space-x-2">
                  <Button variant="outline">Claro</Button>
                  <Button variant="outline">Escuro</Button>
                  <Button variant="outline">Sistema</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}