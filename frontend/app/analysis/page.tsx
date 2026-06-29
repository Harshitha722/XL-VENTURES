"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BrainCircuit } from "lucide-react";
import { analyzeDecision, sampleDocuments } from "@/lib/api";
import { useDecisionStore } from "@/store/useDecisionStore";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

const defaultTask = "Find the next best action to convert a qualified customer into a completed deal, and capture why they may not buy.";

export default function AnalysisDashboard() {
  const [task, setTask] = useState(defaultTask);
  const documents = useDecisionStore((state) => state.documents);
  const setDocuments = useDecisionStore((state) => state.setDocuments);
  const setReport = useDecisionStore((state) => state.setReport);
  const report = useDecisionStore((state) => state.report);
  const mutation = useMutation({
    mutationFn: () => analyzeDecision(task, documents.length ? documents : sampleDocuments()),
    onSuccess: (nextReport) => {
      if (!documents.length) {
        setDocuments(sampleDocuments());
      }
      setReport(nextReport);
    }
  });

  return (
    <Section title="Analysis Dashboard" action={<Button onClick={() => mutation.mutate()}><BrainCircuit size={16} /> Run analysis</Button>}>
      <div className="panel" style={{ padding: 18, display: "grid", gap: 12 }}>
        <strong>Domain detection and orchestration</strong>
        <textarea value={task} onChange={(event) => setTask(event.target.value)} rows={4} style={{ width: "100%", padding: 12, border: "1px solid var(--line)", borderRadius: 8 }} />
        <span style={{ color: "var(--muted)" }}>{mutation.isPending ? "Analyzing evidence..." : `${documents.length || 1} document(s) will be analyzed.`}</span>
        {mutation.isError ? <span style={{ color: "var(--critical)" }}>Backend unavailable. Start FastAPI on port 8000.</span> : null}
        {report ? (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              <div className="panel metric"><span>Domain</span><strong>{report.domain.domain}</strong></div>
              <div className="panel metric"><span>Confidence</span><strong>{report.confidence.overall}</strong></div>
              <div className="panel metric"><span>Review</span><strong>{report.mandatory_review ? "Mandatory" : "Optional"}</strong></div>
              <div className="panel metric"><span>Agents</span><strong>{report.agents.length}</strong></div>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <strong>Business reasoning</strong>
              <span>Risks: {report.reasoning.risks.slice(0, 3).join("; ")}</span>
              <span>Opportunities: {report.reasoning.opportunities.slice(0, 3).join("; ")}</span>
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
