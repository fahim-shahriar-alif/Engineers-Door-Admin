import { Topbar } from "@/components/layout/topbar";
import { mockProjects } from "@/lib/mock-data";
import { PortfolioList } from "./portfolio-list";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Portfolio Projects" description="Manage your showcase projects" />
      <main className="flex-1 p-6">
        <PortfolioList initialProjects={mockProjects} />
      </main>
    </div>
  );
}
