import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/ProjectService';
import { CreateProjectDTO, UpdateProjectDTO } from '../types/entities';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await this.projectService.findAll();
      return res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const project = await this.projectService.findById(id);
      return res.json(project);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectData: CreateProjectDTO = req.body;
      const project = await this.projectService.create(projectData);
      return res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const projectData: UpdateProjectDTO = req.body;
      const project = await this.projectService.update(id, projectData);
      return res.json(project);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.projectService.delete(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getFeatured = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await this.projectService.getFeaturedProjects();
      return res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  getByTechnology = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { technology } = req.params;
      const projects = await this.projectService.getProjectsByTechnology(technology);
      return res.json(projects);
    } catch (error) {
      next(error);
    }
  };
}