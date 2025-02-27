import { prisma } from '../config/prisma';
import { BaseService } from './BaseService';
import { 
  Project, 
  ProjectWithParsedTechnologies, 
  CreateProjectDTO, 
  UpdateProjectDTO 
} from '../types/entities';
import { ValidationError } from '../utils/AppError';

export class ProjectService extends BaseService<Project> {
  constructor() {
    super(prisma, 'project', 'Projeto');
  }

  protected transformOutput(project: Project): ProjectWithParsedTechnologies {
    return {
      ...project,
      technologies: JSON.parse(project.technologies) as string[]
    };
  }

  protected transformInput(data: CreateProjectDTO | UpdateProjectDTO): Partial<Project> {
    if (!data) return {};
    
    const transformed: Partial<Project> = { ...data };
    if (data.technologies) {
      transformed.technologies = JSON.stringify(data.technologies);
    }
    return transformed;
  }

  async getFeaturedProjects(): Promise<ProjectWithParsedTechnologies[]> {
    return this.findAll({ featured: true });
  }

  async getProjectsByTechnology(technology: string): Promise<ProjectWithParsedTechnologies[]> {
    const projects = await this.findAll();
    return projects.filter(project => 
      project.technologies.includes(technology.toLowerCase())
    );
  }

  private validateProject(data: Partial<CreateProjectDTO>, isUpdate = false): void {
    if (!isUpdate || data.title !== undefined) {
      if (!data.title || data.title.trim().length < 3) {
        throw new ValidationError('O título do projeto deve ter pelo menos 3 caracteres');
      }
    }

    if (!isUpdate || data.description !== undefined) {
      if (!data.description || data.description.trim().length < 10) {
        throw new ValidationError('A descrição do projeto deve ter pelo menos 10 caracteres');
      }
    }

    if (data.technologies !== undefined) {
      if (!Array.isArray(data.technologies) || data.technologies.length === 0) {
        throw new ValidationError('O projeto deve ter pelo menos uma tecnologia');
      }
    }

    if (data.githubUrl !== undefined) {
      const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
      if (data.githubUrl && !githubUrlPattern.test(data.githubUrl)) {
        throw new ValidationError('URL do GitHub inválida');
      }
    }

    if (data.liveUrl !== undefined) {
      const urlPattern = /^https?:\/\/.+\..+$/;
      if (data.liveUrl && !urlPattern.test(data.liveUrl)) {
        throw new ValidationError('URL do projeto inválida');
      }
    }
  }

  async create(data: CreateProjectDTO): Promise<ProjectWithParsedTechnologies> {
    this.validateProject(data);
    return super.create(data);
  }

  async update(id: string, data: UpdateProjectDTO): Promise<ProjectWithParsedTechnologies> {
    if (Object.keys(data).length > 0) {
      this.validateProject(data, true);
    }
    return super.update(id, data);
  }
}