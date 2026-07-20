"use client";

import { panelStyle, StageChip, thStyle } from "@/components/chips";
import { Tick } from "@/components/icons";
import { PageHeader, Screen } from "@/components/Screen";
import { EMPTY_PIPE_SEL, useApp } from "@/lib/store";
import type { Business } from "@/lib/types";
import { STAGES } from "@/lib/types";

const grid = "2.2fr 1fr 1.2fr 1.2fr";

function activityOf(b: Business): "Today" | "This week" | "Older" {
  const l = b.lastActivity.toLowerCase();
  if (l.includes("h ago") || l.includes("today")) return "Today";
  if (l.includes("yesterday") || /(8|9|10|11) jul/.test(l)) return "This week";
  return "Older";
}

export function PipelineScreen() {
  const { state, patch, update, businesses, stageOf, openLead } = useApp();

  const uniq = (get: (b: Business) => string) =>
    [...new Set(businesses.map(get))].sort();
  const filterDefs = [
    {
      key: "promo",
      label: "Promotion",
      opts: state.promotions.map((p) => ({ v: p.id, label: p.name })),
    },
    {
      key: "ind",
      label: "Industry",
      opts: uniq((b) => b.industry).map((v) => ({ v, label: v })),
    },
    {
      key: "area",
      label: "Area",
      opts: uniq((b) => b.suburb).map((v) => ({ v, label: v })),
    },
    {
      key: "size",
      label: "Size",
      opts: [
        { v: "S", label: "S — 1–9 staff" },
        { v: "M", label: "M — 10–29 staff" },
        { v: "L", label: "L — 30+ staff" },
      ],
    },
    {
      key: "act",
      label: "Last activity",
      opts: [
        { v: "Today", label: "Today" },
        { v: "This week", label: "This week" },
        { v: "Older", label: "Older" },
      ],
    },
  ];

  const selOf = (key: string) => {
    const sel = state.pipeSel[key] ?? {};
    return Object.keys(sel).filter((v) => sel[v]);
  };
  const anySelected = filterDefs.some((f) => selOf(f.key).length > 0);
  const hasFilter = !!(state.stageFilter || state.listFilter || anySelected);
  const clearFilters = () =>
    patch({
      listFilter: null,
      stageFilter: null,
      pipeSel: EMPTY_PIPE_SEL,
      openFilter: null,
    });

  const counts: Record<string, number> = {};
  businesses.forEach((b) => {
    const s = stageOf(b);
    counts[s] = (counts[s] ?? 0) + 1;
  });

  let rows = businesses.filter((b) => {
    const promos = selOf("promo");
    if (
      promos.length &&
      !promos.some(
        (p) => p === "xmas" || (state.promotionMembers[p] ?? []).includes(b.id),
      )
    )
      return false;
    const inds = selOf("ind");
    if (inds.length && !inds.includes(b.industry)) return false;
    const areas = selOf("area");
    if (areas.length && !areas.includes(b.suburb)) return false;
    const sizes = selOf("size");
    if (sizes.length && !sizes.includes(b.sizeBand)) return false;
    const acts = selOf("act");
    if (acts.length && !acts.includes(activityOf(b))) return false;
    return true;
  });
  if (state.stageFilter) rows = rows.filter((b) => stageOf(b) === state.stageFilter);
  if (state.listFilter) {
    const list = state.savedLists.find((l) => l.id === state.listFilter);
    rows = rows.filter((b) => list?.memberIds.includes(b.id));
  }

  const listLabel = state.stageFilter
    ? "Stage: " + state.stageFilter
    : state.listFilter
      ? (state.savedLists.find((l) => l.id === state.listFilter)?.label ?? "")
      : anySelected
        ? "Filtered"
        : "All businesses";

  const savedListStyle = (active: boolean) => ({
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 8,
    fontSize: 13,
    padding: "7px 10px",
    borderRadius: 6,
    cursor: "pointer" as const,
    ...(active
      ? { fontWeight: 600, color: "#0A1628", background: "rgba(0,194,168,0.08)" }
      : { fontWeight: 500, color: "#6C757D" }),
  });

  return (
    <Screen maxWidth={1200}>
      <PageHeader
        title="Pipeline"
        subtitle="Every business this promotion has touched, by stage"
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
          position: "relative",
          zIndex: 6,
        }}
      >
        {filterDefs.map((f) => {
          const sel = state.pipeSel[f.key] ?? {};
          const picked = f.opts.filter((o) => sel[o.v]);
          const n = picked.length;
          const open = state.openFilter === f.key;
          return (
            <div key={f.key} style={{ position: "relative" }}>
              <button
                onClick={() =>
                  update((s) => ({
                    openFilter: s.openFilter === f.key ? null : f.key,
                  }))
                }
                style={{
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: n ? 600 : 500,
                  padding: "7px 12px",
                  border: `1.5px solid ${n ? "rgba(0,194,168,0.45)" : "#E8ECF0"}`,
                  borderRadius: 6,
                  background: "#fff",
                  color: n ? "#00775f" : "#6C757D",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}:{" "}
                {n === 0 ? "All" : n === 1 ? picked[0].label : `${n} selected`} ▾
              </button>
              {open && (
                <div
                  style={{
                    position: "absolute",
                    top: 38,
                    left: 0,
                    background: "#fff",
                    border: "1px solid #E8ECF0",
                    borderRadius: 10,
                    boxShadow: "0 8px 32px rgba(10,22,40,0.14)",
                    padding: 8,
                    minWidth: 210,
                    zIndex: 7,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    animation: "go-fadeup 180ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <span
                    onClick={() =>
                      update((s) => ({
                        pipeSel: { ...s.pipeSel, [f.key]: {} },
                      }))
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: 13,
                      padding: "6px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      ...(n === 0
                        ? {
                            fontWeight: 600,
                            background: "rgba(0,194,168,0.08)",
                            color: "#0A1628",
                          }
                        : { color: "#6C757D" }),
                    }}
                  >
                    All
                  </span>
                  {f.opts.map((o) => {
                    const on = !!sel[o.v];
                    return (
                      <span
                        key={o.v}
                        className="go-row"
                        onClick={() =>
                          update((s) => ({
                            pipeSel: {
                              ...s.pipeSel,
                              [f.key]: {
                                ...s.pipeSel[f.key],
                                [o.v]: !s.pipeSel[f.key]?.[o.v],
                              },
                            },
                          }))
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          padding: "6px 10px",
                          borderRadius: 6,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          ...(on
                            ? { fontWeight: 600, color: "#0A1628" }
                            : { color: "#303a4a" }),
                        }}
                      >
                        <span
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 4,
                            flex: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...(on
                              ? { background: "#00C2A8" }
                              : {
                                  background: "#fff",
                                  border: "1.5px solid #D6DCE3",
                                }),
                          }}
                        >
                          {on && <Tick size={9} />}
                        </span>
                        {o.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {hasFilter && (
          <span
            className="go-link"
            onClick={clearFilters}
            style={{ fontSize: 12.5, fontWeight: 600 }}
          >
            Clear filters ✕
          </span>
        )}
        <span style={{ fontSize: 12, color: "#6C757D", marginLeft: "auto" }}>
          select multiple options within any filter — or All to look across
          everything
        </span>
      </div>
      <div
        style={{
          ...panelStyle,
          display: "flex",
          alignItems: "stretch",
          padding: "6px 10px",
        }}
      >
        {STAGES.map((s, i) => {
          const active = state.stageFilter === s;
          const count = counts[s] ?? 0;
          return (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                className="go-stage"
                onClick={() =>
                  update((st) => ({
                    stageFilter: st.stageFilter === s ? null : s,
                    listFilter: null,
                  }))
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  padding: "10px 4px",
                  cursor: "pointer",
                  borderRadius: 8,
                  flex: 1,
                  minWidth: 0,
                  ...(active
                    ? {
                        background: "rgba(0,194,168,0.10)",
                        boxShadow: "inset 0 0 0 1.5px rgba(0,194,168,0.5)",
                      }
                    : {}),
                }}
              >
                <span
                  style={{
                    fontSize: 19,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    color: count === 0 ? "#C6CDD5" : "#0A1628",
                  }}
                >
                  {count}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    color: "#6C757D",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <span
                  style={{
                    color: "#C6CDD5",
                    fontSize: 12,
                    flex: "none",
                    padding: "0 2px",
                  }}
                >
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "190px 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div
          style={{
            ...panelStyle,
            padding: "12px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <span style={{ ...thStyle, padding: "2px 10px 8px" }}>Saved lists</span>
          <span
            className="go-nav"
            onClick={clearFilters}
            style={savedListStyle(!state.listFilter && !state.stageFilter)}
          >
            All businesses
          </span>
          {state.savedLists.map((l) => (
            <span
              key={l.id}
              className="go-nav"
              onClick={() =>
                update((s) => ({
                  listFilter: s.listFilter === l.id ? null : l.id,
                  stageFilter: null,
                }))
              }
              style={savedListStyle(state.listFilter === l.id)}
            >
              {l.label}
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6C757D",
                  background: "#F4F6FA",
                  borderRadius: 100,
                  padding: "1px 7px",
                }}
              >
                {l.memberIds.length}
              </span>
            </span>
          ))}
        </div>
        <div style={{ ...panelStyle, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              padding: "14px 24px 10px",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>{listLabel}</span>
            <span style={{ fontSize: 12, color: "#6C757D" }}>
              {rows.length} businesses
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: grid,
              gap: 12,
              padding: "8px 24px",
              borderTop: "1px solid #E8ECF0",
              borderBottom: "1px solid #E8ECF0",
              background: "#F9FAFC",
            }}
          >
            <span style={thStyle}>Business</span>
            <span style={thStyle}>Suburb</span>
            <span style={thStyle}>Stage</span>
            <span style={thStyle}>Last activity</span>
          </div>
          {rows.map((b) => (
            <div
              key={b.id}
              className="go-row"
              onClick={() => openLead(b.id)}
              style={{
                display: "grid",
                gridTemplateColumns: grid,
                gap: 12,
                alignItems: "center",
                padding: "12px 24px",
                borderBottom: "1px solid #F4F6FA",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  minWidth: 0,
                }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{b.name}</span>
                <span style={{ fontSize: 12, color: "#6C757D" }}>{b.type}</span>
              </span>
              <span style={{ fontSize: 13, color: "#6C757D" }}>{b.suburb}</span>
              <span>
                <StageChip stage={stageOf(b)} />
              </span>
              <span style={{ fontSize: 12.5, color: "#6C757D" }}>
                {state.stageOverrides[b.id] ? "Updated just now" : b.lastActivity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}
