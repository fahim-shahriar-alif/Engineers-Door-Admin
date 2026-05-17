"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@prisma/client";

const CATEGORIES = [
  "Technology", "Engineering", "Cloud", "DevOps", "Security",
  "AI/ML", "Web Development", "Mobile", "Career", "Company News",
];

const GRADIENTS = [
  { label: "Cyan → Blue", value: "from-cyan-500 to-blue-600" },
  { label: "Purple → Pink", value: "from-purple-500 to-pink-500" },
  { label: "Green → Teal", value: "from-green-500 to-teal-500" },
  { label: "Orange → Red", value: "from-orange-500 to-red-500" },
  { label: "Indigo → Purple", value: "from-indigo-500 to-purple-600" },
  { label: "Cyan → Purple", value: "from-cyan-500 to-purple-600" },
];

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    category: post?.category ?? "",
    author: post?.author ?? "",
    readTime: post?.readTime ?? "5 min read",
    icon: post?.icon ?? "📝",
    gradient: post?.gradient ?? "from-cyan-500 to-blue-600",
    published: post?.published ?? false,
  });

  // Auto-generate slug from title (only for new posts)
  useEffect(() => {
    if (!post) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, post]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = post ? `/api/posts/${post.id}` : "/api/posts";
      const method = post ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }

      toast({
        title: post ? "Post updated" : "Post created",
        variant: "success",
      });
      router.push("/admin/blog");
      router.refresh();
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin/blog">
          <Button type="button" variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={form.published}
              onCheckedChange={(v) => handleChange("published", v)}
            />
            <Label htmlFor="published" className="text-sm cursor-pointer">
              {form.published ? "Published" : "Draft"}
            </Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> {post ? "Update Post" : "Create Post"}</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter post title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="auto-generated-from-title"
                />
                <p className="text-xs text-text-muted">Auto-generated from title. Edit if needed.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Body (Markdown) *</Label>
                <Textarea
                  id="body"
                  value={form.body}
                  onChange={(e) => handleChange("body", e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  rows={16}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-xs text-text-muted">Supports Markdown formatting.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  required
                  className="flex h-9 w-full rounded-lg border border-border bg-background-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-colors"
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Author name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={form.readTime}
                  onChange={(e) => handleChange("readTime", e.target.value)}
                  placeholder="5 min read"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => handleChange("icon", e.target.value)}
                  placeholder="📝"
                  className="text-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Gradient</Label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENTS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => handleChange("gradient", g.value)}
                      className={`h-10 rounded-lg bg-gradient-to-r ${g.value} text-white text-xs font-medium transition-all ${
                        form.gradient === g.value
                          ? "ring-2 ring-accent ring-offset-2 ring-offset-background-card"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className={`h-16 rounded-xl bg-gradient-to-r ${form.gradient} flex items-center justify-center`}>
                  <span className="text-3xl">{form.icon || "📝"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
