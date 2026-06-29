"use client";

import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/ui/section";
import { getDomains } from "@/lib/api";

export default function KnowledgeBase() {
  const { data, isError, isLoading } = useQuery({ queryKey: ["domains"], queryFn: getDomains });
  return (
    <Section title="Knowledge Base">
      <div style={{ display: "grid", gap: 12 }}>
        {isLoading ? <div className="panel" style={{ padding: 18 }}>Loading domain ontologies...</div> : null}
        {isError ? <div className="panel" style={{ padding: 18, color: "var(--critical)" }}>Unable to load ontology catalog.</div> : null}
        {(data ?? []).map((domain) => (
          <article className="panel" style={{ padding: 18, display: "grid", gap: 8 }} key={domain.domain}>
            <strong>{domain.domain.replace("_", " ")}</strong>
            <span style={{ color: "var(--muted)" }}>{domain.description}</span>
            <span>Goals: {domain.business_goals.join("; ")}</span>
            <span>Capabilities: {domain.agent_capabilities.join(", ")}</span>
            <span>Scenarios: {domain.scenario_count}</span>
          </article>
        ))}
      </div>
    </Section>
  );
}
