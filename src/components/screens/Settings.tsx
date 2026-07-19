"use client";

import type { CSSProperties } from "react";
import { panelStyle } from "@/components/chips";
import { Tick } from "@/components/icons";
import { PageHeader, Screen } from "@/components/Screen";
import { useApp } from "@/lib/store";

const sectionPanelStyle: CSSProperties = {
  ...panelStyle,
  padding: "20px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 17,
  fontWeight: 600,
  letterSpacing: "-0.02em",
};

export function SettingsScreen() {
  const { state, patch, update } = useApp();
  const primIdx = Math.min(state.primaryVen, state.venues.length - 1);

  const addArea = () => {
    const v = state.areaInput.trim();
    if (!v) return;
    update((s) => ({
      areas: v in s.areas ? s.areas : { ...s.areas, [v]: true },
      areaInput: "",
    }));
  };
  const addVenue = () => {
    const name = state.venName.trim();
    if (!name) return;
    update((s) => ({
      venues: [
        ...s.venues,
        {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          address: s.venAddr.trim() || "—",
        },
      ],
      venName: "",
      venAddr: "",
    }));
  };

  return (
    <Screen maxWidth={860}>
      <PageHeader
        title="Settings"
        subtitle="Workspace defaults used across searches and campaigns"
      />
      <div style={sectionPanelStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2 style={sectionTitleStyle}>Venues</h2>
          <span style={{ fontSize: 12.5, color: "#6C757D" }}>
            &quot;Distance from venue&quot; searches measure from the venue you
            pick — the primary is the default.
          </span>
        </div>
        {state.venues.map((v, i) => (
          <div
            key={v.id + i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid #F4F6FA",
              borderRadius: 8,
              padding: "11px 14px",
            }}
          >
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                flex: 1,
                minWidth: 0,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{v.name}</span>
                {i === primIdx && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#00775f",
                      background: "rgba(0,194,168,0.12)",
                      borderRadius: 100,
                      padding: "1px 8px",
                    }}
                  >
                    Primary
                  </span>
                )}
              </span>
              <span style={{ fontSize: 12, color: "#6C757D" }}>{v.address}</span>
            </span>
            {i !== primIdx && (
              <>
                <span
                  className="go-link"
                  onClick={() => patch({ primaryVen: i, venueSel: null })}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Make primary
                </span>
                <span
                  className="go-fade70"
                  onClick={() =>
                    update((s) => ({
                      venues: s.venues.filter((_, j) => j !== i),
                      primaryVen:
                        i < primIdx ? primIdx - 1 : i === primIdx ? 0 : primIdx,
                      venueSel: null,
                    }))
                  }
                  style={{ fontSize: 12, fontWeight: 600, color: "#C03530" }}
                >
                  Remove
                </span>
              </>
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            className="go-input"
            value={state.venName}
            onChange={(e) => patch({ venName: e.target.value })}
            placeholder="Venue name"
            style={{ fontSize: 13, padding: "8px 12px", flex: 1, minWidth: 160 }}
          />
          <input
            className="go-input"
            value={state.venAddr}
            onChange={(e) => patch({ venAddr: e.target.value })}
            placeholder="Address"
            style={{ fontSize: 13, padding: "8px 12px", flex: 2, minWidth: 200 }}
          />
          <button
            className="go-btn-secondary"
            onClick={addVenue}
            style={{ fontSize: 13, padding: "8px 16px" }}
          >
            Add venue
          </button>
        </div>
      </div>
      <div style={sectionPanelStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2 style={sectionTitleStyle}>Named areas</h2>
          <span style={{ fontSize: 12.5, color: "#6C757D" }}>
            The area list offered in &quot;Find businesses&quot; — add the
            suburbs and regions you target.
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.keys(state.areas).map((a) => (
            <span
              key={a}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                fontWeight: 500,
                background: "#fff",
                border: "1.5px solid #E8ECF0",
                borderRadius: 100,
                padding: "6px 8px 6px 13px",
              }}
            >
              {a}
              <span
                className="go-x"
                onClick={() =>
                  update((s) => {
                    const areas = { ...s.areas };
                    delete areas[a];
                    return { areas };
                  })
                }
                style={{ fontSize: 12, lineHeight: 1, padding: "1px 4px" }}
              >
                ✕
              </span>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, maxWidth: 340 }}>
          <input
            className="go-input"
            value={state.areaInput}
            onChange={(e) => patch({ areaInput: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") addArea();
            }}
            placeholder="Add an area…"
            style={{ fontSize: 13, padding: "8px 12px", flex: 1 }}
          />
          <button
            className="go-btn-secondary"
            onClick={addArea}
            style={{ fontSize: 13, padding: "8px 15px" }}
          >
            Add
          </button>
        </div>
      </div>
      <div style={sectionPanelStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2 style={sectionTitleStyle}>Sending</h2>
          <span style={{ fontSize: 12.5, color: "#6C757D" }}>
            Campaigns send in daily batches — keep the cap modest so replies
            stay manageable.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 520 }}>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={state.dailyLimit}
            onChange={(e) => patch({ dailyLimit: +e.target.value })}
            style={{ flex: 1 }}
          />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              minWidth: 110,
              textAlign: "right",
              color: "#00775f",
            }}
          >
            {state.dailyLimit} emails/day
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderTop: "1px solid #F4F6FA",
            paddingTop: 14,
            cursor: "pointer",
          }}
          onClick={() => update((s) => ({ showRationale: !s.showRationale }))}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              flex: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              ...(state.showRationale
                ? { background: "#00C2A8" }
                : { background: "#fff", border: "1.5px solid #D6DCE3" }),
            }}
          >
            {state.showRationale && <Tick />}
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>
              Show fit rationale on the shortlist
            </span>
            <span style={{ fontSize: 12, color: "#6C757D" }}>
              A one-line explanation of each match&apos;s fit score
            </span>
          </span>
        </div>
      </div>
    </Screen>
  );
}
