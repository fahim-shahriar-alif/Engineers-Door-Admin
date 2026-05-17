"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Job = { id: string; title: string; department: string; type: string; location: string; techTags: string[]; active: boolean; createdAt: Date; updatedAt: Date; };

const locColor: Record<string, { bg: string; color: string; border: string }> = {
  Remote:    { bg: "rgba(16,185,129,0.1)",  color: "#10b981", border: "rgba(16,185,129,0.2)" },
  Hybrid:    { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", border: "rgba(245,158,11,0.2)" },
  "On-site": { bg: "rgba(124,58,237,0.1)",  color: "#a78bfa", border: "rgba(124,58,237,0.2)" },
};
const typeColor: Record<string, { bg: string; color: string; border: string }> = {
  "Full-time": { bg: "rgba(0,194,255,0.1)",  color: "#00c2ff", border: "rgba(0,194,255,0.2)" },
  "Part-time": { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.2)" },
  Contract:    { bg: "rgba(124,58,237,0.1)", color: "#a78bfa", border: "rgba(124,58,237,0.2)" },
};

export function JobsList({ initialJobs }: { initialJobs: Job[] }) {
  const { toast } = useToast();
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (j: Job) => {
    setJobs(prev => prev.map(x => x.id === j.id ? { ...x, active: !x.active } : x));
    toast({ title: j.active ? "Job closed" : "Job activated" });
  };

  const del = (id: string) => {
    if (!confirm("Delete this job?")) return;
    setDeleting(id);
    setTimeout(() => { setJobs(prev => prev.filter(j => j.id !== id)); setDeleting(null); toast({ title: "Deleted" }); }, 350);
  };

  const fmt = (d: Date) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Job Listings</h2>
          <p style={{ fontSize: 12, color: "#3a5070", marginTop: 4 }}>
            {jobs.filter(j => j.active).length} active &nbsp;·&nbsp; {jobs.filter(j => !j.active).length} closed
          </p>
        </div>
        <Link href="/admin/jobs/new" style={{
          display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
          borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
          background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff",
          boxShadow: "0 0 20px rgba(124,58,237,0.3)",
        }}>+ Post a Job</Link>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 300 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a3a5c" strokeWidth="2.5"
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..."
          style={{ width: "100%", paddingLeft: 30, paddingRight: 12, height: 36, borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          onFocus={e => (e.target.style.borderColor = "rgba(124,58,237,0.4)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")} />
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", borderRadius: 16, background: "rgba(13,21,53,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>No jobs found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {filtered.map(job => {
            const ls = locColor[job.location] ?? locColor.Remote;
            const ts = typeColor[job.type] ?? typeColor["Full-time"];
            return (
              <div key={job.id} style={{
                borderRadius: 16, padding: 20,
                background: "linear-gradient(135deg,#0d1535 0%,#0a1028 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                opacity: job.active ? 1 : 0.6,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>

                {/* Top */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{job.title}</div>
                      <div style={{ fontSize: 11, color: "#3a5070", marginTop: 2 }}>{job.department}</div>
                    </div>
                  </div>
                  <button onClick={() => toggle(job)} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "4px 10px",
                    borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
                    background: job.active ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
                    color: job.active ? "#10b981" : "#64748b",
                    border: job.active ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(100,116,139,0.2)",
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: job.active ? "#10b981" : "#64748b", boxShadow: job.active ? "0 0 4px #10b981" : "none" }} />
                    {job.active ? "Active" : "Closed"}
                  </button>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, fontWeight: 500, background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>{job.type}</span>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, fontWeight: 500, background: ls.bg, color: ls.color, border: `1px solid ${ls.border}`, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {job.location}
                  </span>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {job.techTags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, background: "rgba(255,255,255,0.04)", color: "#4a6080", border: "1px solid rgba(255,255,255,0.06)" }}>{tag}</span>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 11, color: "#2a3a5c" }}>Posted {fmt(job.createdAt)}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Link href={`/admin/jobs/${job.id}/edit`}>
                      <button style={{ padding: 6, borderRadius: 7, color: "#3a5070", background: "transparent", cursor: "pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.color = "#a78bfa"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3a5070"; }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </Link>
                    <button onClick={() => del(job.id)} disabled={deleting === job.id}
                      style={{ padding: 6, borderRadius: 7, color: "#3a5070", background: "transparent", cursor: "pointer", opacity: deleting === job.id ? 0.4 : 1 }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3a5070"; }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
