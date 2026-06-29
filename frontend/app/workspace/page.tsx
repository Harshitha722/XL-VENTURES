"use client";

import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/ui/section";
import { getMetrics } from "@/lib/api";
import { useDecisionStore } from "@/store/useDecisionStore";

export default function WorkspaceDashboard() {
  const report = useDecisionStore((state) => state.report);
  const documents = useDecisionStore((state) => state.documents);
  const { data, isError, isLoading } = useQuery({ queryKey: ["metrics"], queryFn: getMetrics, refetchInterval: 15000 });
  const cards = [
    ["Reports", data?.reports ?? 0],
    ["Customer outcomes", data?.customer_outcomes ?? 0],
    ["Conversion rate", `${data?.deal_conversion_rate ?? 0}%`],
    ["Lost/no decision", (data?.lost_deals ?? 0) + (data?.no_decision_deals ?? 0)],
    ["Memory records", data?.memory_records ?? 0],
    ["Audit events", data?.audit_events ?? 0]
  ] as const;

  return (
    <Section title="Workspace Dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
        {cards.map(([label, value]) => (
          <div className="panel metric" key={label}>
            <span style={{ color: "var(--muted)" }}>{label}</span>
            <strong style={{ fontSize: 30 }}>{isLoading ? "..." : value}</strong>
          </div>
        ))}
      </div>
      {isError ? <div className="panel" style={{ padding: 18, color: "var(--critical)" }}>Backend unavailable. Start the FastAPI service on port 8000.</div> : null}
      <div className="panel" style={{ padding: 18, display: "grid", gap: 8 }}>
        <strong>Current workspace</strong>
        <span style={{ color: "var(--muted)" }}>{documents.length} document(s) loaded for analysis.</span>
        {report ? <span>Latest report: {report.domain.domain} decision, confidence {report.confidence.overall}, review {report.review_status}.</span> : <span>No report has been generated in this browser session.</span>}
      </div>
    </Section>
  );
}
