import { Topbar } from "@/components/layout/topbar";
import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="New Project" description="Add a portfolio project" />
      <main className="flex-1 p-6">
        <ProjectForm />
      </main>
    </div>
  );
}
