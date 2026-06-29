"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Zap, Sparkles, Target, AlertTriangle, ChevronRight, Cpu, ShieldCheck, Users, Layers } from "lucide-react";
import { analyzeDecision, sampleDocuments } from "@/lib/api";
import { useDecisionStore } from "@/store/useDecisionStore";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

const defaultTask =
  "Analyze the provided evidence, identify key risks and opportunities, and recommend the best course of action.";

export default function AnalysisDashboard() {
  const [task, setTask] = useState(defaultTask);
  const documents = useDecisionStore((state) => state.documents);
  const setDocuments = useDecisionStore((state) => state.setDocuments);
  const setReport = useDecisionStore((state) => state.setReport);
  const report = useDecisionStore((state) => state.report);

  const mutation = useMutation({
    mutationFn: () => {
      let docsToAnalyze = documents;
      if (!docsToAnalyze.length) {
        if (task.trim() && task !== defaultTask) {
          docsToAnalyze = [
            {
              id: crypto.randomUUID(),
              title: "Direct Input",
              source_type: "other",
              text: "User provided input: " + task,
              metadata: { direct_input: true },
              created_at: new Date().toISOString()
            }
          ];
        } else {
          docsToAnalyze = sampleDocuments();
        }
      }
      return analyzeDecision(task, docsToAnalyze);
    },
    onSuccess: (nextReport) => {
      if (!documents.length && task === defaultTask) setDocuments(sampleDocuments());
      setReport(nextReport);
    }
  });

  const confidenceVal = report ? parseFloat(report.confidence.overall) : 0;
  const confidencePercent = isNaN(confidenceVal) ? 0 : Math.min(100, confidenceVal > 1 ? confidenceVal : confidenceVal * 100);

  return (
    <Section
      title="Analysis Dashboard"
      subtitle="Agentic multi-domain decision intelligence"
      action={
        <Button
          variant="primary"
          size="md"
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
          icon={Zap}
        >
          {mutation.isPending ? "Analyzing..." : "Run Analysis"}
        </Button>
      }
    >
      <div style={{ display: "grid", gap: 16 }}>
        {/* Task input */}
        <div className="panel" style={{ padding: 24, display: "grid", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="icon-box icon-box-primary animate-glow">
              <Target size={18} />
            </div>
            <div>
              <strong style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                Domain detection & orchestration
              </strong>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                Describe the decision task — agents will auto-configure for the domain
              </p>
            </div>
          </div>

          <textarea
            className="form-input"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            rows={4}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {mutation.isPending ? (
                <span className="status-dot online" style={{ color: "var(--accent-primary)", fontSize: 13 }}>
                  Analyzing evidence...
                </span>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge badge-primary">
                    {documents.length || 1} doc{(documents.length || 1) !== 1 ? "s" : ""}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>queued:</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                    {documents.length > 0 
                      ? documents.map(d => d.title).join(", ") 
                      : (task !== defaultTask ? "Direct task input" : "Sample customer transcript")}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="primary"
              loading={mutation.isPending}
              onClick={() => mutation.mutate()}
              icon={Zap}
            >
              {mutation.isPending ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>

          {mutation.isError && (() => {
            // Try to extract the structured meaningfulness guard error
            const err = mutation.error as any;
            let detail = null;
            try {
              const parsed = JSON.parse(err.message);
              detail = parsed.detail;
            } catch (e) {
              // Not JSON or no detail
            }
            const isMeaningless = typeof detail === "object" && detail?.error === "meaningless_input";
            return isMeaningless ? (
              <div className="animate-fade-in" style={{ display: "grid", gap: 12 }}>
                <div className="alert alert-error">
                  <AlertTriangle size={15} />
                  <strong>Input rejected — not meaningful business content</strong>
                </div>
                <div className="panel" style={{ padding: 20, display: "grid", gap: 10, borderColor: "rgba(239,68,68,0.25)" }}>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    <strong style={{ color: "var(--text-primary)" }}>Reason:</strong> {detail.reason}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    💡 <em>{detail.hint}</em>
                  </p>
                </div>
              </div>
            ) : (
              <div className="alert alert-error animate-fade-in">
                <AlertTriangle size={15} />
                <span>
                  {err?.message?.includes("422")
                    ? "The input was rejected. Please provide a meaningful business task and evidence."
                    : "Backend unavailable. Start FastAPI on port 8000."}
                </span>
              </div>
            );
          })()}
        </div>

        {/* Results */}
        {report && (
          <div style={{ display: "grid", gap: 14 }} className="animate-fade-in-up">
            {/* Metric summary cards */}
            <div
              className="stagger-children"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}
            >
              {[
                { label: "Domain", value: report.domain.domain, Icon: Layers, color: "icon-box-primary" },
                { label: "Confidence", value: report.confidence.overall, Icon: Target, color: "icon-box-green" },
                { label: "Review", value: report.mandatory_review ? "Mandatory" : "Optional", Icon: ShieldCheck, color: report.mandatory_review ? "icon-box-red" : "icon-box-green" },
                { label: "Agents", value: String(report.agents.length), Icon: Cpu, color: "icon-box-purple" }
              ].map(({ label, value, Icon, color }) => (
                <div key={label} className="panel animate-fade-in-up" style={{ padding: 18, display: "grid", gap: 10 }}>
                  <div className={`icon-box ${color}`} style={{ width: 36, height: 36 }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Confidence progress */}
            {confidencePercent > 0 && (
              <div className="panel" style={{ padding: 20, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                    Confidence score
                  </span>
                  <span className="gradient-text" style={{ fontWeight: 800, fontSize: 18 }}>
                    {report.confidence.overall}
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${confidencePercent}%` }} />
                </div>
              </div>
            )}

            {/* Business reasoning */}
            <div className="panel" style={{ padding: 24, display: "grid", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="icon-box icon-box-gold">
                  <Users size={18} />
                </div>
                <strong style={{ fontSize: 15, fontWeight: 700 }}>Business Reasoning</strong>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    ⚠ Risks
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {report.reasoning.risks.slice(0, 3).map((risk, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                        <ChevronRight size={13} style={{ color: "var(--accent-danger)", marginTop: 2, flexShrink: 0 }} />
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    ✦ Opportunities
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {report.reasoning.opportunities.slice(0, 3).map((opp, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                        <ChevronRight size={13} style={{ color: "var(--accent-tertiary)", marginTop: 2, flexShrink: 0 }} />
                        {opp}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!report && !mutation.isPending && (
          <div
            className="panel"
            style={{
              padding: 40,
              display: "grid",
              placeItems: "center",
              gap: 16,
              textAlign: "center",
              background: "rgba(0, 212, 255, 0.02)"
            }}
          >
            <Zap size={40} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
            <div>
              <p style={{ color: "var(--text-muted)", margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>
                No analysis yet
              </p>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 13 }}>
                Click Run Analysis to start agentic decision intelligence
              </p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
