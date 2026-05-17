import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { mockProjects } from "@/lib/mock-data";
import { ProjectForm } from "../../project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) notFound();

  const projectData = {
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  };

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Edit Project" description={`Editing: ${project.title}`} />
      <main className="flex-1 p-6">
        <ProjectForm project={projectData as Parameters<typeof ProjectForm>[0]["project"]} />
      </main>
    </div>
  );
}
