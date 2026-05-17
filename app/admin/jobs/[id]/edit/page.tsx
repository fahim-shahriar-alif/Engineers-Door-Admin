import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { mockJobs } from "@/lib/mock-data";
import { JobForm } from "../../job-form";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = mockJobs.find((j) => j.id === id);

  if (!job) notFound();

  const jobData = {
    ...job,
    createdAt: new Date(job.createdAt),
    updatedAt: new Date(job.updatedAt),
  };

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Edit Job" description={`Editing: ${job.title}`} />
      <main className="flex-1 p-6">
        <JobForm job={jobData as Parameters<typeof JobForm>[0]["job"]} />
      </main>
    </div>
  );
}
