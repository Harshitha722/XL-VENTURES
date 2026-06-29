import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Archive,
  BrainCircuit,
  ClipboardCheck,
  Database,
  Gauge,
  Settings,
  ShieldCheck,
  UploadCloud
} from "lucide-react";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DECISIONMESH AI",
  description: "Universal Agentic Decision Intelligence Platform"
};

const nav = [
  ["Workspace", "/workspace", Gauge],
  ["Upload", "/upload", UploadCloud],
  ["Knowledge", "/knowledge", Database],
  ["Analysis", "/analysis", BrainCircuit],
  ["Recommendations", "/recommendations", ClipboardCheck],
  ["Human Review", "/review", ShieldCheck],
  ["Audit", "/audit", Archive],
  ["Settings", "/settings", Settings],
  ["Admin", "/admin", Activity]
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="shell">
            <aside className="sidebar">
              <Link href="/" style={{ display: "grid", gap: 6, marginBottom: 28 }}>
                <strong style={{ fontSize: 20 }}>DECISIONMESH AI</strong>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Universal Agentic Decision Intelligence Platform</span>
              </Link>
              <nav style={{ display: "grid", gap: 8 }}>
                {nav.map(([label, href, Icon]) => (
                  <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 8 }}>
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </aside>
            <main className="main">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
