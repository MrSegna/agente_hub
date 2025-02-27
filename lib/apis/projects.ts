import { Project, CreateProjectInput, UpdateProjectInput } from "@/types/apis/project";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/api/projects`);
  
  if (!response.ok) {
    throw new Error("Falha ao carregar projetos");
  }
  
  return response.json();
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await fetch(`${API_URL}/api/projects/${id}`);
  
  if (!response.ok) {
    throw new Error("Projeto não encontrado");
  }
  
  return response.json();
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const response = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Falha ao criar projeto");
  }

  return response.json();
}

export async function updateProject(data: UpdateProjectInput): Promise<Project> {
  const response = await fetch(`${API_URL}/api/projects/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Falha ao atualizar projeto");
  }

  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Falha ao excluir projeto");
  }
}