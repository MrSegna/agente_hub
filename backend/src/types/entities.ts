// Tipos base
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos do Projeto
export interface Project extends BaseEntity {
  title: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string; // Armazenado como string JSON no banco
  featured: boolean;
}

export interface ProjectWithParsedTechnologies extends Omit<Project, 'technologies'> {
  technologies: string[]; // Array após parse do JSON
}

export type CreateProjectDTO = Omit<ProjectWithParsedTechnologies, keyof BaseEntity>;

export type UpdateProjectDTO = Partial<CreateProjectDTO>;

// Outros tipos podem ser adicionados aqui conforme necessário