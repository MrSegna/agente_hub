import { ProjectForm } from "@/components/apis/project-form";

export default function NewProjectPage() {
  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova API</h1>
        <p className="text-muted-foreground">
          Adicione uma nova API ao seu portfólio
        </p>
      </div>
      <div className="max-w-2xl">
        <ProjectForm />
      </div>
    </div>
  );
}