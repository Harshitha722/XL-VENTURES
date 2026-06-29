"use client";

import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/ui/section";
import { getMemory, getMetrics, getOutcomes, getReports } from "@/lib/api";

export default function AdminConsole() {
  const metrics = useQuery({ queryKey: ["admin-metrics"], queryFn: getMetrics, refetchInterval: 15000 });
  const reports = useQuery({ queryKey: ["reports"], queryFn: getReports, refetchInterval: 15000 });
  const memory = useQuery({ queryKey: ["memory"], queryFn: getMemory, refetchInterval: 15000 });
  const outcomes = useQuery({ queryKey: ["outcomes"], queryFn: getOutcomes, refetchInterval: 15000 });

  return (
    <Section title="Admin Console">
      <div style={{ display: "grid", gap: 12 }}>
        <div className="panel" style={{ padding: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <span>Reports: <strong>{metrics.data?.reports ?? 0}</strong></span>
          <span>Domains: <strong>{metrics.data?.domains_available ?? 0}</strong></span>
          <span>Audit events: <strong>{metrics.data?.audit_events ?? 0}</strong></span>
          <span>Memory records: <strong>{metrics.data?.memory_records ?? 0}</strong></span>
          <span>Customer outcomes: <strong>{metrics.data?.customer_outcomes ?? 0}</strong></span>
          <span>Won deals: <strong>{metrics.data?.won_deals ?? 0}</strong></span>
          <span>Lost/no decision: <strong>{(metrics.data?.lost_deals ?? 0) + (metrics.data?.no_decision_deals ?? 0)}</strong></span>
          <span>Conversion rate: <strong>{metrics.data?.deal_conversion_rate ?? 0}%</strong></span>
        </div>
        <div className="panel" style={{ padding: 18, display: "grid", gap: 8 }}>
          <strong>Runtime reports</strong>
          {(reports.data ?? []).map((report) => (
            <span key={report.id}>{report.domain.domain} - confidence {report.confidence.overall} - review {report.review_status}</span>
          ))}
          {!reports.data?.length ? <span style={{ color: "var(--muted)" }}>No reports in the current backend session.</span> : null}
        </div>
        <div className="panel" style={{ padding: 18, display: "grid", gap: 8 }}>
          <strong>Customer outcome learning</strong>
          {(outcomes.data ?? []).slice(-6).map((outcome) => (
            <span key={outcome.id}>{outcome.customer_name} - {outcome.outcome}: {outcome.learning_summary}</span>
          ))}
          {!outcomes.data?.length ? <span style={{ color: "var(--muted)" }}>No customer outcomes recorded yet.</span> : null}
        </div>
        <div className="panel" style={{ padding: 18, display: "grid", gap: 8 }}>
          <strong>Memory and learning</strong>
          {(memory.data ?? []).slice(-6).map((record) => (
            <span key={record.id}>{record.memory_type}: {record.summary}</span>
          ))}
          {!memory.data?.length ? <span style={{ color: "var(--muted)" }}>No memory records yet.</span> : null}
        </div>
      </div>
    </Section>
  );
}
