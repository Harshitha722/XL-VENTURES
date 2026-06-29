import { Section } from "@/components/ui/section";
import { API_BASE } from "@/lib/api";

export default function SettingsPage() {
  return (
    <Section title="Settings">
      <div className="panel" style={{ padding: 18, display: "grid", gap: 10 }}>
        <label>API base <input readOnly defaultValue={API_BASE} /></label>
        <label>MODEL_PROVIDER <input readOnly defaultValue="gemini" /></label>
        <label>Confidence review threshold <input readOnly type="number" defaultValue={70} /></label>
        <span style={{ color: "var(--muted)" }}>Model provider switching is controlled through backend environment variables.</span>
      </div>
    </Section>
  );
}
