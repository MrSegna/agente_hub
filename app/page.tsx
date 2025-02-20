"use client"

import { useState, useEffect } from "react"
import { Plus, MoreVertical, Trash, Edit, Power, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { Agent, AgentRole, AIModel, AgentPersonality, AgentCapabilities } from "@/types/agent"

const DEFAULT_SYSTEM_PROMPTS: Record<AgentRole, string> = {
  customer_service:
    "Você é um assistente de atendimento ao cliente profissional e empático. Seu objetivo é ajudar os clientes com suas dúvidas e problemas de forma eficiente e amigável.",
  task_execution:
    "Você é um assistente especializado em execução de tarefas. Seu objetivo é ajudar a completar tarefas de forma eficiente e precisa, seguindo as instruções fornecidas.",
  personal_assistant:
    "Você é um assistente pessoal atencioso e proativo. Seu objetivo é ajudar com organização, lembretes e tarefas diárias para tornar o dia a dia mais produtivo.",
  technical_support:
    "Você é um especialista em suporte técnico. Seu objetivo é ajudar a resolver problemas técnicos de forma clara e eficiente, fornecendo soluções passo a passo.",
  project_manager:
    "Você é um gerente de projetos experiente. Seu objetivo é ajudar a planejar, organizar e acompanhar projetos, garantindo que as metas sejam alcançadas no prazo.",
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    role: "customer_service" as AgentRole,
    model: "gpt-4" as AIModel,
    personality: {
      tone: "professional" as AgentPersonality["tone"],
      language: "pt-BR" as AgentPersonality["language"],
    },
    capabilities: {
      canProcessFiles: false,
      canGenerateImages: false,
      canAccessInternet: false,
      canExecuteCode: false,
    } as AgentCapabilities,
    systemPrompt: DEFAULT_SYSTEM_PROMPTS.customer_service,
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null)

  useEffect(() => {
    const savedAgents = localStorage.getItem("agents")
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("agents", JSON.stringify(agents))
  }, [agents])

  const createOrUpdateAgent = () => {
    if (newAgent.name.trim() === "") {
      toast({
        title: "Erro",
        description: "O nome do agente é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (editingAgent) {
      setAgents(
        agents.map((agent) =>
          agent.id === editingAgent.id
            ? {
                ...editingAgent,
                ...newAgent,
                updatedAt: new Date(),
              }
            : agent,
        ),
      )
      toast({
        title: "Sucesso",
        description: "Agente atualizado com sucesso",
      })
      setEditingAgent(null)
    } else {
      const agent: Agent = {
        id: Math.random().toString(36).substring(7),
        ...newAgent,
        isActive: true,
        createdAt: new Date(),
        tasks: [],
      }

      setAgents((prevAgents) => [...prevAgents, agent])
      toast({
        title: "Sucesso",
        description: "Agente criado com sucesso",
      })
    }

    setNewAgent({
      name: "",
      description: "",
      role: "customer_service",
      model: "gpt-4",
      personality: {
        tone: "professional",
        language: "pt-BR",
      },
      capabilities: {
        canProcessFiles: false,
        canGenerateImages: false,
        canAccessInternet: false,
        canExecuteCode: false,
      },
      systemPrompt: DEFAULT_SYSTEM_PROMPTS.customer_service,
    })
    setIsDialogOpen(false)
  }

  const startEditingAgent = (agent: Agent) => {
    setEditingAgent(agent)
    setNewAgent({
      name: agent.name,
      description: agent.description,
      role: agent.role,
      model: agent.model,
      personality: agent.personality,
      capabilities: agent.capabilities,
      systemPrompt: agent.systemPrompt,
    })
    setIsDialogOpen(true)
  }

  const deleteAgent = (agentId: string) => {
    setAgents(agents.filter((agent) => agent.id !== agentId))
    toast({
      title: "Sucesso",
      description: "Agente excluído com sucesso",
    })
  }

  const toggleAgentStatus = (agentId: string) => {
    setAgents(agents.map((agent) => (agent.id === agentId ? { ...agent, isActive: !agent.isActive } : agent)))
    toast({
      description: `Agente ${agents.find((a) => a.id === agentId)?.isActive ? "desativado" : "ativado"} com sucesso`,
    })
  }

  const handleRoleChange = (role: AgentRole) => {
    setNewAgent({
      ...newAgent,
      role,
      systemPrompt: DEFAULT_SYSTEM_PROMPTS[role],
    })
  }

  const handleDeleteClick = (agentId: string) => {
    setAgentToDelete(agentId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (agentToDelete) {
      deleteAgent(agentToDelete)
      setDeleteDialogOpen(false)
      setAgentToDelete(null)
    }
  }

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciador de Agentes IA</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingAgent(null)
                setNewAgent({
                  name: "",
                  description: "",
                  role: "customer_service",
                  model: "gpt-4",
                  personality: {
                    tone: "professional",
                    language: "pt-BR",
                  },
                  capabilities: {
                    canProcessFiles: false,
                    canGenerateImages: false,
                    canAccessInternet: false,
                    canExecuteCode: false,
                  },
                  systemPrompt: DEFAULT_SYSTEM_PROMPTS.customer_service,
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Agente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAgent ? "Editar Agente" : "Criar Novo Agente"}</DialogTitle>
              <DialogDescription>Configure as características e capacidades do seu agente de IA</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Agente</Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="Ex: Assistente de Vendas"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  placeholder="Descreva a função principal do agente"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Função Principal</Label>
                <Select value={newAgent.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_service">Atendimento ao Cliente</SelectItem>
                    <SelectItem value="task_execution">Execução de Tarefas</SelectItem>
                    <SelectItem value="personal_assistant">Assistente Pessoal</SelectItem>
                    <SelectItem value="technical_support">Suporte Técnico</SelectItem>
                    <SelectItem value="project_manager">Gerente de Projetos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Modelo de IA</Label>
                <Select
                  value={newAgent.model}
                  onValueChange={(value: AIModel) => setNewAgent({ ...newAgent, model: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 (Mais avançado)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais rápido)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Personalidade</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tone" className="text-sm">
                      Tom de Comunicação
                    </Label>
                    <Select
                      value={newAgent.personality.tone}
                      onValueChange={(value: AgentPersonality["tone"]) =>
                        setNewAgent({
                          ...newAgent,
                          personality: { ...newAgent.personality, tone: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tom" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Amigável</SelectItem>
                        <SelectItem value="technical">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language" className="text-sm">
                      Idioma Principal
                    </Label>
                    <Select
                      value={newAgent.personality.language}
                      onValueChange={(value: AgentPersonality["language"]) =>
                        setNewAgent({
                          ...newAgent,
                          personality: { ...newAgent.personality, language: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (BR)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Capacidades</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="process-files"
                      checked={newAgent.capabilities.canProcessFiles}
                      onCheckedChange={(checked) =>
                        setNewAgent({
                          ...newAgent,
                          capabilities: { ...newAgent.capabilities, canProcessFiles: checked },
                        })
                      }
                    />
                    <Label htmlFor="process-files">Processar Arquivos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="generate-images"
                      checked={newAgent.capabilities.canGenerateImages}
                      onCheckedChange={(checked) =>
                        setNewAgent({
                          ...newAgent,
                          capabilities: { ...newAgent.capabilities, canGenerateImages: checked },
                        })
                      }
                    />
                    <Label htmlFor="generate-images">Gerar Imagens</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="access-internet"
                      checked={newAgent.capabilities.canAccessInternet}
                      onCheckedChange={(checked) =>
                        setNewAgent({
                          ...newAgent,
                          capabilities: { ...newAgent.capabilities, canAccessInternet: checked },
                        })
                      }
                    />
                    <Label htmlFor="access-internet">Acessar Internet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="execute-code"
                      checked={newAgent.capabilities.canExecuteCode}
                      onCheckedChange={(checked) =>
                        setNewAgent({
                          ...newAgent,
                          capabilities: { ...newAgent.capabilities, canExecuteCode: checked },
                        })
                      }
                    />
                    <Label htmlFor="execute-code">Executar Código</Label>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="system-prompt">Prompt do Sistema</Label>
                <Textarea
                  id="system-prompt"
                  value={newAgent.systemPrompt}
                  onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                  placeholder="Instruções específicas para o comportamento do agente"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createOrUpdateAgent}>{editingAgent ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {agents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum agente cadastrado. Clique em "Novo Agente" para começar.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className={`flex flex-col ${!agent.isActive ? "opacity-75" : ""}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {agent.name}
                    <Badge variant={agent.isActive ? "default" : "secondary"}>
                      {agent.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{getRoleName(agent.role)}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEditingAgent(agent)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleAgentStatus(agent.id)}>
                      <Power className="w-4 h-4 mr-2" />
                      {agent.isActive ? "Desativar" : "Ativar"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(agent.id)}>
                      <Trash className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Modelo:</span>
                    <p>{agent.model}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tom:</span>
                    <p>{getPersonalityToneName(agent.personality.tone)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-muted-foreground">Capacidades:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.capabilities.canProcessFiles && <Badge variant="outline">Processar Arquivos</Badge>}
                    {agent.capabilities.canGenerateImages && <Badge variant="outline">Gerar Imagens</Badge>}
                    {agent.capabilities.canAccessInternet && <Badge variant="outline">Acessar Internet</Badge>}
                    {agent.capabilities.canExecuteCode && <Badge variant="outline">Executar Código</Badge>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="secondary" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Conversar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <DeleteAgentDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      <Toaster />
    </div>
  )
}

function getRoleName(role: AgentRole): string {
  const roleNames = {
    customer_service: "Atendimento ao Cliente",
    task_execution: "Execução de Tarefas",
    personal_assistant: "Assistente Pessoal",
    technical_support: "Suporte Técnico",
    project_manager: "Gerente de Projetos",
  }
  return roleNames[role]
}

function getPersonalityToneName(tone: AgentPersonality["tone"]): string {
  const toneNames = {
    professional: "Profissional",
    casual: "Casual",
    friendly: "Amigável",
    technical: "Técnico",
  }
  return toneNames[tone]
}

interface DeleteAgentDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

function DeleteAgentDialog({ isOpen, onClose, onConfirm }: DeleteAgentDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir este agente? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

