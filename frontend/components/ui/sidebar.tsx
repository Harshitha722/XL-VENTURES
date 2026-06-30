"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Archive,
  Brain,
  ClipboardCheck,
  Gauge,
  Settings,
  ShieldCheck,
  UploadCloud,
  Zap
} from "lucide-react";

const nav = [
  { label: "Workspace", href: "/workspace", Icon: Gauge, section: "Core" },
  { label: "Upload", href: "/upload", Icon: UploadCloud, section: "Core" },
  { label: "Analysis", href: "/analysis", Icon: Zap, section: "Intelligence" },
  { label: "Knowledge Base", href: "/knowledge", Icon: Brain, section: "Intelligence" },
  { label: "Recommendations", href: "/recommendations", Icon: ClipboardCheck, section: "Intelligence" },
  { label: "Human Review", href: "/review", Icon: ShieldCheck, section: "Intelligence" },
  { label: "Audit", href: "/audit", Icon: Archive, section: "System" },
  { label: "Settings", href: "/settings", Icon: Settings, section: "System" },
  { label: "Admin", href: "/admin", Icon: Activity, section: "System" },
] as const;

const sections = ["Core", "Intelligence", "System"] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="icon-box icon-box-primary animate-glow" style={{ width: 32, height: 32 }}>
            <Zap size={16} />
          </div>
          <span className="sidebar-logo-name">DECISIONMESH</span>
        </div>
        <span className="sidebar-logo-sub">Universal Agentic Decision Intelligence</span>
      </Link>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {sections.map((section) => (
          <div key={section}>
            <div className="nav-label">{section}</div>
            {nav
              .filter((item) => item.section === section)
              .map(({ label, href, Icon }) => {
                const isActive =
                  pathname === href ||
                  ((href as string) !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`nav-link${isActive ? " active" : ""}`}
                  >
                    <span className="nav-icon">
                      <Icon size={17} />
                    </span>
                    <span>{label}</span>
                    {isActive && (
                      <span
                        style={{
                          marginLeft: "auto",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--accent-primary)",
                          boxShadow: "0 0 8px var(--accent-primary)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: 24 }}>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            className="status-dot online"
            style={{ fontSize: 12, color: "var(--text-muted)" }}
          >
            System operational
          </span>
        </div>
      </div>
    </aside>
  );
}
