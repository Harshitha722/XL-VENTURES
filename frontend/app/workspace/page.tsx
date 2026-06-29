"use client";

import { useQuery } from "@tanstack/react-query";
import { Section, MetricCard } from "@/components/ui/section";
import { getMetrics } from "@/lib/api";
import { useDecisionStore } from "@/store/useDecisionStore";
import {
  FileText,
  Users,
  TrendingUp,
  XCircle,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  Gauge
} from "lucide-react";

export default function WorkspaceDashboard() {
  const report = useDecisionStore((state) => state.report);
  const documents = useDecisionStore((state) => state.documents);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
    refetchInterval: 15000
  });

  const cards = [
    { label: "Reports", value: data?.reports ?? 0, Icon: FileText, variant: "primary" as const },
    { label: "Customer outcomes", value: data?.customer_outcomes ?? 0, Icon: Users, variant: "purple" as const },
    { label: "Conversion rate", value: `${data?.deal_conversion_rate ?? 0}%`, Icon: TrendingUp, variant: "green" as const },
    { label: "Lost / No decision", value: (data?.lost_deals ?? 0) + (data?.no_decision_deals ?? 0), Icon: XCircle, variant: "red" as const },
    { label: "Memory records", value: data?.memory_records ?? 0, Icon: Database, variant: "gold" as const },
    { label: "Audit events", value: data?.audit_events ?? 0, Icon: Shield, variant: "purple" as const }
  ] as const;

  return (
    <Section
      title="Workspace Dashboard"
      subtitle="Live operational metrics refreshed every 15 seconds"
    >
      {/* Metrics Grid */}
      <div
        className="stagger-children"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}
      >
        {cards.map(({ label, value, Icon, variant }) => (
          <MetricCard
            key={label}
            label={label}
            value={isLoading ? "—" : value}
            icon={Icon}
            variant={variant}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Backend error */}
      {isError && (
        <div className="alert alert-error animate-fade-in-up" style={{ marginTop: 4 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Backend unavailable. Start the FastAPI service on port 8000.</span>
        </div>
      )}

      {/* Workspace status */}
      <div
        className="panel animate-fade-in-up"
        style={{ padding: 24, display: "grid", gap: 16 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="icon-box icon-box-primary">
            <Gauge size={18} />
          </div>
          <div>
            <strong style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
              Current Workspace
            </strong>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
              {documents.length} document{documents.length !== 1 ? "s" : ""} loaded for analysis
            </p>
          </div>
        </div>

        <hr className="divider" />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {report ? (
            <>
              <CheckCircle size={16} style={{ color: "var(--accent-tertiary)", marginTop: 2, flexShrink: 0 }} />
              <div style={{ display: "grid", gap: 4 }}>
                <span style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>
                  Latest report: <span className="gradient-text">{report.domain.domain}</span> decision
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge badge-primary">Confidence {report.confidence.overall}</span>
                  <span className={`badge ${report.mandatory_review ? "badge-warning" : "badge-success"}`}>
                    {report.mandatory_review ? "Mandatory review" : "Optional review"}
                  </span>
                  <span className="badge badge-purple">Status: {report.review_status}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle size={16} style={{ color: "var(--text-muted)", marginTop: 2, flexShrink: 0 }} />
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                No report generated yet. Upload documents and run an analysis to get started.
              </span>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
