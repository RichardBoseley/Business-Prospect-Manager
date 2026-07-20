"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { toggleChipStyle } from "./chips";
import { Tick } from "./icons";
import { PhotoSlot } from "./PhotoSlot";
import { useApp } from "@/lib/store";

const fieldLabelStyle: CSSProperties = { fontSize: 12.5, fontWeight: 600 };

const stepTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: "-0.02em",
};

const reviewLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#6C757D",
};

export function PromotionWizard() {
  const router = useRouter();
  const { state, patch, update } = useApp();
  if (!state.wizOpen) return null;

  const stepDot = (n: number): CSSProperties => ({
    width: 26,
    height: 26,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12.5,
    fontWeight: 700,
    flex: "none",
    ...(state.wizStep >= n
      ? { background: "#00C2A8", color: "#0A1628" }
      : {
          background: "#F4F6FA",
          border: "1.5px solid #E8ECF0",
          color: "#6C757D",
        }),
  });

  const close = () => patch({ wizOpen: false });
  const addPoint = () => {
    const label = state.wizPointInput.trim();
    if (!label) return;
    update((s) => ({
      wizPoints: [...s.wizPoints, { label, on: true, ai: false }],
      wizPointInput: "",
    }));
  };
  const addAudience = () => {
    const label = state.audInput.trim();
    if (!label) return;
    update((s) => ({
      wizAud: [...s.wizAud, { label, hint: "custom audience", on: true }],
      audInput: "",
    }));
  };
  const finish = () => {
    update((s) => ({
      wizOpen: false,
      promotions: s.wizEditId
        ? s.promotions.map((p) =>
            p.id === s.wizEditId
              ? {
                  ...p,
                  name: s.wizName || p.name,
                  description: s.wizDesc || p.description,
                }
              : p,
          )
        : [
            ...s.promotions,
            {
              id: "p" + Date.now(),
              name: s.wizName || "Untitled promotion",
              status: "Draft" as const,
              description: s.wizDesc || "—",
              sellingPoints: s.wizPoints.filter((c) => c.on).map((c) => c.label),
              audiences: s.wizAud.filter((a) => a.on).map((a) => a.label),
              photos: [],
              metrics: { targets: 0, sent: 0, opened: 0, clicked: 0, replied: 0 },
            },
          ],
    }));
    router.push("/promotions");
  };

  const pointsOn =
    state.wizPoints
      .filter((c) => c.on)
      .map((c) => c.label)
      .join("  ·  ") || "—";
  const audiencesOn =
    state.wizAud
      .filter((a) => a.on)
      .map((a) => a.label)
      .join("  ·  ") || "—";

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,22,40,0.45)",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 8px 40px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)",
          width: 640,
          maxWidth: "100%",
          maxHeight: "88vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          animation: "go-fadeup 250ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "20px 28px",
            borderBottom: "1px solid #F4F6FA",
          }}
        >
          <span style={stepDot(1)}>1</span>
          <span style={{ height: 1.5, width: 24, background: "#E8ECF0" }} />
          <span style={stepDot(2)}>2</span>
          <span style={{ height: 1.5, width: 24, background: "#E8ECF0" }} />
          <span style={stepDot(3)}>3</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#6C757D" }}>
            {state.wizEditId ? "Edit promotion" : "New promotion"}
          </span>
          <span
            className="go-dim"
            onClick={close}
            style={{ fontSize: 16, lineHeight: 1 }}
          >
            ✕
          </span>
        </div>
        {state.wizStep === 1 && (
          <div
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h2 style={stepTitleStyle}>What&apos;s the offer?</h2>
              <span style={{ fontSize: 13, color: "#6C757D" }}>
                Give it a name your team will recognise — the AI uses the
                description and selling points to draft emails.
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>Promotion name</span>
              <input
                className="go-input"
                value={state.wizName}
                onChange={(e) => patch({ wizName: e.target.value })}
                placeholder="e.g. New Year Team Kick-offs"
                style={{ fontSize: 14, padding: "10px 13px" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>Description</span>
              <textarea
                className="go-input"
                value={state.wizDesc}
                onChange={(e) => patch({ wizDesc: e.target.value })}
                rows={3}
                placeholder="What's included, who it's for, and why it's worth replying to…"
                style={{ fontSize: 14, lineHeight: 1.55, padding: "10px 13px", resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={fieldLabelStyle}>
                Key selling points{" "}
                <span style={{ fontWeight: 500, color: "#00a891", fontSize: 11.5 }}>
                  ✦ AI-suggested — tap to include
                </span>
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {state.wizPoints.map((c, i) => (
                  <button
                    key={c.label + i}
                    onClick={() =>
                      update((s) => ({
                        wizPoints: s.wizPoints.map((x, j) =>
                          j === i ? { ...x, on: !x.on } : x,
                        ),
                      }))
                    }
                    style={toggleChipStyle(c.on)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="go-input"
                  value={state.wizPointInput}
                  onChange={(e) => patch({ wizPointInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addPoint();
                  }}
                  placeholder="Add your own…"
                  style={{ fontSize: 13, padding: "8px 12px", flex: 1 }}
                />
                <button
                  className="go-btn-secondary"
                  onClick={addPoint}
                  style={{ fontSize: 13, padding: "8px 15px" }}
                >
                  Add
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={fieldLabelStyle}>
                Photos{" "}
                <span style={{ fontWeight: 500, color: "#6C757D", fontSize: 11.5 }}>
                  — used in emails and on the booking page
                </span>
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                <div style={{ height: 84 }}>
                  <PhotoSlot />
                </div>
                <div style={{ height: 84 }}>
                  <PhotoSlot />
                </div>
                <div style={{ height: 84 }}>
                  <PhotoSlot />
                </div>
              </div>
            </div>
          </div>
        )}
        {state.wizStep === 2 && (
          <div
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h2 style={stepTitleStyle}>Who does it suit?</h2>
              <span style={{ fontSize: 13, color: "#6C757D" }}>
                Suggested from your offer — toggle the audiences worth
                targeting. You can refine further when you search.
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {state.wizAud.map((a, i) => (
                <div
                  key={a.label + i}
                  className={a.on ? undefined : "go-aud-off"}
                  onClick={() =>
                    update((s) => ({
                      wizAud: s.wizAud.map((x, j) =>
                        j === i ? { ...x, on: !x.on } : x,
                      ),
                    }))
                  }
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    ...(a.on
                      ? {
                          background: "rgba(0,194,168,0.06)",
                          border: "1.5px solid rgba(0,194,168,0.45)",
                        }
                      : { background: "#fff", border: "1.5px solid #E8ECF0" }),
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      flex: "none",
                      marginTop: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...(a.on
                        ? { background: "#00C2A8" }
                        : { background: "#fff", border: "1.5px solid #D6DCE3" }),
                    }}
                  >
                    {a.on && <Tick />}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{a.label}</span>
                    <span style={{ fontSize: 12.5, color: "#6C757D" }}>{a.hint}</span>
                  </span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="go-input"
                  value={state.audInput}
                  onChange={(e) => patch({ audInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addAudience();
                  }}
                  placeholder="Add a custom audience…"
                  style={{ fontSize: 13, padding: "8px 12px", flex: 1 }}
                />
                <button
                  className="go-btn-secondary"
                  onClick={addAudience}
                  style={{ fontSize: 13, padding: "8px 15px" }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        {state.wizStep === 3 && (
          <div
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h2 style={stepTitleStyle}>Review</h2>
              <span style={{ fontSize: 13, color: "#6C757D" }}>
                Create the promotion as a draft — then find businesses that
                match it.
              </span>
            </div>
            <div
              style={{
                background: "#F9FAFC",
                border: "1px solid #E8ECF0",
                borderRadius: 10,
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={reviewLabelStyle}>Offer</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  {state.wizName || "Untitled promotion"}
                </span>
                <span style={{ fontSize: 13, color: "#6C757D" }}>
                  {state.wizDesc || "No description yet"}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={reviewLabelStyle}>Selling points</span>
                <span style={{ fontSize: 13, lineHeight: 1.55 }}>{pointsOn}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={reviewLabelStyle}>Audiences</span>
                <span style={{ fontSize: 13, lineHeight: 1.55 }}>{audiencesOn}</span>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 28px",
            borderTop: "1px solid #F4F6FA",
            marginTop: "auto",
          }}
        >
          {state.wizStep > 1 && (
            <button
              className="go-btn-ghost"
              onClick={() =>
                update((s) => ({ wizStep: Math.max(1, s.wizStep - 1) }))
              }
              style={{ fontSize: 13.5, padding: "9px 16px" }}
            >
              ← Back
            </button>
          )}
          <span style={{ flex: 1 }} />
          {state.wizStep < 3 && (
            <button
              className="go-btn-primary"
              onClick={() =>
                update((s) => ({ wizStep: Math.min(3, s.wizStep + 1) }))
              }
              style={{
                fontSize: 14,
                padding: "10px 22px",
                boxShadow: "0 4px 14px rgba(0,194,168,0.28)",
                ...(state.wizStep === 1 && !state.wizName.trim()
                  ? { opacity: 0.4, pointerEvents: "none" }
                  : {}),
              }}
            >
              Continue →
            </button>
          )}
          {state.wizStep === 3 && (
            <button
              className="go-btn-primary"
              onClick={finish}
              style={{
                fontSize: 14,
                padding: "10px 22px",
                boxShadow: "0 4px 14px rgba(0,194,168,0.28)",
              }}
            >
              {state.wizEditId ? "Save changes" : "Create promotion"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
