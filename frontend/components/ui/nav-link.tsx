"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ElementType } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  Icon: ElementType;
}

export function NavLink({ href, label, Icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`nav-link${isActive ? " active" : ""}`}
    >
      <span className="nav-icon">
        <Icon size={17} />
      </span>
      <span>{label}</span>
      {isActive && (
        <span
          style={{
            marginLeft: "auto",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent-primary)",
            boxShadow: "0 0 8px var(--accent-primary)",
            flexShrink: 0,
          }}
        />
      )}
    </Link>
  );
}
