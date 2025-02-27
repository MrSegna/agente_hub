import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';

const projectsRouter = Router();
const projectController = new ProjectController();

// Rotas específicas devem vir antes das rotas com parâmetros
projectsRouter.get('/featured', projectController.getFeatured.bind(projectController));
projectsRouter.get('/by-tech/:technology', projectController.getByTechnology.bind(projectController));

// CRUD básico
projectsRouter.get('/', projectController.index.bind(projectController));
projectsRouter.post('/', projectController.create.bind(projectController));
projectsRouter.get('/:id', projectController.show.bind(projectController));
projectsRouter.put('/:id', projectController.update.bind(projectController));
projectsRouter.delete('/:id', projectController.delete.bind(projectController));

export { projectsRouter };