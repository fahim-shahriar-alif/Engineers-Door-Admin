import { Topbar } from "@/components/layout/topbar";
import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="New Blog Post" description="Create a new blog post" />
      <main className="flex-1 p-6">
        <PostForm />
      </main>
    </div>
  );
}
