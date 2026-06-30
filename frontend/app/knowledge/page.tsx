"use client";

import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/ui/section";
import { getDomains } from "@/lib/api";
import { AlertTriangle, Brain, Cpu, Database, Target, TrendingUp } from "lucide-react";

export default function KnowledgeBase() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["domains"],
    queryFn: getDomains,
    refetchInterval: 8000,
  });

  return (
    <Section
      title="Knowledge Base"
      subtitle="Analyzed business environments and available reasoning capabilities"
    >
      <div style={{ display: "grid", gap: 14 }}>
        {isLoading && (
          <div style={{ display: "grid", gap: 12 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 160, animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        )}

        {isError && (
          <div className="alert alert-error">
            <AlertTriangle size={15} />
            <span>Unable to load domain catalog.</span>
          </div>
        )}

        {!isLoading && !isError && !data?.length && (
          <div
            className="panel"
            style={{
              padding: "56px 32px",
              display: "grid",
              placeItems: "center",
              gap: 20,
              textAlign: "center",
            }}
          >
            <div className="icon-box icon-box-purple animate-glow" style={{ width: 56, height: 56 }}>
              <Brain size={26} />
            </div>
            <div>
              <p style={{ color: "var(--text-primary)", margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>
                No domains detected yet
              </p>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 14, maxWidth: 420, lineHeight: 1.7 }}>
                The LLM will automatically detect the domain when you run your first analysis.
                Domains are derived from real evidence — there is no static list.
              </p>
            </div>
            <div className="alert alert-info" style={{ maxWidth: 480, textAlign: "left" }}>
              <Brain size={14} />
              <span>
                Go to <strong>Upload</strong> to add evidence, then <strong>Analysis</strong> to run
                the pipeline. The detected domain will appear here automatically.
              </span>
            </div>
          </div>
        )}

        <div className="stagger-children">
          {(data ?? []).map((domain, idx) => (
            <article
              key={domain.domain}
              className="glass-card animate-fade-in-up"
              style={{ padding: 24, display: "grid", gap: 16, animationDelay: `${idx * 80}ms` }}
            >
              {/* Domain header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div className="icon-box icon-box-primary animate-glow" style={{ width: 44, height: 44 }}>
                  <Database size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                    <strong style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                      {domain.domain.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </strong>
                    <span className="badge badge-primary" style={{ fontSize: 10 }}>
                      LLM detected
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {domain.description}
                  </p>
                </div>
                <span className="badge badge-purple" style={{ flexShrink: 0 }}>
                  {domain.scenario_count} scenarios
                </span>
              </div>

              <hr className="divider" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Business goals */}
                <div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600,
                    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8
                  }}>
                    <Target size={12} /> Business Goals
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {domain.business_goals.slice(0, 4).map((goal) => (
                      <span key={goal} className="badge badge-success" style={{ fontSize: 10 }}>{goal}</span>
                    ))}
                  </div>
                </div>

                {/* Agent capabilities */}
                <div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600,
                    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8
                  }}>
                    <Cpu size={12} /> Agent Capabilities
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {domain.agent_capabilities.slice(0, 4).map((cap) => (
                      <span key={cap} className="badge badge-purple" style={{ fontSize: 10 }}>{cap}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Opportunities row */}
              {domain.opportunities?.length > 0 && (
                <div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600,
                    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8
                  }}>
                    <TrendingUp size={12} /> LLM-identified Opportunities
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {domain.opportunities.slice(0, 3).map((opp) => (
                      <span key={opp} className="badge badge-gold" style={{ fontSize: 10 }}>{opp}</span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
