import { Topbar } from "@/components/layout/topbar";
import { mockStats, mockPosts, mockJobs, mockContacts } from "@/lib/mock-data";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Tiny SVG sparkline
function Spark({ vals, color }: { vals: number[]; color: string }) {
  const max = Math.max(...vals), min = Math.min(...vals), range = max - min || 1;
  const W = 72, H = 24;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ title, value, sub, change, trend, color, href }: {
  title: string; value: number; sub: string; change: string;
  trend: number[]; color: string; href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        background: "linear-gradient(135deg, #0d1535 0%, #0a1028 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: "20px 20px 16px",
        cursor: "pointer", transition: "border-color 0.2s",
        position: "relative", overflow: "hidden",
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}40`)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}>
        {/* glow */}
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color, opacity: 0.07, filter: "blur(20px)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, background: color, opacity: 0.9 }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
            ↑ {change}
          </span>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#4a6080", marginBottom: 12 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#2a3a5c" }}>{sub}</span>
          <Spark vals={trend} color={color} />
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const s = mockStats;

  return (
    <div style={{ flex: 1, background: "#080d24" }}>
      <Topbar title="Dashboard" description="Overview of your Engineers Door platform" />

      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Welcome banner */}
        <div style={{
          borderRadius: 16, padding: "20px 24px",
          background: "linear-gradient(135deg, rgba(0,194,255,0.08) 0%, rgba(124,58,237,0.08) 100%)",
          border: "1px solid rgba(0,194,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />
              <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>All systems operational</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Good morning, Admin 👋</div>
            <div style={{ fontSize: 13, color: "#4a6080" }}>
              You have{" "}
              <span style={{ color: "#f59e0b", fontWeight: 600 }}>{s.unreadContacts} unread messages</span>
              {" "}and{" "}
              <span style={{ color: "#00c2ff", fontWeight: 600 }}>{s.totalPosts - s.publishedPosts} draft posts</span>
              {" "}waiting.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/admin/blog/new" style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
              borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
              background: "linear-gradient(135deg, #00c2ff, #0099cc)", color: "#080d24",
              boxShadow: "0 0 20px rgba(0,194,255,0.3)",
            }}>+ New Post</Link>
            <Link href="/admin/contact" style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
              borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b",
            }}>View Messages</Link>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatCard title="Blog Posts"         value={s.totalPosts}    sub={`${s.publishedPosts} published`}  change="2 this month" trend={[2,3,3,4,4,5,6]} color="#00c2ff" href="/admin/blog" />
          <StatCard title="Job Listings"       value={s.totalJobs}     sub={`${s.activeJobs} active`}         change="1 this week"  trend={[3,3,4,4,5,5,6]} color="#7c3aed" href="/admin/jobs" />
          <StatCard title="Portfolio Projects" value={s.totalProjects} sub="6 live projects"                  change="All live"     trend={[4,4,5,5,5,6,6]} color="#10b981" href="/admin/portfolio" />
          <StatCard title="Contact Messages"   value={s.totalContacts} sub={`${s.unreadContacts} unread`}     change={`${s.unreadContacts} new`} trend={[1,2,3,3,5,6,7]} color="#f59e0b" href="/admin/contact" />
        </div>

        {/* Middle row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

          {/* Recent posts table */}
          <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #0d1535 0%, #0a1028 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,194,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Recent Blog Posts</span>
              </div>
              <Link href="/admin/blog" style={{ fontSize: 11, color: "#00c2ff", textDecoration: "none", fontWeight: 500 }}>View all →</Link>
            </div>
            {mockPosts.slice(0, 5).map((post, i) => (
              <div key={post.id} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 20px",
                borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.03)" : "none",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,194,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: `linear-gradient(135deg, ${post.gradient.includes("cyan") ? "#0891b2,#1d4ed8" : post.gradient.includes("indigo") ? "#4338ca,#7c3aed" : post.gradient.includes("orange") ? "#ea580c,#dc2626" : post.gradient.includes("green") ? "#059669,#0d9488" : "#7c3aed,#ec4899"})` }}>
                  {post.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 4, background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>{post.category}</span>
                    <span style={{ fontSize: 11, color: "#2a3a5c" }}>·</span>
                    <span style={{ fontSize: 11, color: "#2a3a5c" }}>{post.author}</span>
                    <span style={{ fontSize: 11, color: "#2a3a5c" }}>·</span>
                    <span style={{ fontSize: 11, color: "#2a3a5c" }}>{post.readTime}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 20, flexShrink: 0,
                  background: post.published ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
                  color: post.published ? "#10b981" : "#64748b",
                  border: post.published ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(100,116,139,0.15)",
                }}>
                  {post.published ? "● Live" : "○ Draft"}
                </span>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div style={{ borderRadius: 16, background: "linear-gradient(135deg, #0d1535 0%, #0a1028 100%)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Activity</span>
              </div>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", fontWeight: 600 }}>● Live</span>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {[
                { text: "Post published", detail: "Building Scalable Microservices", time: "2h ago", color: "#00c2ff" },
                { text: "New message", detail: "Sarah Johnson — Partnership", time: "3h ago", color: "#f59e0b" },
                { text: "Job updated", detail: "Senior Full Stack Engineer", time: "5h ago", color: "#7c3aed" },
                { text: "New message", detail: "Michael Chen — Custom Software", time: "8h ago", color: "#f59e0b" },
                { text: "Draft saved", detail: "Zero Trust Security Model", time: "1d ago", color: "#3a5070" },
                { text: "Job closed", detail: "Cloud Solutions Architect", time: "2d ago", color: "#3a5070" },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, boxShadow: `0 0 6px ${item.color}`, marginTop: 4, flexShrink: 0 }} />
                    {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.04)", minHeight: 20, marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#c8d8e8" }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: "#3a5070", marginTop: 1 }}>{item.detail}</div>
                    <div style={{ fontSize: 10, color: "#1e2e44", marginTop: 2 }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Jobs */}
          <div style={{ borderRadius: 16, background: "linear-gradient(135deg, #0d1535 0%, #0a1028 100%)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Open Positions</span>
              </div>
              <Link href="/admin/jobs" style={{ fontSize: 11, color: "#00c2ff", textDecoration: "none", fontWeight: 500 }}>Manage →</Link>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {mockJobs.slice(0, 4).map(job => (
                <div key={job.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                  borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)")}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.title}</div>
                    <div style={{ fontSize: 11, color: "#3a5070", marginTop: 2 }}>{job.department} · {job.location}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "rgba(0,194,255,0.1)", color: "#00c2ff", border: "1px solid rgba(0,194,255,0.18)" }}>{job.type}</span>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: job.active ? "#10b981" : "#3a5070", boxShadow: job.active ? "0 0 5px #10b981" : "none" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ borderRadius: 16, background: "linear-gradient(135deg, #0d1535 0%, #0a1028 100%)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Recent Messages</span>
                <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", fontWeight: 700 }}>{s.unreadContacts} new</span>
              </div>
              <Link href="/admin/contact" style={{ fontSize: 11, color: "#00c2ff", textDecoration: "none", fontWeight: 500 }}>View all →</Link>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {mockContacts.slice(0, 4).map(c => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
                  borderRadius: 10,
                  background: c.read ? "rgba(255,255,255,0.02)" : "rgba(245,158,11,0.04)",
                  border: c.read ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(245,158,11,0.12)",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: c.read ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.2))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: c.read ? "#3a5070" : "#f59e0b",
                  }}>
                    {c.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: c.read ? "#94a3b8" : "#e2e8f0" }}>{c.name}</span>
                      {!c.read && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 4px #f59e0b" }} />}
                    </div>
                    <div style={{ fontSize: 11, color: "#4a6080", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.subject}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "#2a3a5c", flexShrink: 0, whiteSpace: "nowrap" }}>
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ borderRadius: 16, background: "linear-gradient(135deg, #0d1535 0%, #0a1028 100%)", border: "1px solid rgba(255,255,255,0.06)", padding: "20px 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Quick Actions</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Write New Post", sub: "Blog & articles", href: "/admin/blog/new", color: "#00c2ff" },
              { label: "Post a Job", sub: "Open positions", href: "/admin/jobs/new", color: "#7c3aed" },
              { label: "Add Project", sub: "Portfolio", href: "/admin/portfolio/new", color: "#10b981" },
              { label: "Read Messages", sub: `${s.unreadContacts} unread`, href: "/admin/contact", color: "#f59e0b" },
            ].map(a => (
              <Link key={a.label} href={a.href} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                borderRadius: 12, textDecoration: "none",
                background: `${a.color}0a`, border: `1px solid ${a.color}18`,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${a.color}35`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = `${a.color}18`)}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: a.color, opacity: 0.85 }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "#3a5070", marginTop: 2 }}>{a.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
