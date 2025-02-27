import { Suspense } from 'react';
import { getProjects } from '@/lib/api';
import { ProjectCard } from './project-card';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertCircle } from 'lucide-react';

async function ProjectListContent() {
  try {
    const projects = await getProjects();

    if (projects.length === 0) {
      return (
        <Alert>
          <AlertTitle>Nenhum projeto encontrado</AlertTitle>
          <AlertDescription>
            Não há projetos cadastrados no momento.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Falha ao carregar os projetos. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }
}

export default function ProjectList() {
  return (
    <Suspense 
      fallback={
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-[300px] bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      }
    >
      <ProjectListContent />
    </Suspense>
  );
}