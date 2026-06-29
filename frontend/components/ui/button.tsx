import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ElementType } from "react";
import Link from "next/link";

type Variant = "primary" | "ghost" | "danger" | "success" | "warning" | "purple";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ElementType;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
}

const sizeMap: Record<Size, string> = {
  sm: "padding: 7px 12px; font-size: 12px;",
  md: "padding: 10px 18px; font-size: 13.5px;",
  lg: "padding: 13px 24px; font-size: 15px;"
};

const sizeStyle: Record<Size, React.CSSProperties> = {
  sm: { padding: "7px 12px", fontSize: 12 },
  md: { padding: "10px 18px", fontSize: 13.5 },
  lg: { padding: "13px 24px", fontSize: 15 }
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`btn btn-${variant}`}
      style={{ ...sizeStyle[size], ...style }}
    >
      {loading ? (
        <span className="spinner" />
      ) : Icon ? (
        <Icon size={15} />
      ) : null}
      {children}
    </button>
  );
}

export function ButtonLink({ href, variant = "primary", size = "md", children, style, ...props }: ButtonLinkProps) {
  return (
    <Link href={href as any}>
      <span className={`btn btn-${variant}`} style={{ ...sizeStyle[size], ...style }}>
        {children}
      </span>
    </Link>
  );
}
