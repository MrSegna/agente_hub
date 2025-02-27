"use client";

import React from 'react';
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/apis/projects";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { type CreateProjectInput } from "@/types/apis/project";

const formSchema = z.object({
  title: z.string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  description: z.string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  technologiesInput: z.string()
    .min(1, "Informe pelo menos uma tecnologia"),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  liveUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  githubUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function ProjectForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      technologiesInput: "",
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const projectData: CreateProjectInput = {
        title: data.title,
        description: data.description,
        technologies: data.technologiesInput.split(",").map(tech => tech.trim()).filter(Boolean),
        imageUrl: data.imageUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        githubUrl: data.githubUrl || undefined,
        featured: data.featured,
      };

      await createProject(projectData);
      
      toast({
        title: "API criada com sucesso!",
        description: "A API foi adicionada ao seu portfólio.",
      });
      
      router.push("/apis");
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro ao criar API",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Minha API REST" {...field} />
              </FormControl>
              <FormDescription>
                O nome da sua API
              </FormDescription>
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
                  placeholder="Uma API RESTful para..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Descreva o propósito e funcionalidades da sua API
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologiesInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tecnologias</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Node.js, TypeScript, Express..." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Lista de tecnologias separadas por vírgula
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do GitHub</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://github.com/user/repo" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Link para o repositório no GitHub
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="liveUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Documentação</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://api.example.com/docs" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Link para a documentação online da API
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Destaque
                </FormLabel>
                <FormDescription>
                  Marcar esta API como destaque no portfólio
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

        <Button type="submit" className="w-full">
          Criar API
        </Button>
      </form>
    </Form>
  );
}