"use client";

import type { CSSProperties, ReactNode } from "react";

/** Screen container: centred column with the fade-up entry animation. */
export function Screen({
  maxWidth,
  gap = 20,
  paddingBottom = 64,
  children,
}: {
  maxWidth: number;
  gap?: number;
  paddingBottom?: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        padding: `32px 40px ${paddingBottom}px`,
        display: "flex",
        flexDirection: "column",
        gap,
        animation: "go-fadeup 300ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {children}
    </div>
  );
}

export const h1Style: CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: "-0.03em",
  lineHeight: 1.15,
};

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={h1Style}>{title}</h1>
        <span style={{ fontSize: 13, color: "#6C757D" }}>{subtitle}</span>
      </div>
      {action}
    </div>
  );
}
