"use client";

import { useState, type ElementType } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Forward, Info, ShieldAlert, X } from "lucide-react";
import { Section } from "@/components/ui/section";
import { reviewDecision } from "@/lib/api";
import type { ReviewDecision } from "@/lib/types";
import { useDecisionStore } from "@/store/useDecisionStore";

const actions: Array<[ElementType, string, ReviewDecision]> = [
  [Check, "Approve", "approve"],
  [X, "Reject", "reject"],
  [Info, "Request Information", "request_information"],
  [Forward, "Delegate", "delegate"],
  [ShieldAlert, "Escalate", "escalate"]
];

export default function HumanReviewDashboard() {
  const report = useDecisionStore((state) => state.report);
  const [comments, setComments] = useState("");
  const mutation = useMutation({
    mutationFn: (decision: ReviewDecision) => reviewDecision({ reportId: report?.id ?? "", decision, comments })
  });

  return (
    <Section title="Human Review Dashboard">
      <div className="panel" style={{ padding: 18, display: "grid", gap: 14 }}>
        {report ? (
          <>
            <div style={{ display: "grid", gap: 6 }}>
              <strong>{report.domain.domain} report</strong>
              <span>Confidence {report.confidence.overall}. Review is {report.mandatory_review ? "mandatory" : "optional"}. Current status: {report.review_status}.</span>
            </div>
            <textarea placeholder="Reviewer comments" value={comments} onChange={(event) => setComments(event.target.value)} rows={3} style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 8 }} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {actions.map(([Icon, label, decision]) => (
                <button key={label} disabled={mutation.isPending} onClick={() => mutation.mutate(decision)} style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--line)", borderRadius: 8, padding: "10px 12px", background: "white", cursor: "pointer" }}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
            {mutation.isSuccess ? <span>Review recorded in audit and feedback memory.</span> : null}
            {mutation.isError ? <span style={{ color: "var(--critical)" }}>Review failed. The report may not exist on the backend session.</span> : null}
          </>
        ) : (
          <span>Run analysis before human review.</span>
        )}
      </div>
    </Section>
  );
}

