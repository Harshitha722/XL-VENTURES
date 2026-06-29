import Link from "next/link";
import { ArrowRight, Layers3, ShieldCheck, Waypoints } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <section style={{ minHeight: "72vh", display: "grid", alignContent: "center", gap: 22, maxWidth: 980 }}>
        <h1 style={{ fontSize: 56, lineHeight: 1.02, margin: 0 }}>DECISIONMESH AI</h1>
        <p style={{ fontSize: 21, color: "var(--muted)", maxWidth: 720 }}>
          Universal Agentic Decision Intelligence Platform for explainable recommendations, scenario simulation, confidence scoring, and human authority across any domain.
        </p>
        <Link href="/workspace" style={{ display: "inline-flex", alignItems: "center", gap: 10, width: "fit-content", background: "var(--accent)", color: "white", padding: "12px 16px", borderRadius: 8, fontWeight: 700 }}>
          Open workspace <ArrowRight size={18} />
        </Link>
      </section>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {[
          [Layers3, "Hybrid intelligence", "Ingestion, RAG, ontology, memory, and multi-agent reasoning."],
          [Waypoints, "Dynamic agents", "Capabilities are planned and generated at runtime for each domain."],
          [ShieldCheck, "Human control", "Mandatory review below confidence thresholds with immutable audit history."]
        ].map(([Icon, title, body]) => (
          <div className="panel metric" key={String(title)}>
            <Icon size={22} />
            <strong>{String(title)}</strong>
            <span style={{ color: "var(--muted)" }}>{String(body)}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
