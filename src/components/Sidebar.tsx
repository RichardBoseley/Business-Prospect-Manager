"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useApp } from "@/lib/store";

const groupHeaderStyle = (first: boolean): CSSProperties => ({
  fontSize: 10,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: "#9AA5B1",
  cursor: "default",
  ...(first
    ? { padding: "0 10px 6px" }
    : {
        borderTop: "1px solid #F4F6FA",
        marginTop: 12,
        padding: "12px 10px 6px",
      }),
});

function NavItem({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { patch } = useApp();
  const active = pathname === href;
  return (
    <span
      className="go-nav"
      onClick={() => {
        patch({ drawerId: null });
        router.push(href);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        fontSize: 13.5,
        padding: "8px 10px",
        borderRadius: 6,
        cursor: "pointer",
        ...(active
          ? { fontWeight: 600, color: "#0A1628", background: "rgba(0,194,168,0.08)" }
          : { fontWeight: 500, color: "#6C757D" }),
      }}
    >
      {children}
    </span>
  );
}

export function Sidebar() {
  const { state } = useApp();
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 224,
        background: "#fff",
        borderRight: "1.5px solid #E8ECF0",
        display: "flex",
        flexDirection: "column",
        padding: "18px 12px 16px",
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "2px 10px 16px",
        }}
      >
        <Image
          src="/smallteam-robologo.png"
          alt="smallteam.ai"
          width={30}
          height={30}
          style={{ height: 30, width: "auto", flex: "none" }}
        />
        <span
          style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}
        >
          <span
            style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            outreach
          </span>
          <span style={{ fontSize: 10.5, color: "#6C757D" }}>
            by{" "}
            <span style={{ fontWeight: 700, color: "#0A1628" }}>
              smallteam
              <span style={{ color: "#00C2A8", fontWeight: 800 }}>.ai</span>
            </span>
          </span>
        </span>
      </div>
      <span style={groupHeaderStyle(true)}>Overview</span>
      <NavItem href="/dashboard">
        Dashboard
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 700,
            color: "#9A5B00",
            background: "rgba(255,170,0,0.12)",
            borderRadius: 100,
            padding: "1px 8px",
          }}
        >
          4
        </span>
      </NavItem>
      <span style={groupHeaderStyle(false)}>Campaigns</span>
      <NavItem href="/promotions">Promotions</NavItem>
      <NavItem href="/find">Find businesses</NavItem>
      <NavItem href="/shortlist">Shortlist</NavItem>
      <NavItem href="/campaign-copy">Campaign copy</NavItem>
      <span style={groupHeaderStyle(false)}>CRM</span>
      <NavItem href="/pipeline">Pipeline</NavItem>
      <NavItem href="/do-not-contact">Do not contact</NavItem>
      <span style={groupHeaderStyle(false)}>Workspace</span>
      <NavItem href="/settings">Settings</NavItem>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "0 10px",
        }}
      >
        <div
          style={{
            borderTop: "1px solid #E8ECF0",
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#9AA5B1",
            }}
          >
            Workspace
          </span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            Game On Entertainment Centre
          </span>
          <span style={{ fontSize: 11, color: "#6C757D" }}>
            Cranbourne West VIC · 2 venues
          </span>
          {state.authEnabled && (
            <a
              href="/api/auth/logout"
              className="go-dim"
              style={{ fontSize: 11, fontWeight: 600, paddingTop: 4 }}
            >
              Sign out
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
