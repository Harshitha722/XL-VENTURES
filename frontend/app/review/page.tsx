"use client";

import { useState, type ElementType } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Forward, Info, ShieldAlert, X, ShieldCheck, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { reviewDecision } from "@/lib/api";
import type { ReviewDecision } from "@/lib/types";
import { useDecisionStore } from "@/store/useDecisionStore";

const actions: Array<{
  Icon: ElementType;
  label: string;
  decision: ReviewDecision;
  variant: string;
  description: string;
}> = [
  { Icon: Check, label: "Approve", decision: "approve", variant: "btn-success", description: "Accept the AI recommendation" },
  { Icon: X, label: "Reject", decision: "reject", variant: "btn-danger", description: "Reject and block this decision" },
  { Icon: Info, label: "Request Info", decision: "request_information", variant: "btn-primary", description: "Request additional evidence" },
  { Icon: Forward, label: "Delegate", decision: "delegate", variant: "btn-ghost", description: "Pass to another reviewer" },
  { Icon: ShieldAlert, label: "Escalate", decision: "escalate", variant: "btn-warning", description: "Escalate to senior authority" }
];

export default function HumanReviewDashboard() {
  const report = useDecisionStore((state) => state.report);
  const [comments, setComments] = useState("");
  const mutation = useMutation({
    mutationFn: (decision: ReviewDecision) =>
      reviewDecision({ reportId: report?.id ?? "", decision, comments })
  });

  const confidenceVal = report ? parseFloat(report.confidence.overall) : 0;
  const confidencePercent = isNaN(confidenceVal) ? 0 : Math.min(100, confidenceVal > 1 ? confidenceVal : confidenceVal * 100);

  return (
    <Section
      title="Human Review Dashboard"
      subtitle="Authority gate — exercise human oversight on AI recommendations"
    >
      {report ? (
        <div style={{ display: "grid", gap: 16 }}>
          {/* Report summary */}
          <div className="panel panel-glow animate-fade-in-up" style={{ padding: 24, display: "grid", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="icon-box icon-box-primary animate-glow" style={{ width: 44, height: 44 }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  {report.domain.domain} Report
                </strong>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                  Under review — your decision is required
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="badge badge-primary">Confidence {report.confidence.overall}</span>
              <span className={`badge ${report.mandatory_review ? "badge-danger" : "badge-success"}`}>
                {report.mandatory_review ? "⚠ Mandatory review" : "✓ Optional review"}
              </span>
              <span className="badge badge-purple">Status: {report.review_status}</span>
            </div>

            {/* Confidence bar */}
            {confidencePercent > 0 && (
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
                  <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Confidence level</span>
                  <span className="gradient-text" style={{ fontWeight: 700 }}>{confidencePercent.toFixed(0)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${confidencePercent}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="panel" style={{ padding: 24, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="icon-box icon-box-purple" style={{ width: 36, height: 36 }}>
                <MessageSquare size={16} />
              </div>
              <div>
                <strong style={{ fontSize: 14, fontWeight: 700 }}>Reviewer Comments</strong>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                  Optional — comments are stored in audit history
                </p>
              </div>
            </div>
            <textarea
              className="form-input"
              placeholder="Add comments, conditions, or reasoning for your decision..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          {/* Action buttons */}
          <div className="panel" style={{ padding: 24, display: "grid", gap: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Review decision
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
              {actions.map(({ Icon, label, decision, variant, description }) => (
                <button
                  key={label}
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate(decision)}
                  className={`btn ${variant}`}
                  style={{
                    padding: "14px 16px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 6,
                    height: "auto",
                    textAlign: "left",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
                    <Icon size={16} />
                    {label}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7 }}>{description}</div>
                </button>
              ))}
            </div>

            {mutation.isPending && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                <span className="spinner" />
                Recording review decision...
              </div>
            )}

            {mutation.isSuccess && (
              <div className="alert alert-success animate-fade-in">
                <CheckCircle size={15} />
                <span>Review recorded in audit and feedback memory.</span>
              </div>
            )}

            {mutation.isError && (
              <div className="alert alert-error animate-fade-in">
                <AlertTriangle size={15} />
                <span>Review failed. The report may not exist on the backend session.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="panel"
          style={{
            padding: 56,
            display: "grid",
            placeItems: "center",
            gap: 16,
            textAlign: "center",
            background: "rgba(124, 58, 237, 0.02)"
          }}
        >
          <ShieldCheck size={44} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
          <div>
            <p style={{ color: "var(--text-muted)", margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>
              No report to review
            </p>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 13 }}>
              Run analysis before human review
            </p>
          </div>
        </div>
      )}
    </Section>
  );
}
