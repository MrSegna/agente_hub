"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Agent, AgentRole, AIModel, AgentPersonality, AgentConfig } from "@/types/agent";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const agentFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  role: z.enum(["CUSTOMER_SERVICE", "TASK_EXECUTOR", "PERSONAL_ASSISTANT", "TECH_SUPPORT", "PROJECT_MANAGER"]),
  model: z.enum(["gpt-4", "gpt-3.5-turbo"]),
  personality: z.object({
    tone: z.enum(["professional", "casual", "friendly", "technical"]),
    language: z.enum(["pt-BR", "en-US"]),
  }),
  systemPrompt: z.string().min(10, "Prompt do sistema deve ter pelo menos 10 caracteres"),
  capabilities: z.object({
    fileProcessing: z.boolean(),
    imageGeneration: z.boolean(),
    internetAccess: z.boolean(),
    codeExecution: z.boolean(),
    apiIntegration: z.object({
      whatsapp: z.boolean(),
      marketplace: z.boolean(),
      payment: z.boolean(),
    }),
  }),
  config: z.object({
    whatsapp: z.object({
      phoneNumber: z.string().optional(),
      apiKey: z.string().optional(),
      webhookUrl: z.string().optional(),
      isEnabled: z.boolean(),
    }).optional(),
    marketplace: z.object({
      platform: z.enum(["mercadolivre", "shopee"]).optional(),
      apiKey: z.string().optional(),
      sellerId: z.string().optional(),
      webhookUrl: z.string().optional(),
      isEnabled: z.boolean(),
    }).optional(),
  }),
});

type FormData = z.infer<typeof agentFormSchema>;

interface AgentFormProps {
  initialData?: Agent & { config?: AgentConfig };
  onSubmit: (data: FormData) => Promise<void>;
}

export function AgentForm({ initialData, onSubmit }: AgentFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      role: initialData?.role || "CUSTOMER_SERVICE",
      model: initialData?.model || "gpt-3.5-turbo",
      personality: initialData?.personality || {
        tone: "professional",
        language: "pt-BR",
      },
      systemPrompt: initialData?.systemPrompt || "",
      capabilities: initialData?.capabilities || {
        fileProcessing: false,
        imageGeneration: false,
        internetAccess: false,
        codeExecution: false,
        apiIntegration: {
          whatsapp: false,
          marketplace: false,
          payment: false,
        },
      },
      config: initialData?.config || {
        whatsapp: {
          isEnabled: false,
        },
        marketplace: {
          isEnabled: false,
        },
      },
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast({
        title: "Agente salvo com sucesso!",
        description: "As configurações foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar agente",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Assistente de Vendas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Agente especializado em atendimento ao cliente..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CUSTOMER_SERVICE">Atendimento</SelectItem>
                          <SelectItem value="TASK_EXECUTOR">Executor de Tarefas</SelectItem>
                          <SelectItem value="PERSONAL_ASSISTANT">Assistente Pessoal</SelectItem>
                          <SelectItem value="TECH_SUPPORT">Suporte Técnico</SelectItem>
                          <SelectItem value="PROJECT_MANAGER">Gerente de Projetos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um modelo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt do Sistema</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Você é um assistente especializado em..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Define a personalidade e comportamento base do agente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="capabilities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Capacidades do Agente</CardTitle>
                <CardDescription>
                  Configure as funcionalidades disponíveis para este agente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="capabilities.fileProcessing"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Processamento de Arquivos</FormLabel>
                        <FormDescription>
                          Permite que o agente processe documentos e arquivos
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capabilities.imageGeneration"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Geração de Imagens</FormLabel>
                        <FormDescription>
                          Permite que o agente gere e processe imagens
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capabilities.internetAccess"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Acesso à Internet</FormLabel>
                        <FormDescription>
                          Permite que o agente busque informações online
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capabilities.codeExecution"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Execução de Código</FormLabel>
                        <FormDescription>
                          Permite que o agente execute código em ambiente seguro
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp</CardTitle>
                <CardDescription>
                  Configure a integração com WhatsApp Business API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="config.whatsapp.isEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Ativar WhatsApp</FormLabel>
                        <FormDescription>
                          Habilita integração com WhatsApp
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("config.whatsapp.isEnabled") && (
                  <>
                    <FormField
                      control={form.control}
                      name="config.whatsapp.phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="+5511999999999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="config.whatsapp.apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave da API</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="config.whatsapp.webhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Webhook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>
                  Configure a integração com plataformas de marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="config.marketplace.isEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Ativar Marketplace</FormLabel>
                        <FormDescription>
                          Habilita integração com marketplace
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("config.marketplace.isEnabled") && (
                  <>
                    <FormField
                      control={form.control}
                      name="config.marketplace.platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plataforma</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma plataforma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                              <SelectItem value="shopee">Shopee</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="config.marketplace.apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave da API</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="config.marketplace.sellerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID do Vendedor</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="config.marketplace.webhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Webhook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Agente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}