"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Post = { id: string; title: string; slug: string; excerpt: string; body: string; category: string; author: string; readTime: string; icon: string; gradient: string; published: boolean; createdAt: Date; updatedAt: Date; };

const CATS = ["All", "Engineering", "Cloud", "Security", "DevOps", "AI/ML", "Web Development"];

const gradMap: Record<string, string> = {
  "from-cyan-500 to-blue-600": "linear-gradient(135deg,#0891b2,#1d4ed8)",
  "from-indigo-500 to-purple-600": "linear-gradient(135deg,#4338ca,#7c3aed)",
  "from-orange-500 to-red-500": "linear-gradient(135deg,#ea580c,#ef4444)",
  "from-green-500 to-teal-500": "linear-gradient(135deg,#059669,#0d9488)",
  "from-purple-500 to-pink-500": "linear-gradient(135deg,#7c3aed,#ec4899)",
  "from-blue-500 to-cyan-400": "linear-gradient(135deg,#3b82f6,#22d3ee)",
};

export function BlogList({ initialPosts }: { initialPosts: Post[] }) {
  const { toast } = useToast();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = posts.filter(p =>
    (cat === "All" || p.category === cat) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()))
  );

  const togglePublish = (p: Post) => {
    setPosts(prev => prev.map(x => x.id === p.id ? { ...x, published: !x.published } : x));
    toast({ title: p.published ? "Post unpublished" : "Post published" });
  };

  const del = (id: string) => {
    if (!confirm("Delete this post?")) return;
    setDeleting(id);
    setTimeout(() => { setPosts(prev => prev.filter(p => p.id !== id)); setDeleting(null); toast({ title: "Deleted" }); }, 350);
  };

  const fmt = (d: Date) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Blog Posts</h2>
          <p style={{ fontSize: 12, color: "#3a5070", marginTop: 4 }}>
            {posts.filter(p => p.published).length} published &nbsp;·&nbsp; {posts.filter(p => !p.published).length} drafts
          </p>
        </div>
        <Link href="/admin/blog/new" style={{
          display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
          borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
          background: "linear-gradient(135deg,#00c2ff,#0099cc)", color: "#080d24",
          boxShadow: "0 0 20px rgba(0,194,255,0.25)",
        }}>+ New Post</Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ position: "relative", maxWidth: 300 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a3a5c" strokeWidth="2.5"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
            style={{ width: "100%", paddingLeft: 30, paddingRight: 12, height: 36, borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={e => (e.target.style.borderColor = "rgba(0,194,255,0.35)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
              background: cat === c ? "rgba(0,194,255,0.12)" : "rgba(255,255,255,0.03)",
              color: cat === c ? "#00c2ff" : "#3a5070",
              border: cat === c ? "1px solid rgba(0,194,255,0.25)" : "1px solid rgba(255,255,255,0.05)",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg,#0d1535 0%,#0a1028 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>No posts found</p>
            <p style={{ fontSize: 12, color: "#3a5070", marginTop: 4 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Post", "Category", "Author", "Read Time", "Date", "Status", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, fontWeight: 700, color: "#2a3a5c", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((post, i) => (
                <tr key={post.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,194,255,0.025)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: gradMap[post.gradient] || "linear-gradient(135deg,#0891b2,#1d4ed8)" }}>
                        {post.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>{post.title}</div>
                        <div style={{ fontSize: 11, color: "#2a3a5c", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>/{post.slug}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)", fontWeight: 500 }}>{post.category}</span>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(0,194,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#00c2ff" }}>{post.author[0]}</div>
                      <span style={{ fontSize: 12, color: "#6a8090" }}>{post.author}</span>
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, color: "#3a5070" }}>{post.readTime}</span>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, color: "#3a5070" }}>{fmt(post.createdAt)}</span>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
                      background: post.published ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
                      color: post.published ? "#10b981" : "#64748b",
                      border: post.published ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(100,116,139,0.15)",
                    }}>{post.published ? "● Published" : "○ Draft"}</span>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <button onClick={() => togglePublish(post)} title={post.published ? "Unpublish" : "Publish"}
                        style={{ padding: 6, borderRadius: 7, color: "#3a5070", background: "transparent", cursor: "pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,194,255,0.1)"; e.currentTarget.style.color = "#00c2ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3a5070"; }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <button style={{ padding: 6, borderRadius: 7, color: "#3a5070", background: "transparent", cursor: "pointer" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,194,255,0.1)"; e.currentTarget.style.color = "#00c2ff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3a5070"; }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                      </Link>
                      <button onClick={() => del(post.id)} disabled={deleting === post.id}
                        style={{ padding: 6, borderRadius: 7, color: "#3a5070", background: "transparent", cursor: "pointer", opacity: deleting === post.id ? 0.4 : 1 }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3a5070"; }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
