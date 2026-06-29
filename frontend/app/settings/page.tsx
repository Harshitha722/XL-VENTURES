import { Section } from "@/components/ui/section";
import { API_BASE } from "@/lib/api";
import { Settings, Server, Brain, Sliders, Info } from "lucide-react";

const settingsGroups = [
  {
    title: "API Configuration",
    Icon: Server,
    iconClass: "icon-box-primary",
    items: [
      { label: "API Base URL", value: API_BASE, readOnly: true, type: "text" },
      { label: "MODEL_PROVIDER", value: "gemini", readOnly: true, type: "text" }
    ]
  },
  {
    title: "Intelligence Settings",
    Icon: Brain,
    iconClass: "icon-box-purple",
    items: [
      { label: "Confidence review threshold", value: 70, readOnly: true, type: "number" }
    ]
  }
];

export default function SettingsPage() {
  return (
    <Section
      title="Settings"
      subtitle="Platform configuration and runtime environment"
    >
      <div style={{ display: "grid", gap: 16 }}>
        {settingsGroups.map(({ title, Icon, iconClass, items }) => (
          <div key={title} className="panel" style={{ padding: 24, display: "grid", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className={`icon-box ${iconClass}`} style={{ width: 40, height: 40 }}>
                <Icon size={18} />
              </div>
              <strong style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                {title}
              </strong>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {items.map(({ label, value, readOnly, type }) => (
                <label key={label} className="form-label">
                  <span className="form-label-text">{label}</span>
                  <input
                    readOnly={readOnly}
                    defaultValue={value}
                    type={type}
                    className="form-input"
                    style={{ opacity: readOnly ? 0.7 : 1, cursor: readOnly ? "not-allowed" : "text" }}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Info notice */}
        <div className="alert alert-info">
          <Info size={15} />
          <span>
            Model provider switching is controlled through backend environment variables.
            Restart the FastAPI service after changing environment configuration.
          </span>
        </div>
      </div>
    </Section>
  );
}
