"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, X, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@prisma/client";

const CATEGORIES = [
  "Web Application", "Mobile App", "Cloud Infrastructure", "DevOps",
  "AI/ML", "Data Platform", "Security", "E-commerce", "SaaS", "API",
];

const GRADIENTS = [
  { label: "Purple → Cyan", value: "from-purple-500 to-cyan-500" },
  { label: "Cyan → Blue", value: "from-cyan-500 to-blue-600" },
  { label: "Green → Teal", value: "from-green-500 to-teal-500" },
  { label: "Orange → Red", value: "from-orange-500 to-red-500" },
  { label: "Indigo → Purple", value: "from-indigo-500 to-purple-600" },
  { label: "Pink → Rose", value: "from-pink-500 to-rose-500" },
];

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: project?.title ?? "",
    category: project?.category ?? "",
    description: project?.description ?? "",
    result: project?.result ?? "",
    techTags: project?.techTags ?? [],
    icon: project?.icon ?? "🚀",
    gradient: project?.gradient ?? "from-purple-500 to-cyan-500",
  });

  const handleChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.techTags.includes(tag)) {
      handleChange("techTags", [...form.techTags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    handleChange("techTags", form.techTags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const method = project ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }

      toast({ title: project ? "Project updated" : "Project created", variant: "success" });
      router.push("/admin/portfolio");
      router.refresh();
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/portfolio">
          <Button type="button" variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> {project ? "Update Project" : "Create Project"}</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. E-commerce Platform Rebuild"
                  required
                />
              </div>

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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the project, challenges solved, and approach taken..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Result / Metric *</Label>
                <Input
                  id="result"
                  value={form.result}
                  onChange={(e) => handleChange("result", e.target.value)}
                  placeholder="e.g. 40% faster load times, 3x revenue increase"
                  required
                />
                <p className="text-xs text-text-muted">A key measurable outcome of the project.</p>
              </div>

              <div className="space-y-2">
                <Label>Tech Stack Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Add technology (e.g. Next.js, AWS)..."
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {form.techTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.techTags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-danger transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
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
                  placeholder="🚀"
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

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className={`h-20 rounded-xl bg-gradient-to-br ${form.gradient} flex items-center justify-center`}>
                  <span className="text-4xl">{form.icon || "🚀"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
