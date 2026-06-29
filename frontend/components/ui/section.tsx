export function Section({
  title,
  children,
  action,
  subtitle
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section style={{ display: "grid", gap: 20, marginBottom: 28 }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">{title}</h1>
          {subtitle && (
            <p style={{ color: "var(--text-muted)", margin: "6px 0 0", fontSize: 13 }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
      <div className="animate-fade-in">
        {children}
      </div>
    </section>
  );
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  variant = "primary",
  loading = false
}: {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  variant?: "primary" | "purple" | "green" | "gold" | "red";
  loading?: boolean;
}) {
  const iconClass = {
    primary: "icon-box-primary",
    purple: "icon-box-purple",
    green: "icon-box-green",
    gold: "icon-box-gold",
    red: "icon-box-red"
  }[variant];

  return (
    <div className="panel animate-fade-in-up" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        {Icon && (
          <div className={`icon-box ${iconClass}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      {loading ? (
        <div className="skeleton" style={{ height: 36, width: "60%", marginBottom: 8 }} />
      ) : (
        <div className="metric-value">{value}</div>
      )}
      <div className="metric-label">{label}</div>
    </div>
  );
}
