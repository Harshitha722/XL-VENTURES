"use client";

import { useState, type ElementType } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Send, XCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { recordCustomerOutcome } from "@/lib/api";
import type { CustomerOutcomeStatus, Recommendation } from "@/lib/types";
import { useDecisionStore } from "@/store/useDecisionStore";

const outcomeOptions: Array<{ status: CustomerOutcomeStatus; label: string; Icon: ElementType }> = [
  { status: "won", label: "Won", Icon: CheckCircle2 },
  { status: "lost", label: "Lost", Icon: XCircle },
  { status: "no_decision", label: "No decision", Icon: Clock3 },
  { status: "in_progress", label: "In progress", Icon: Send }
];

function splitBlockers(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function customerIdFromName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "customer";
}

export default function RecommendationsDashboard() {
  const report = useDecisionStore((state) => state.report);
  const queryClient = useQueryClient();
  const [customerName, setCustomerName] = useState("Demo customer");
  const [reason, setReason] = useState("Customer needs stronger ROI proof before buying");
  const [blockers, setBlockers] = useState("ROI proof, timing");
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (input: { item: Recommendation; outcome: CustomerOutcomeStatus }) =>
      recordCustomerOutcome({
        reportId: report?.id,
        recommendationTitle: input.item.title,
        customerName,
        customerId: customerIdFromName(customerName),
        domain: report?.domain.domain,
        outcome: input.outcome,
        reason,
        feedback: "Outcome recorded against: " + input.item.next_best_action,
        blockers: splitBlockers(blockers)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["outcomes"] });
      queryClient.invalidateQueries({ queryKey: ["memory"] });
    }
  });

  return (
    <Section title="Recommendations Dashboard">
      <div className="panel" style={{ padding: 18, display: "grid", gap: 12 }}>
        <strong>Customer outcome feedback</strong>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "var(--muted)" }}>Customer</span>
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} style={{ padding: 10, border: "1px solid var(--line)", borderRadius: 8 }} />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "var(--muted)" }}>Reason</span>
            <input value={reason} onChange={(event) => setReason(event.target.value)} style={{ padding: 10, border: "1px solid var(--line)", borderRadius: 8 }} />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "var(--muted)" }}>Blockers</span>
            <input value={blockers} onChange={(event) => setBlockers(event.target.value)} style={{ padding: 10, border: "1px solid var(--line)", borderRadius: 8 }} />
          </label>
        </div>
        {mutation.isSuccess ? <span>Outcome saved to audit, memory, and conversion metrics.</span> : null}
        {mutation.isError ? <span style={{ color: "var(--critical)" }}>Outcome save failed. Run a fresh analysis first.</span> : null}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {(report?.recommendations ?? []).map((item) => (
          <article className="panel" style={{ padding: 18, display: "grid", gap: 10 }} key={item.title}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <strong>{item.priority} - {item.title}</strong>
              <span>Confidence {item.confidence} | {item.deal_stage}</span>
            </div>
            <span><strong>Next best action:</strong> {item.next_best_action}</span>
            <span><strong>Conversion goal:</strong> {item.conversion_goal}</span>
            <span><strong>Objection response:</strong> {item.objection_response}</span>
            <span><strong>Success signal:</strong> {item.success_signal}</span>
            <span style={{ color: "var(--muted)" }}>{item.why}</span>
            <span>Owner {item.owner} | {item.timeline}</span>
            <span>Evidence: {item.evidence.map((evidence) => String(evidence.metadata.title ?? evidence.source_type)).join(", ")}</span>
            {item.human_modifications.length ? <span>Human changes: {item.human_modifications.join("; ")}</span> : null}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {outcomeOptions.map(({ status, label, Icon }) => (
                <button
                  key={status}
                  disabled={mutation.isPending}
                  onClick={() => {
                    setSelectedTitle(item.title);
                    mutation.mutate({ item, outcome: status });
                  }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--line)", borderRadius: 8, padding: "9px 11px", background: "white", cursor: "pointer" }}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
            {mutation.isPending && selectedTitle === item.title ? <span>Saving outcome...</span> : null}
          </article>
        ))}
        {!report ? <div className="panel" style={{ padding: 18 }}>Run analysis to populate recommendations.</div> : null}
      </div>
    </Section>
  );
}
