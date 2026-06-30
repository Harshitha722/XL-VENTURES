import Link from "next/link";
import { ArrowRight, Layers3, ShieldCheck, Waypoints, Zap, BrainCircuit, BarChart3, Globe } from "lucide-react";

const features = [
  {
    Icon: Layers3,
    title: "Hybrid Intelligence",
    body: "Ingestion, RAG, ontology, memory, and multi-agent reasoning orchestrated seamlessly.",
    variant: "primary" as const,
    badge: "Core"
  },
  {
    Icon: Waypoints,
    title: "Dynamic Agents",
    body: "Capabilities are planned and generated at runtime for each domain context.",
    variant: "purple" as const,
    badge: "AI"
  },
  {
    Icon: ShieldCheck,
    title: "Human Control",
    body: "Mandatory review below confidence thresholds with immutable audit history.",
    variant: "green" as const,
    badge: "Trust"
  }
];

const stats = [
  { value: "99.9%", label: "Uptime SLA", Icon: Zap },
  { value: "<2s", label: "Analysis latency", Icon: BrainCircuit },
  { value: "50+", label: "Decision domains", Icon: Globe },
  { value: "100%", label: "Explainable AI", Icon: BarChart3 }
];

const iconClass = {
  primary: "icon-box-primary",
  purple: "icon-box-purple",
  green: "icon-box-green",
  gold: "icon-box-gold",
  red: "icon-box-red"
};

export default function LandingPage() {
  return (
    <div style={{ display: "grid", gap: 48, position: "relative" }}>
      {/* Floating orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      {/* Hero Section */}
      <section
        style={{
          minHeight: "65vh",
          display: "grid",
          alignContent: "center",
          gap: 28,
          maxWidth: 900,
          position: "relative",
          zIndex: 1,
          paddingTop: 24
        }}
      >
        {/* Eyebrow badge */}
        <div
          className="badge badge-primary animate-fade-in-up"
          style={{ width: "fit-content", padding: "6px 14px", fontSize: 11 }}
        >
          <Zap size={11} />
          Universal Agentic Decision Intelligence Platform
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: "clamp(42px, 6vw, 72px)",
            lineHeight: 1.04,
            margin: 0,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            animationDelay: "80ms"
          }}
        >
          <span className="gradient-text">DECISION</span>
          <br />
          <span style={{ color: "var(--text-primary)" }}>MESH AI</span>
        </h1>

        <p
          className="animate-fade-in-up"
          style={{
            fontSize: 18,
            color: "var(--text-secondary)",
            maxWidth: 620,
            lineHeight: 1.7,
            margin: 0,
            animationDelay: "140ms"
          }}
        >
          Explainable recommendations, scenario simulation, confidence scoring,
          and human authority across any domain — powered by agentic AI.
        </p>

        <div
          className="animate-fade-in-up"
          style={{ display: "flex", gap: 12, flexWrap: "wrap", animationDelay: "200ms" }}
        >
          <Link href="/workspace">
            <span
              className="btn btn-primary"
              style={{ padding: "13px 24px", fontSize: 15, gap: 10 }}
            >
              Open Workspace
              <ArrowRight size={18} />
            </span>
          </Link>
          <Link href="/analysis">
            <span
              className="btn btn-ghost"
              style={{ padding: "13px 24px", fontSize: 15, gap: 10 }}
            >
              <BrainCircuit size={18} />
              Run Analysis
            </span>
          </Link>
        </div>
      </section>

      {/* Stats Strip */}
      <section
        className="animate-fade-in-up glass-card stagger-children"
        style={{
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 24,
          animationDelay: "260ms",
          position: "relative",
          zIndex: 1
        }}
      >
        {stats.map(({ value, label, Icon }) => (
          <div
            key={label}
            className="animate-fade-in-up"
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <div className="icon-box icon-box-primary">
              <Icon size={18} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)"
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Feature Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          position: "relative",
          zIndex: 1
        }}
      >
        {features.map(({ Icon, title, body, variant, badge }, i) => (
          <div
            key={title}
            className="glass-card animate-fade-in-up"
            style={{
              padding: 24,
              display: "grid",
              gap: 14,
              animationDelay: `${300 + i * 80}ms`,
              cursor: "default"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div className={`icon-box ${iconClass[variant]}`} style={{ width: 44, height: 44 }}>
                <Icon size={20} />
              </div>
              <span className={`badge badge-${variant === "green" ? "success" : variant === "primary" ? "primary" : "purple"}`}>
                {badge}
              </span>
            </div>
            <div>
              <strong style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                {title}
              </strong>
              <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{body}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
