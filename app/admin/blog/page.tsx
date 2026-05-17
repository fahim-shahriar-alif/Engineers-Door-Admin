import { Topbar } from "@/components/layout/topbar";
import { mockPosts } from "@/lib/mock-data";
import { BlogList } from "./blog-list";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Blog Posts" description="Manage your blog content" />
      <main className="flex-1 p-6">
        <BlogList initialPosts={mockPosts} />
      </main>
    </div>
  );
}
