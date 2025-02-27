import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects`);
  if (!response.ok) {
    throw new Error('Falha ao buscar projetos');
  }
  return response.json();
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects/featured`);
  if (!response.ok) {
    throw new Error('Falha ao buscar projetos em destaque');
  }
  return response.json();
}

export async function getProject(id: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar projeto');
  }
  return response.json();
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao criar projeto');
  }
  return response.json();
}

export async function updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao atualizar projeto');
  }
  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao deletar projeto');
  }
}