"use client";

import { useState } from "react";

interface TopbarProps { title: string; description?: string; }

export function Topbar({ title, description }: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", height: 60,
      background: "rgba(6,11,30,0.92)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      {/* Left */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 11, color: "#2a3a5c" }}>Engineers Door</span>
          <span style={{ fontSize: 11, color: "#1a2a44" }}>/</span>
          <span style={{ fontSize: 11, color: "#00c2ff", fontWeight: 500 }}>{title}</span>
        </div>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{title}</h1>
        {description && <p style={{ fontSize: 11, color: "#3a5070", marginTop: 2 }}>{description}</p>}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a3a5c" strokeWidth="2.5"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              paddingLeft: 30, paddingRight: 12, height: 32, borderRadius: 8,
              fontSize: 12, color: "#94a3b8", outline: "none",
              background: "rgba(255,255,255,0.04)",
              border: searchFocused ? "1px solid rgba(0,194,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
              width: searchFocused ? 180 : 140,
              transition: "all 0.2s",
            }}
          />
        </div>

        {/* Bell */}
        <button style={{
          width: 32, height: 32, borderRadius: 8, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          color: "#3a5070",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{
            position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%",
            background: "#00c2ff", boxShadow: "0 0 6px #00c2ff",
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.06)" }} />

        {/* User chip */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px",
          borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer",
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "linear-gradient(135deg, #00c2ff, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 800, color: "#080d24",
          }}>AU</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.2 }}>Admin User</div>
            <div style={{ fontSize: 10, color: "#2a3a5c", lineHeight: 1.2 }}>Super Admin</div>
          </div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2a3a5c" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
