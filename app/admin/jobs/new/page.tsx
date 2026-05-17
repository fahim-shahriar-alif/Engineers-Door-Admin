import { Topbar } from "@/components/layout/topbar";
import { JobForm } from "../job-form";

export default function NewJobPage() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="New Job Listing" description="Post a new open position" />
      <main className="flex-1 p-6">
        <JobForm />
      </main>
    </div>
  );
}
