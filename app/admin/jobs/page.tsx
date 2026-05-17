import { Topbar } from "@/components/layout/topbar";
import { mockJobs } from "@/lib/mock-data";
import { JobsList } from "./jobs-list";

export const dynamic = "force-dynamic";

export default function JobsPage() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Job Listings" description="Manage open positions" />
      <main className="flex-1 p-6">
        <JobsList initialJobs={mockJobs} />
      </main>
    </div>
  );
}
