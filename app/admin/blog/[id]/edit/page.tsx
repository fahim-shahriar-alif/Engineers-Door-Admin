import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { mockPosts } from "@/lib/mock-data";
import { PostForm } from "../../post-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = mockPosts.find((p) => p.id === id);

  if (!post) notFound();

  // Cast to match Prisma Post shape expected by PostForm
  const postData = {
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  };

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Edit Post" description={`Editing: ${post.title}`} />
      <main className="flex-1 p-6">
        <PostForm post={postData as Parameters<typeof PostForm>[0]["post"]} />
      </main>
    </div>
  );
}
