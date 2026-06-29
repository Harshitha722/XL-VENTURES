"use client";

import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/ui/section";
import { getAudit } from "@/lib/api";

export default function AuditTimeline() {
  const { data, isError, isLoading } = useQuery({ queryKey: ["audit"], queryFn: getAudit, refetchInterval: 10000 });
  return (
    <Section title="Audit Timeline">
      <div className="panel" style={{ padding: 18, display: "grid", gap: 12 }}>
        {isLoading ? <span>Loading audit events...</span> : null}
        {isError ? <span style={{ color: "var(--critical)" }}>Unable to load audit events.</span> : null}
        {(data ?? []).map((event) => (
          <div key={event.id} style={{ borderLeft: "3px solid var(--accent)", paddingLeft: 12, display: "grid", gap: 4 }}>
            <strong>{event.event_type}</strong>
            <span style={{ color: "var(--muted)" }}>{new Date(event.timestamp).toLocaleString()}</span>
            <span>Hash {event.event_hash?.slice(0, 16) ?? "pending"}</span>
            {event.comments ? <span>{event.comments}</span> : null}
          </div>
        ))}
        {!isLoading && !data?.length ? <span>No audit events yet.</span> : null}
      </div>
    </Section>
  );
}
