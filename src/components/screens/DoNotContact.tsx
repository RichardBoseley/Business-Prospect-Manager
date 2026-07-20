"use client";

import { panelStyle, thStyle } from "@/components/chips";
import { PadlockIcon } from "@/components/icons";
import { Screen, h1Style } from "@/components/Screen";
import { useApp } from "@/lib/store";

const grid = "2fr 1.4fr 1fr 40px";

export function DoNotContactScreen() {
  const { state, businesses, dncEntries } = useApp();

  const manualRows = businesses
    .filter((b) => state.dncAdded[b.id])
    .map((b) => ({
      businessName: b.name,
      detail: `${b.type} · ${b.suburb}`,
      reason: "Manual — added from lead detail",
      date: "18 Jul 2026",
    }));
  const rows = [...manualRows, ...dncEntries];

  return (
    <Screen maxWidth={860}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={h1Style}>Do not contact</h1>
        <span
          style={{
            fontSize: 13,
            color: "#6C757D",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <PadlockIcon />
          Permanently excluded from all current and future campaigns.
        </span>
      </div>
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
          <span style={thStyle}>Business</span>
          <span style={thStyle}>Reason</span>
          <span style={thStyle}>Added</span>
          <span />
        </div>
        {rows.map((r, i) => (
          <div
            key={r.businessName + i}
            style={{
              display: "grid",
              gridTemplateColumns: grid,
              gap: 12,
              alignItems: "center",
              padding: "14px 24px",
              borderBottom: "1px solid #F4F6FA",
            }}
          >
            <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {r.businessName}
              </span>
              <span style={{ fontSize: 12, color: "#6C757D" }}>{r.detail}</span>
            </span>
            <span style={{ fontSize: 13, color: "#6C757D" }}>{r.reason}</span>
            <span style={{ fontSize: 13, color: "#6C757D" }}>{r.date}</span>
            <span style={{ textAlign: "center" }}>
              <PadlockIcon size={14} stroke="#9AA5B1" />
            </span>
          </div>
        ))}
        <div
          style={{
            padding: "13px 24px",
            background: "#F9FAFC",
            fontSize: 12,
            color: "#6C757D",
          }}
        >
          Entries here can&apos;t be deleted — that&apos;s deliberate.
          Unsubscribes are honoured permanently under the Spam Act 2003.
        </div>
      </div>
    </Screen>
  );
}
