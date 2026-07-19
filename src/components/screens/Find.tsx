"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { panelStyle, segStyle, toggleChipStyle } from "@/components/chips";
import { PageHeader, Screen } from "@/components/Screen";
import { discoveryService } from "@/lib/services/discovery";
import { useApp } from "@/lib/store";
import type { SizeBand } from "@/lib/types";

const sectionStyle: CSSProperties = {
  padding: "20px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const selectStyle: CSSProperties = {
  fontFamily: "inherit",
  fontWeight: 600,
  border: "1.5px solid #E8ECF0",
  borderRadius: 6,
  background: "#fff",
  color: "#0A1628",
  outline: "none",
};

const segmentWrapStyle: CSSProperties = {
  display: "inline-flex",
  background: "#F4F6FA",
  border: "1px solid #E8ECF0",
  borderRadius: 100,
  padding: 3,
};

export function FindScreen() {
  const router = useRouter();
  const { state, patch, update } = useApp();

  const curPromo =
    state.promotions.find((p) => p.id === state.currentPromoId) ??
    state.promotions[0];
  const primIdx = Math.min(state.primaryVen, state.venues.length - 1);
  const venueIdx =
    state.venueSel == null
      ? primIdx
      : Math.min(state.venueSel, state.venues.length - 1);
  const typeCount = Object.values(state.types).filter(Boolean).length;
  const staffLabel = `${state.staffMin}–${state.staffMax >= 100 ? "100+" : state.staffMax} staff`;

  const addArea = () => {
    const v = state.areaInput.trim();
    if (!v) return;
    update((s) => ({
      areas: v in s.areas ? s.areas : { ...s.areas, [v]: true },
      areaInput: "",
    }));
  };

  const runSearch = () => {
    patch({ searching: true });
    discoveryService
      .search({
        promotionId: curPromo.id,
        location:
          state.locMode === "distance"
            ? {
                mode: "distance",
                venueId: state.venues[venueIdx]?.id ?? "",
                maxDriveMinutes: state.dist,
              }
            : {
                mode: "areas",
                areas: Object.keys(state.areas).filter((a) => state.areas[a]),
              },
        types: Object.keys(state.types).filter((t) => state.types[t]),
        industries: Object.keys(state.inds).filter((i) => state.inds[i]),
        size:
          state.sizeMode === "bands"
            ? {
                mode: "bands",
                bands: (Object.keys(state.sizes) as SizeBand[]).filter(
                  (k) => state.sizes[k],
                ),
              }
            : {
                mode: "range",
                minStaff: state.staffMin,
                maxStaff: state.staffMax,
              },
      })
      .then(() => {
        patch({ searching: false });
        router.push("/shortlist");
      });
  };

  return (
    <Screen maxWidth={920}>
      <PageHeader
        title="Find businesses"
        subtitle="Build a search for local businesses that match this promotion"
      />
      <div
        style={{
          ...panelStyle,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#00a891",
            flex: "none",
          }}
        >
          Promotion
        </span>
        <select
          value={state.currentPromoId}
          onChange={(e) => patch({ currentPromoId: e.target.value })}
          style={{
            ...selectStyle,
            fontSize: 14,
            padding: "8px 12px",
            flex: 1,
            maxWidth: 380,
          }}
        >
          {state.promotions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ ...panelStyle, display: "flex", flexDirection: "column" }}>
        <div style={{ ...sectionStyle, borderBottom: "1px solid #F4F6FA" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>Location</span>
            <div style={segmentWrapStyle}>
              <button
                onClick={() => patch({ locMode: "distance" })}
                style={segStyle(state.locMode === "distance")}
              >
                Distance from venue
              </button>
              <button
                onClick={() => patch({ locMode: "areas" })}
                style={segStyle(state.locMode === "areas")}
              >
                Named areas
              </button>
            </div>
          </div>
          {state.locMode === "distance" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <select
                  value={String(venueIdx)}
                  onChange={(e) => patch({ venueSel: +e.target.value })}
                  style={{ ...selectStyle, fontSize: 13, padding: "8px 11px" }}
                >
                  {state.venues.map((v, i) => (
                    <option key={v.id} value={String(i)}>
                      {v.name}
                      {i === primIdx ? " (primary)" : ""}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: 12, color: "#6C757D" }}>
                  defaults to your primary venue ·{" "}
                  <span
                    className="go-link"
                    onClick={() => router.push("/settings")}
                    style={{ fontWeight: 600 }}
                  >
                    manage venues in Settings
                  </span>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingTop: 2,
                }}
              >
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={5}
                  value={state.dist}
                  onChange={(e) => patch({ dist: +e.target.value })}
                  style={{ flex: 1 }}
                />
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    minWidth: 98,
                    textAlign: "right",
                    color: "#00775f",
                  }}
                >
                  Within {state.dist} min drive
                </span>
              </div>
              <span style={{ fontSize: 12, color: "#6C757D" }}>
                From {state.venues[venueIdx]?.address ?? ""}
              </span>
            </>
          )}
          {state.locMode === "areas" && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.keys(state.areas).map((a) => (
                  <button
                    key={a}
                    onClick={() =>
                      update((s) => ({
                        areas: { ...s.areas, [a]: !s.areas[a] },
                      }))
                    }
                    style={toggleChipStyle(state.areas[a])}
                  >
                    {a}
                  </button>
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
                  placeholder="Add another area…"
                  style={{ fontSize: 13, padding: "7px 12px", flex: 1 }}
                />
                <button
                  className="go-btn-secondary"
                  onClick={addArea}
                  style={{ fontSize: 13, padding: "7px 14px" }}
                >
                  Add
                </button>
              </div>
            </>
          )}
        </div>
        <div style={{ ...sectionStyle, borderBottom: "1px solid #F4F6FA" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              Business type{" "}
              <span style={{ fontWeight: 500, color: "#6C757D", fontSize: 12.5 }}>
                · {typeCount} selected
              </span>
            </span>
            <input
              className="go-input"
              value={state.typeQ}
              onChange={(e) => patch({ typeQ: e.target.value })}
              placeholder="Search types…"
              style={{ fontSize: 13, padding: "7px 12px", background: "#fff", width: 200 }}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.keys(state.types)
              .filter(
                (t) =>
                  !state.typeQ ||
                  t.toLowerCase().includes(state.typeQ.toLowerCase()),
              )
              .map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    update((s) => ({ types: { ...s.types, [t]: !s.types[t] } }))
                  }
                  style={toggleChipStyle(state.types[t])}
                >
                  {t}
                </button>
              ))}
          </div>
        </div>
        <div style={{ ...sectionStyle, borderBottom: "1px solid #F4F6FA" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Industry</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.keys(state.inds).map((i) => (
              <button
                key={i}
                onClick={() =>
                  update((s) => ({ inds: { ...s.inds, [i]: !s.inds[i] } }))
                }
                style={toggleChipStyle(state.inds[i])}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div style={sectionStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, position: "relative" }}>
              Business size
              <span
                className="go-qmark"
                onClick={() => update((s) => ({ sizeInfo: !s.sizeInfo }))}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#F4F6FA",
                  border: "1px solid #E8ECF0",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#6C757D",
                  cursor: "pointer",
                  verticalAlign: 1,
                  marginLeft: 4,
                }}
              >
                ?
              </span>
              {state.sizeInfo && (
                <span
                  style={{
                    position: "absolute",
                    top: 24,
                    left: 0,
                    zIndex: 8,
                    background: "#0A1628",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    borderRadius: 8,
                    padding: "10px 14px",
                    width: 250,
                    boxShadow: "0 8px 32px rgba(10,22,40,0.25)",
                    animation: "go-fadeup 180ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <span style={{ display: "block", fontWeight: 700 }}>
                    Size bands
                  </span>
                  S — 1–9 staff
                  <br />
                  M — 10–29 staff
                  <br />
                  L — 30+ staff
                  <span style={{ display: "block", paddingTop: 6, color: "#9AA5B1" }}>
                    Estimated from public signals (website, reviews, job ads) —
                    not exact.
                  </span>
                </span>
              )}
            </span>
            <div style={segmentWrapStyle}>
              <button
                onClick={() => patch({ sizeMode: "bands" })}
                style={segStyle(state.sizeMode === "bands", {
                  fontSize: 12.5,
                  padding: "6px 14px",
                })}
              >
                Size bands
              </button>
              <button
                onClick={() => patch({ sizeMode: "range" })}
                style={segStyle(state.sizeMode === "range", {
                  fontSize: 12.5,
                  padding: "6px 14px",
                })}
              >
                Staff range
              </button>
            </div>
          </div>
          {state.sizeMode === "bands" && (
            <>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {(["S", "M", "L"] as SizeBand[]).map((k) => (
                  <button
                    key={k}
                    onClick={() =>
                      update((s) => ({ sizes: { ...s.sizes, [k]: !s.sizes[k] } }))
                    }
                    style={{
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: 600,
                      width: 46,
                      padding: "7px 0",
                      textAlign: "center",
                      borderRadius: 6,
                      cursor: "pointer",
                      transition: "border-color 150ms",
                      ...(state.sizes[k]
                        ? {
                            background: "rgba(0,194,168,0.10)",
                            border: "1.5px solid rgba(0,194,168,0.45)",
                            color: "#00775f",
                          }
                        : {
                            background: "#fff",
                            border: "1.5px solid #E8ECF0",
                            color: "#0A1628",
                          }),
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "#6C757D" }}>
                S = 1–9 staff · M = 10–29 · L = 30+ — estimated from public
                signals, not exact
              </span>
            </>
          )}
          {state.sizeMode === "range" && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 1fr",
                  gap: "8px 12px",
                  alignItems: "center",
                  maxWidth: 520,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6C757D" }}>
                  Min
                </span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={state.staffMin}
                  onChange={(e) =>
                    update((s) => ({
                      staffMin: Math.min(+e.target.value, s.staffMax - 1),
                    }))
                  }
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6C757D" }}>
                  Max
                </span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={state.staffMax}
                  onChange={(e) =>
                    update((s) => ({
                      staffMax: Math.max(+e.target.value, s.staffMin + 1),
                    }))
                  }
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#00775f" }}>
                Businesses with {staffLabel}
              </span>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          className="go-btn-primary"
          onClick={runSearch}
          style={{
            fontSize: 14,
            padding: "11px 26px",
            boxShadow: "0 4px 14px rgba(0,194,168,0.28)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            ...(state.searching ? { opacity: 0.7, pointerEvents: "none" } : {}),
          }}
        >
          {state.searching ? (
            <>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid rgba(10,22,40,0.25)",
                  borderTopColor: "#0A1628",
                  animation: "go-spin 700ms linear infinite",
                }}
              />
              Searching…
            </>
          ) : (
            "Search"
          )}
        </button>
        <span style={{ fontSize: 12.5, color: "#6C757D" }}>
          Results are matched and ranked against &quot;{curPromo.name}&quot;
        </span>
      </div>
    </Screen>
  );
}
