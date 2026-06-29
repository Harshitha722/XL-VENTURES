import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: 0,
        borderRadius: 8,
        padding: "10px 14px",
        background: "var(--accent)",
        color: "white",
        cursor: "pointer",
        fontWeight: 700,
        ...props.style
      }}
    />
  );
}
