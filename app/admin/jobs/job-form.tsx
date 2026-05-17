"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, X, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@prisma/client";

const DEPARTMENTS = [
  "Engineering", "Frontend", "Backend", "Full Stack", "DevOps",
  "Cloud", "Security", "Data Science", "AI/ML", "Design", "Product", "Sales",
];

const JOB_TYPES = ["Full-time", "Part-time", "Contract"];
const LOCATIONS = ["Remote", "Hybrid", "On-site"];

interface JobFormProps {
  job?: Job;
}

export function JobForm({ job }: JobFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: job?.title ?? "",
    department: job?.department ?? "",
    type: job?.type ?? "Full-time",
    location: job?.location ?? "Remote",
    techTags: job?.techTags ?? [],
    active: job?.active ?? true,
  });

  const handleChange = (field: string, value: string | boolean | string[]) => {
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

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = job ? `/api/jobs/${job.id}` : "/api/jobs";
      const method = job ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }

      toast({ title: job ? "Job updated" : "Job created", variant: "success" });
      router.push("/admin/jobs");
      router.refresh();
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/jobs">
          <Button type="button" variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="active"
              checked={form.active}
              onCheckedChange={(v) => handleChange("active", v)}
            />
            <Label htmlFor="active" className="text-sm cursor-pointer">
              {form.active ? "Active" : "Closed"}
            </Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> {job ? "Update Job" : "Create Job"}</>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <select
              id="department"
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
              required
              className="flex h-9 w-full rounded-lg border border-border bg-background-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-colors"
            >
              <option value="">Select department...</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Type *</Label>
              <div className="flex flex-col gap-2">
                {JOB_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={form.type === type}
                      onChange={() => handleChange("type", type)}
                      className="accent-accent"
                    />
                    <span className="text-sm text-text-secondary">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <div className="flex flex-col gap-2">
                {LOCATIONS.map((loc) => (
                  <label key={loc} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="location"
                      value={loc}
                      checked={form.location === loc}
                      onChange={() => handleChange("location", loc)}
                      className="accent-accent"
                    />
                    <span className="text-sm text-text-secondary">{loc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tech Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag (e.g. React, Node.js)..."
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
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-danger transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
