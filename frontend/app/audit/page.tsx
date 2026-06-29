"use client";

import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/ui/section";
import { getAudit } from "@/lib/api";
import { Archive, AlertTriangle, Hash, Clock, Tag } from "lucide-react";

const eventTypeColor = (eventType: string) => {
  const e = eventType?.toLowerCase();
  if (e?.includes("approve")) return { dot: "#10b981", badge: "badge-success" };
  if (e?.includes("reject") || e?.includes("error")) return { dot: "#ef4444", badge: "badge-danger" };
  if (e?.includes("escalat")) return { dot: "#f59e0b", badge: "badge-warning" };
  if (e?.includes("upload") || e?.includes("ingest")) return { dot: "#00d4ff", badge: "badge-primary" };
  return { dot: "#a78bfa", badge: "badge-purple" };
};

export default function AuditTimeline() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["audit"],
    queryFn: getAudit,
    refetchInterval: 10000
  });

  return (
    <Section
      title="Audit Timeline"
      subtitle="Immutable event history with cryptographic hashes"
    >
      <div className="panel" style={{ padding: 24, display: "grid", gap: 0 }}>
        {isLoading && (
          <div style={{ display: "grid", gap: 16, padding: "8px 0" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 70, animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        )}

        {isError && (
          <div className="alert alert-error">
            <AlertTriangle size={15} />
            <span>Unable to load audit events.</span>
          </div>
        )}

        {!isLoading && !isError && !data?.length && (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              gap: 16,
              padding: "48px 0",
              textAlign: "center"
            }}
          >
            <Archive size={40} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
            <div>
              <p style={{ color: "var(--text-muted)", margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>
                No audit events yet
              </p>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 13 }}>
                Events will appear as analysis and reviews are performed
              </p>
            </div>
          </div>
        )}

        {(data ?? []).length > 0 && (
          <div style={{ padding: "8px 0" }}>
            {(data ?? []).map((event, idx) => {
              const { dot, badge } = eventTypeColor(event.event_type);
              return (
                <div
                  key={event.id}
                  className="timeline-item animate-fade-in-up"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                    borderLeftColor: dot
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className={`badge ${badge}`}>
                        <Tag size={10} />
                        {event.event_type}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
                      <Clock size={12} />
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: event.comments ? 6 : 0 }}>
                    <Hash size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    <span className="mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {event.event_hash?.slice(0, 20) ?? "pending"}...
                    </span>
                  </div>

                  {event.comments && (
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic" }}>
                      "{event.comments}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}
