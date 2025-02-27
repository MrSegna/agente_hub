import { ProjectList } from "@/components/apis/project-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/page-container";

export default function ProjectsPage() {
  return (
    <PageContainer
      title="Minhas APIs"
      description="Gerencie suas APIs e documentações"
      action={
        <Button asChild>
          <Link href="/apis/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova API
          </Link>
        </Button>
      }
    >
      <ProjectList />
    </PageContainer>
  );
}