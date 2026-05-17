"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Project = { id: string; title: string; category: string; description: string; result: string; techTags: string[]; icon: string; gradient: string; createdAt: Date; updatedAt: Date; };

const gradMap: Record<string, string> = {
  "from-purple-500 to-cyan-500":   "linear-gradient(135deg,#7c3aed,#06b6d4)",
  "from-cyan-500 to-blue-600":     "linear-gradient(135deg,#0891b2,#1d4ed8)",
  "from-green-500 to-teal-500":    "linear-gradient(135deg,#059669,#0d9488)",
  "from-orange-500 to-red-500":    "linear-gradient(135deg,#ea580c,#ef4444)",
  "from-indigo-500 to-purple-600": "linear-gradient(135deg,#4338ca,#7c3aed)",
  "from-pink-500 to-rose-500":     "linear-gradient(135deg,#ec4899,#f43f5e)",
};

export function PortfolioList({ initialProjects }: { initialProjects: Project[] }) {
  const { toast } = useToast();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const del = (id: string) => {
    if (!confirm("Delete this project?")) return;
    setDeleting(id);
    setTimeout(() => { setProjects(prev => prev.filter(p => p.id !== id)); setDeleting(null); toast({ title: "Deleted" }); }, 350);
  };

  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Portfolio Projects</h2>
          <p style={{ fontSize: 12, color: "#3a5070", marginTop: 4 }}>{projects.length} projects showcased</p>
        </div>
        <Link href="/admin/portfolio/new" style={{
          display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
          borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
          background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff",
          boxShadow: "0 0 20px rgba(16,185,129,0.25)",
        }}>+ Add Project</Link>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 300 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a3a5c" strokeWidth="2.5"
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
          style={{ width: "100%", paddingLeft: 30, paddingRight: 12, height: 36, borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          onFocus={e => (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", borderRadius: 16, background: "rgba(13,21,53,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>No projects found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {filtered.map(project => (
            <div key={project.id} style={{
              borderRadius: 16, overflow: "hidden",
              background: "linear-gradient(135deg,#0d1535 0%,#0a1028 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "border-color 0.15s, transform 0.15s",
              position: "relative",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>

              {/* Gradient header */}
              <div style={{ height: 90, background: gradMap[project.gradient] || "linear-gradient(135deg,#7c3aed,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: 38 }}>{project.icon}</span>
                {/* Hover actions */}
                <div className="proj-actions" style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6, opacity: 0, transition: "opacity 0.15s" }}>
                  <Link href={`/admin/portfolio/${project.id}/edit`}>
                    <button style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </Link>
                  <button onClick={() => del(project.id)} disabled={deleting === project.id}
                    style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(239,68,68,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", opacity: deleting === project.id ? 0.4 : 1 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)", fontWeight: 500 }}>{project.category}</span>
                  <span style={{ fontSize: 10, color: "#2a3a5c" }}>{new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{project.title}</div>
                <div style={{ fontSize: 12, color: "#4a6080", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.description}</div>

                {/* Result */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)", marginBottom: 12 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#10b981" }}>{project.result}</span>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {project.techTags.slice(0, 4).map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "rgba(255,255,255,0.04)", color: "#4a6080", border: "1px solid rgba(255,255,255,0.06)" }}>{tag}</span>
                  ))}
                  {project.techTags.length > 4 && (
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "rgba(255,255,255,0.04)", color: "#2a3a5c" }}>+{project.techTags.length - 4}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`.proj-actions { opacity: 0 !important; } div:hover > div > .proj-actions { opacity: 1 !important; }`}</style>
    </div>
  );
}
