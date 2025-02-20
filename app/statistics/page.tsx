"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, MessageSquare, Zap, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Dados de exemplo - substituir por dados reais da API
const usageData = [
  { date: "2024-02-01", tokens: 15000, cost: 0.45 },
  { date: "2024-02-02", tokens: 22000, cost: 0.66 },
  { date: "2024-02-03", tokens: 18000, cost: 0.54 },
  { date: "2024-02-04", tokens: 25000, cost: 0.75 },
  { date: "2024-02-05", tokens: 20000, cost: 0.6 },
]

const agentUsageData = [
  { name: "Atendimento", interactions: 150, tokens: 45000 },
  { name: "Suporte", interactions: 120, tokens: 36000 },
  { name: "Vendas", interactions: 80, tokens: 24000 },
]

export default function StatisticsPage() {
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-4")
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [telegramEnabled, setTelegramEnabled] = useState(false)
  const { toast } = useToast()

  const totalTokens = usageData.reduce((acc, day) => acc + day.tokens, 0)
  const totalCost = usageData.reduce((acc, day) => acc + day.cost, 0)
  const averageTokensPerDay = totalTokens / usageData.length

  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Estatísticas e Configurações</h1>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="usage">Uso da API</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Tokens</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {averageTokensPerDay.toLocaleString()} tokens/dia em média
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  ${(totalCost / usageData.length).toFixed(2)}/dia em média
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">3 em conversação agora</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interações Hoje</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">249</div>
                <p className="text-xs text-muted-foreground">+12% em relação a ontem</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Uso por Agente</CardTitle>
                <CardDescription>Distribuição de tokens por agente nos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* Aqui você pode adicionar um gráfico de barras */}
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Gráfico de Uso por Agente
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso Diário</CardTitle>
                <CardDescription>Consumo de tokens nos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* Aqui você pode adicionar um gráfico de linha */}
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Gráfico de Uso Diário
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento de Uso da API</CardTitle>
              <CardDescription>Informações detalhadas sobre o consumo da API OpenAI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <Label>Modelo Atual</Label>
                    <div className="text-2xl font-bold mt-1">GPT-4</div>
                    <p className="text-sm text-muted-foreground">$0.03/1K tokens</p>
                  </div>
                  <div>
                    <Label>Limite Mensal</Label>
                    <div className="text-2xl font-bold mt-1">$100.00</div>
                    <p className="text-sm text-muted-foreground">73% utilizado</p>
                  </div>
                  <div>
                    <Label>Média por Interação</Label>
                    <div className="text-2xl font-bold mt-1">320 tokens</div>
                    <p className="text-sm text-muted-foreground">$0.0096/interação</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status das Integrações</CardTitle>
              <CardDescription>Gerencie as integrações com serviços externos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>WhatsApp Business</Label>
                    <div className="text-sm text-muted-foreground">Integração com WhatsApp Business API</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={whatsappEnabled ? "default" : "secondary"}>
                      {whatsappEnabled ? "Online" : "Offline"}
                    </Badge>
                    <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Telegram</Label>
                    <div className="text-sm text-muted-foreground">Bot do Telegram para interações</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={telegramEnabled ? "default" : "secondary"}>
                      {telegramEnabled ? "Online" : "Offline"}
                    </Badge>
                    <Switch checked={telegramEnabled} onCheckedChange={setTelegramEnabled} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da API</CardTitle>
              <CardDescription>Gerencie suas configurações da API OpenAI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="api-key">Chave da API</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="model">Modelo Padrão</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Mais preciso)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais rápido)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Limites</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="token-limit" className="text-sm">
                        Limite de Tokens/mês
                      </Label>
                      <Input id="token-limit" type="number" placeholder="1000000" />
                    </div>
                    <div>
                      <Label htmlFor="cost-limit" className="text-sm">
                        Limite de Custo/mês ($)
                      </Label>
                      <Input id="cost-limit" type="number" placeholder="100" />
                    </div>
                  </div>
                </div>

                <Button onClick={saveSettings}>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}

