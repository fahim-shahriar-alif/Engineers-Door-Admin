"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Contact = { id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: Date; };
type Filter = "all" | "unread" | "read";

const fmt = (d: Date) => new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtShort = (d: Date) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function ContactList({ initialSubmissions }: { initialSubmissions: Contact[] }) {
  const { toast } = useToast();
  const [items, setItems] = useState(initialSubmissions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = items.filter(s => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all" || (filter === "unread" && !s.read) || (filter === "read" && s.read);
    return ms && mf;
  });

  const view = (s: Contact) => {
    setSelected(s);
    if (!s.read) setItems(prev => prev.map(x => x.id === s.id ? { ...x, read: true } : x));
  };

  const toggleRead = (s: Contact) => {
    setItems(prev => prev.map(x => x.id === s.id ? { ...x, read: !x.read } : x));
    if (selected?.id === s.id) setSelected(prev => prev ? { ...prev, read: !prev.read } : null);
  };

  const del = (id: string) => {
    if (!confirm("Delete this message?")) return;
    setDeleting(id);
    setTimeout(() => {
      setItems(prev => prev.filter(s => s.id !== id));
      if (selected?.id === id) setSelected(null);
      setDeleting(null);
      toast({ title: "Message deleted" });
    }, 300);
  };

  const unread = items.filter(s => !s.read).length;

  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Contact Submissions</h2>
          <p style={{ fontSize: 12, color: "#3a5070", marginTop: 4 }}>
            {items.length} total &nbsp;·&nbsp; <span style={{ color: "#f59e0b" }}>{unread} unread</span>
          </p>
        </div>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {(["all", "unread", "read"] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "5px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              background: filter === f ? "rgba(0,194,255,0.12)" : "transparent",
              color: filter === f ? "#00c2ff" : "#3a5070",
              border: filter === f ? "1px solid rgba(0,194,255,0.2)" : "1px solid transparent",
            }}>
              {f}{f === "unread" && unread > 0 && <span style={{ marginLeft: 5, fontSize: 10, padding: "1px 5px", borderRadius: 10, background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>{unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 300 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a3a5c" strokeWidth="2.5"
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..."
          style={{ width: "100%", paddingLeft: 30, paddingRight: 12, height: 36, borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          onFocus={e => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")} />
      </div>

      {/* Two-panel */}
      <div style={{ display: "flex", gap: 16, minHeight: 520 }}>

        {/* List */}
        <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg,#0d1535 0%,#0a1028 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 40 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>No messages</p>
              <p style={{ fontSize: 11, color: "#3a5070", marginTop: 4 }}>Try adjusting your filters</p>
            </div>
          ) : filtered.map((s, i) => (
            <div key={s.id} onClick={() => view(s)} style={{
              display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
              cursor: "pointer", transition: "background 0.12s",
              background: selected?.id === s.id ? "rgba(0,194,255,0.05)" : !s.read ? "rgba(245,158,11,0.03)" : "transparent",
              borderLeft: selected?.id === s.id ? "2px solid #00c2ff" : "2px solid transparent",
            }}
              onMouseEnter={e => { if (selected?.id !== s.id) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              onMouseLeave={e => { if (selected?.id !== s.id) e.currentTarget.style.background = !s.read ? "rgba(245,158,11,0.03)" : "transparent"; }}>

              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: !s.read ? "linear-gradient(135deg,rgba(245,158,11,0.35),rgba(239,68,68,0.2))" : "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: !s.read ? "#f59e0b" : "#3a5070",
              }}>
                {s.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: !s.read ? 700 : 500, color: !s.read ? "#e2e8f0" : "#8a9ab0" }}>{s.name}</span>
                    {!s.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 5px #f59e0b", flexShrink: 0 }} />}
                  </div>
                  <span style={{ fontSize: 10, color: "#2a3a5c", flexShrink: 0 }}>{fmtShort(s.createdAt)}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: !s.read ? 600 : 400, color: !s.read ? "#c8d8e8" : "#5a7090", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.subject}</div>
                <div style={{ fontSize: 11, color: "#2a3a5c", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.message.slice(0, 65)}...</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div style={{ width: 380, flexShrink: 0, borderRadius: 16, background: "linear-gradient(135deg,#0d1535 0%,#0a1028 100%)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{selected.subject}</span>
              <button onClick={() => setSelected(null)} style={{ padding: 5, borderRadius: 7, color: "#3a5070", background: "transparent", cursor: "pointer", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#e2e8f0"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#3a5070"; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Sender */}
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,rgba(0,194,255,0.3),rgba(124,58,237,0.3))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>
                  {selected.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{selected.name}</div>
                  <a href={`mailto:${selected.email}`} style={{ fontSize: 12, color: "#00c2ff", textDecoration: "none" }}>{selected.email}</a>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#2a3a5c", marginTop: 10 }}>Received {fmt(selected.createdAt)}</div>
            </div>

            {/* Message */}
            <div style={{ flex: 1, padding: "16px 18px", overflowY: "auto" }}>
              <p style={{ fontSize: 13, color: "#8a9ab0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selected.message}</p>
            </div>

            {/* Actions */}
            <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 8 }}>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
                background: "linear-gradient(135deg,#00c2ff,#0099cc)", color: "#080d24",
                boxShadow: "0 0 16px rgba(0,194,255,0.2)",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                Reply via Email
              </a>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleRead(selected)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#6a8090",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.3)"; e.currentTarget.style.color = "#00c2ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#6a8090"; }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {selected.read ? "Mark Unread" : "Mark Read"}
                </button>
                <button onClick={() => del(selected.id)} disabled={deleting === selected.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444",
                  opacity: deleting === selected.id ? 0.5 : 1,
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: 380, flexShrink: 0, borderRadius: 16, background: "rgba(13,21,53,0.4)", border: "1px dashed rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,194,255,0.05)", border: "1px solid rgba(0,194,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3050" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#2a3a5c" }}>Select a message</p>
            <p style={{ fontSize: 11, color: "#1a2a44", marginTop: 4 }}>Click any message to read it</p>
          </div>
        )}
      </div>
    </div>
  );
}
