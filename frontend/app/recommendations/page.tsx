"use client";

import { useState, type ElementType } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Send, XCircle, ClipboardList, AlertTriangle, CheckCircle, User, Tag, ShieldAlert, ChevronRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { recordCustomerOutcome } from "@/lib/api";
import type { CustomerOutcomeStatus, Recommendation } from "@/lib/types";
import { useDecisionStore } from "@/store/useDecisionStore";

const outcomeOptions: Array<{
  status: CustomerOutcomeStatus;
  label: string;
  Icon: ElementType;
  variant: string;
}> = [
  { status: "won", label: "Won", Icon: CheckCircle2, variant: "btn-success" },
  { status: "lost", label: "Lost", Icon: XCircle, variant: "btn-danger" },
  { status: "no_decision", label: "No Decision", Icon: Clock3, variant: "btn-warning" },
  { status: "in_progress", label: "In Progress", Icon: Send, variant: "btn-ghost" }
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

  const priorityColor = (priority: string) => {
    const p = priority?.toLowerCase();
    if (p?.includes("high") || p === "1") return "badge-danger";
    if (p?.includes("med") || p === "2") return "badge-warning";
    return "badge-success";
  };

  return (
    <Section
      title="Recommendations Dashboard"
      subtitle="AI-generated next-best-actions with outcome tracking"
    >
      <div style={{ display: "grid", gap: 16 }}>
        {/* Customer outcome feedback form */}
        <div className="panel" style={{ padding: 24, display: "grid", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="icon-box icon-box-primary">
              <User size={18} />
            </div>
            <div>
              <strong style={{ fontSize: 15, fontWeight: 700 }}>Customer Outcome Feedback</strong>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                Record outcome against a recommendation below
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <label className="form-label">
              <span className="form-label-text">Customer name</span>
              <input
                className="form-input"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </label>
            <label className="form-label">
              <span className="form-label-text">Reason</span>
              <input
                className="form-input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
            <label className="form-label">
              <span className="form-label-text">Blockers (comma separated)</span>
              <input
                className="form-input"
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
              />
            </label>
          </div>

          {mutation.isSuccess && (
            <div className="alert alert-success animate-fade-in">
              <CheckCircle size={15} />
              <span>Outcome saved to audit, memory, and conversion metrics.</span>
            </div>
          )}
          {mutation.isError && (
            <div className="alert alert-error animate-fade-in">
              <AlertTriangle size={15} />
              <span>Outcome save failed. Run a fresh analysis first.</span>
            </div>
          )}
        </div>

        {/* Recommendation cards */}
        {(report?.recommendations ?? []).length > 0 ? (
          <div className="stagger-children" style={{ display: "grid", gap: 14 }}>
            {(report?.recommendations ?? []).map((item, idx) => (
              <article
                key={item.title}
                className="rec-card animate-fade-in-up"
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="icon-box icon-box-primary" style={{ width: 36, height: 36, flexShrink: 0 }}>
                      <ClipboardList size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", display: "block" }}>
                        {item.title}
                      </strong>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.deal_stage}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                    <span className={`badge ${priorityColor(item.priority)}`}>
                      <ShieldAlert size={10} />
                      {item.priority}
                    </span>
                    <span className="badge badge-primary">Conf. {item.confidence}</span>
                  </div>
                </div>

                <hr className="divider" />

                {/* Details grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Next best action", value: item.next_best_action },
                    { label: "Conversion goal", value: item.conversion_goal },
                    { label: "Objection response", value: item.objection_response },
                    { label: "Success signal", value: item.success_signal }
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <ChevronRight size={13} style={{ color: "var(--accent-primary)", marginTop: 2, flexShrink: 0 }} />
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Why and meta */}
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>
                  {item.why}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge badge-purple">
                    <User size={10} /> {item.owner}
                  </span>
                  <span className="badge badge-warning">
                    <Clock3 size={10} /> {item.timeline}
                  </span>
                  {item.evidence.length > 0 && (
                    <span className="badge badge-primary">
                      <Tag size={10} /> {item.evidence.map((e) => String(e.metadata.title ?? e.source_type)).join(", ")}
                    </span>
                  )}
                </div>

                {item.human_modifications.length > 0 && (
                  <div className="alert alert-info" style={{ padding: "8px 12px" }}>
                    <span style={{ fontSize: 12 }}>Human edits: {item.human_modifications.join("; ")}</span>
                  </div>
                )}

                {/* Outcome action buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {outcomeOptions.map(({ status, label, Icon, variant }) => (
                    <button
                      key={status}
                      disabled={mutation.isPending}
                      onClick={() => {
                        setSelectedTitle(item.title);
                        mutation.mutate({ item, outcome: status });
                      }}
                      className={`btn ${variant}`}
                      style={{ padding: "8px 14px", fontSize: 13 }}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>

                {mutation.isPending && selectedTitle === item.title && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                    <span className="spinner" />
                    Saving outcome...
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div
            className="panel"
            style={{
              padding: 48,
              display: "grid",
              placeItems: "center",
              gap: 16,
              textAlign: "center",
              background: "rgba(0, 212, 255, 0.02)"
            }}
          >
            <ClipboardList size={40} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
            <div>
              <p style={{ color: "var(--text-muted)", margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>
                No recommendations yet
              </p>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 13 }}>
                Run analysis to populate AI-generated recommendations
              </p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
