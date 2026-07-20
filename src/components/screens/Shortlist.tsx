"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { FitPill, panelStyle, SizeBadge, thStyle } from "@/components/chips";
import { Icon, PersonIcon, Tick } from "@/components/icons";
import { PageHeader, Screen } from "@/components/Screen";
import { useApp } from "@/lib/store";

const grid = "40px 2.4fr 1.1fr 52px 60px 64px";

const sortHeaderStyle: CSSProperties = {
  ...thStyle,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const filterSelectStyle: CSSProperties = {
  fontFamily: "inherit",
  fontSize: 12.5,
  fontWeight: 500,
  padding: "7px 10px",
  border: "1.5px solid #E8ECF0",
  borderRadius: 6,
  background: "#fff",
  color: "#0A1628",
  outline: "none",
};

const SIZE_ORDER = { S: 1, M: 2, L: 3 } as const;

export function ShortlistScreen() {
  const router = useRouter();
  const { state, patch, update, businesses, openLead } = useApp();

  const curPromo =
    state.promotions.find((p) => p.id === state.currentPromoId) ??
    state.promotions[0];

  const typeOpts = ["All", ...[...new Set(businesses.map((b) => b.type))].sort()];

  let rows = businesses.filter(
    (b) =>
      (state.fType === "All" || b.type === state.fType) &&
      (state.fSize === "All" || b.sizeBand === state.fSize) &&
      (state.fContact === "All" ||
        b.contactMethod === state.fContact.toLowerCase()),
  );
  rows = [...rows].sort((a, b) => {
    const k = state.shortSort;
    const x =
      k === "fit"
        ? a.fit - b.fit
        : k === "size"
          ? SIZE_ORDER[a.sizeBand] - SIZE_ORDER[b.sizeBand]
          : String(a[k] ?? "").localeCompare(String(b[k] ?? ""));
    return x * state.shortDir;
  });

  const sortBy = (k: typeof state.shortSort) =>
    update((s) => ({
      shortSort: k,
      shortDir:
        s.shortSort === k ? ((-s.shortDir) as 1 | -1) : k === "fit" ? -1 : 1,
    }));
  const headerLabel = (k: typeof state.shortSort, label: string) =>
    label + (state.shortSort === k ? (state.shortDir < 0 ? " ↓" : " ↑") : "");

  const selCount = businesses.filter((b) => state.selected[b.id] && !b.dnc).length;

  return (
    <>
      <Screen maxWidth={1120} paddingBottom={110}>
        <PageHeader
          title="Shortlist"
          subtitle={
            <>
              {rows.length} of 15 matches for &quot;{curPromo.name}&quot; — click
              a column to sort
            </>
          }
          action={
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                value={state.fType}
                onChange={(e) => patch({ fType: e.target.value })}
                style={{ ...filterSelectStyle, maxWidth: 170 }}
              >
                {typeOpts.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <select
                value={state.fSize}
                onChange={(e) => patch({ fSize: e.target.value })}
                style={filterSelectStyle}
              >
                {["All", "S", "M", "L"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <select
                value={state.fContact}
                onChange={(e) => patch({ fContact: e.target.value })}
                style={filterSelectStyle}
              >
                {["All", "Email", "Named", "Phone"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          }
        />
        <div style={{ ...panelStyle, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: grid,
              gap: 12,
              padding: "9px 24px",
              borderBottom: "1px solid #E8ECF0",
              background: "#F9FAFC",
            }}
          >
            <span />
            <span className="go-dim" onClick={() => sortBy("name")} style={sortHeaderStyle}>
              {headerLabel("name", "Business")}
            </span>
            <span className="go-dim" onClick={() => sortBy("type")} style={sortHeaderStyle}>
              {headerLabel("type", "Type")}
            </span>
            <span className="go-dim" onClick={() => sortBy("size")} style={sortHeaderStyle}>
              {headerLabel("size", "Size")}
            </span>
            <span style={thStyle}>Contact</span>
            <span className="go-dim" onClick={() => sortBy("fit")} style={sortHeaderStyle}>
              {headerLabel("fit", "Fit")}
            </span>
          </div>
          {rows.map((b) => {
            const isDnc = b.dnc;
            const sel = !!state.selected[b.id] && !isDnc;
            const primary = b.contacts.find((c) => c.isPrimary);
            const contactTip =
              b.contactMethod === "named"
                ? `Named contact — ${primary?.name ?? ""}`
                : b.contactMethod === "email"
                  ? `Email found — ${b.email}`
                  : "Phone only — no published email";
            return (
              <div
                key={b.id}
                className="go-row"
                onClick={() => openLead(b.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: grid,
                  gap: 12,
                  alignItems: "center",
                  padding: "13px 24px",
                  borderBottom: "1px solid #F4F6FA",
                  cursor: "pointer",
                  ...(isDnc
                    ? { opacity: 0.45 }
                    : sel
                      ? { background: "rgba(0,194,168,0.035)" }
                      : {}),
                }}
              >
                <span
                  className={sel ? undefined : "go-box-off"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDnc) return;
                    update((s) => ({
                      selected: { ...s.selected, [b.id]: !s.selected[b.id] },
                    }));
                  }}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                    ...(sel ? { background: "#00C2A8" } : {}),
                  }}
                >
                  {sel && <Tick />}
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</span>
                    <span style={{ fontSize: 12, color: "#6C757D" }}>
                      {b.suburb}
                    </span>
                    {b.previouslyContacted && (
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "#9A5B00",
                          background: "rgba(255,170,0,0.12)",
                          borderRadius: 100,
                          padding: "2px 9px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Previously contacted ({b.previouslyContacted.period}) —{" "}
                        <span
                          style={{ textDecoration: "underline", cursor: "pointer" }}
                        >
                          view history
                        </span>
                      </span>
                    )}
                    {isDnc && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "#C03530",
                          background: "rgba(192,53,48,0.08)",
                          borderRadius: 100,
                          padding: "2px 9px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Icon kind="dnc" size={10} stroke="#C03530" strokeWidth={1.6} />
                        Do not contact
                      </span>
                    )}
                  </span>
                  {state.showRationale && b.rationale && (
                    <span
                      style={{ fontSize: 12.5, color: "#6C757D", lineHeight: 1.4 }}
                    >
                      {b.rationale}
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 13, color: "#6C757D" }}>{b.type}</span>
                <span>
                  <SizeBadge size={b.sizeBand} />
                </span>
                <span
                  title={contactTip}
                  style={{ cursor: "help", display: "inline-flex" }}
                >
                  {b.contactMethod === "email" && (
                    <Icon kind="mail" size={15} stroke="#6C757D" strokeWidth={1.3} />
                  )}
                  {b.contactMethod === "named" && <PersonIcon />}
                  {b.contactMethod === "phone" && (
                    <Icon kind="phone" size={15} stroke="#6C757D" strokeWidth={1.3} />
                  )}
                </span>
                <span>
                  <FitPill fit={b.fit} />
                </span>
              </div>
            );
          })}
        </div>
      </Screen>
      <div
        style={{
          position: "fixed",
          left: 224,
          right: 0,
          bottom: 0,
          background: "#fff",
          borderTop: "1.5px solid #E8ECF0",
          boxShadow: "0 -8px 32px rgba(10,22,40,0.06)",
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          zIndex: 4,
        }}
      >
        <span style={{ fontSize: 14 }}>
          <span style={{ fontWeight: 700 }}>{selCount} selected</span>{" "}
          <span style={{ color: "#6C757D" }}>
            — pre-ticked for top matches; do-not-contact rows are excluded
            automatically
          </span>
        </span>
        {selCount > 0 && (
          <button
            className="go-btn-primary"
            onClick={() => {
              const first = businesses.find(
                (b) => state.selected[b.id] && !b.dnc,
              );
              patch({ copySel: first ? first.id : null });
              router.push("/campaign-copy");
            }}
            style={{
              fontSize: 14,
              padding: "10px 22px",
              boxShadow: "0 4px 14px rgba(0,194,168,0.28)",
            }}
          >
            Add to campaign →
          </button>
        )}
      </div>
    </>
  );
}
