"use client";

import { useQuery } from "@tanstack/react-query";
import { Section, MetricCard } from "@/components/ui/section";
import { getMemory, getMetrics, getOutcomes, getReports } from "@/lib/api";
import {
  FileText,
  Globe,
  Shield,
  Database,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Activity,
  User,
  Clock
} from "lucide-react";

function outcomeIcon(outcome: string) {
  if (outcome === "won") return { Icon: TrendingUp, color: "var(--accent-tertiary)", badge: "badge-success" };
  if (outcome === "lost") return { Icon: TrendingDown, color: "var(--accent-danger)", badge: "badge-danger" };
  return { Icon: Minus, color: "var(--accent-warning)", badge: "badge-warning" };
}

export default function AdminConsole() {
  const metrics = useQuery({ queryKey: ["admin-metrics"], queryFn: getMetrics, refetchInterval: 15000 });
  const reports = useQuery({ queryKey: ["reports"], queryFn: getReports, refetchInterval: 15000 });
  const memory = useQuery({ queryKey: ["memory"], queryFn: getMemory, refetchInterval: 15000 });
  const outcomes = useQuery({ queryKey: ["outcomes"], queryFn: getOutcomes, refetchInterval: 15000 });

  const metricCards = [
    { label: "Reports", value: metrics.data?.reports ?? 0, Icon: FileText, variant: "primary" as const },
    { label: "Domains available", value: metrics.data?.domains_available ?? 0, Icon: Globe, variant: "purple" as const },
    { label: "Audit events", value: metrics.data?.audit_events ?? 0, Icon: Shield, variant: "gold" as const },
    { label: "Memory records", value: metrics.data?.memory_records ?? 0, Icon: Database, variant: "green" as const },
    { label: "Customer outcomes", value: metrics.data?.customer_outcomes ?? 0, Icon: Users, variant: "primary" as const },
    { label: "Won deals", value: metrics.data?.won_deals ?? 0, Icon: TrendingUp, variant: "green" as const },
    { label: "Lost / no decision", value: (metrics.data?.lost_deals ?? 0) + (metrics.data?.no_decision_deals ?? 0), Icon: TrendingDown, variant: "red" as const },
    { label: "Conversion rate", value: `${metrics.data?.deal_conversion_rate ?? 0}%`, Icon: Activity, variant: "gold" as const }
  ] as const;

  return (
    <Section
      title="Admin Console"
      subtitle="Real-time operational analytics and backend state"
    >
      <div style={{ display: "grid", gap: 16 }}>
        {/* Metrics grid */}
        <div
          className="stagger-children"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}
        >
          {metricCards.map(({ label, value, Icon, variant }) => (
            <MetricCard
              key={label}
              label={label}
              value={metrics.isLoading ? "—" : value}
              icon={Icon}
              variant={variant}
              loading={metrics.isLoading}
            />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Runtime reports */}
          <div className="panel" style={{ padding: 24, display: "grid", gap: 14, alignContent: "start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="icon-box icon-box-primary" style={{ width: 36, height: 36 }}>
                <FileText size={16} />
              </div>
              <strong style={{ fontSize: 14, fontWeight: 700 }}>Runtime Reports</strong>
            </div>
            {reports.isLoading && (
              <div style={{ display: "grid", gap: 8 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 50, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            )}
            {(reports.data ?? []).length === 0 && !reports.isLoading && (
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
                No reports in the current backend session.
              </p>
            )}
            {(reports.data ?? []).map((report) => (
              <div
                key={report.id}
                className="animate-fade-in-up"
                style={{
                  padding: "10px 14px",
                  background: "rgba(5, 11, 21, 0.6)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  display: "grid",
                  gap: 6
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
                    {report.domain.domain}
                  </span>
                  <span className="badge badge-primary">{report.confidence.overall}</span>
                </div>
                <span className={`badge ${report.review_status === "approved" ? "badge-success" : report.review_status === "rejected" ? "badge-danger" : "badge-warning"}`} style={{ width: "fit-content" }}>
                  {report.review_status}
                </span>
              </div>
            ))}
          </div>

          {/* Customer outcome learning */}
          <div className="panel" style={{ padding: 24, display: "grid", gap: 14, alignContent: "start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="icon-box icon-box-green" style={{ width: 36, height: 36 }}>
                <Brain size={16} />
              </div>
              <strong style={{ fontSize: 14, fontWeight: 700 }}>Outcome Learning</strong>
            </div>
            {outcomes.isLoading && (
              <div style={{ display: "grid", gap: 8 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 60, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            )}
            {(outcomes.data ?? []).length === 0 && !outcomes.isLoading && (
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
                No customer outcomes recorded yet.
              </p>
            )}
            {(outcomes.data ?? []).slice(-6).map((outcome) => {
              const { Icon, color, badge } = outcomeIcon(outcome.outcome);
              return (
                <div
                  key={outcome.id}
                  className="animate-fade-in-up"
                  style={{
                    padding: "10px 14px",
                    background: "rgba(5, 11, 21, 0.6)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    display: "grid",
                    gap: 6
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <User size={12} style={{ color: "var(--text-muted)" }} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
                        {outcome.customer_name}
                      </span>
                    </div>
                    <span className={`badge ${badge}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon size={10} />
                      {outcome.outcome}
                    </span>
                  </div>
                  {outcome.learning_summary && (
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
                      {outcome.learning_summary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Memory and learning */}
        <div className="panel" style={{ padding: 24, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="icon-box icon-box-purple" style={{ width: 36, height: 36 }}>
              <Database size={16} />
            </div>
            <div>
              <strong style={{ fontSize: 14, fontWeight: 700 }}>Memory & Learning Records</strong>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                Recent adaptive memory from agent operations
              </p>
            </div>
          </div>
          {memory.isLoading && (
            <div style={{ display: "grid", gap: 8 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 50, animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          )}
          {(memory.data ?? []).length === 0 && !memory.isLoading && (
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
              No memory records yet.
            </p>
          )}
          <div style={{ display: "grid", gap: 8 }}>
            {(memory.data ?? []).slice(-6).map((record) => (
              <div
                key={record.id}
                className="animate-fade-in-up"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "10px 14px",
                  background: "rgba(5, 11, 21, 0.6)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                <span className="badge badge-purple" style={{ flexShrink: 0, marginTop: 1 }}>
                  {record.memory_type}
                </span>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {record.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
