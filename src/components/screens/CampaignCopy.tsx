"use client";

import { panelStyle, thStyle } from "@/components/chips";
import { Tick } from "@/components/icons";
import { Screen } from "@/components/Screen";
import { useApp } from "@/lib/store";

export function CampaignCopyScreen() {
  const { state, patch, update, businesses, draftOf } = useApp();

  const targets = businesses.filter((b) => state.selected[b.id] && !b.dnc);
  const cur =
    targets.find((b) => b.id === state.copySel) ?? targets[0] ?? businesses[0];
  const curDraft = draftOf(cur);
  const approvedCount = targets.filter((b) => state.approved[b.id]).length;
  const curOk = !!state.approved[cur.id];
  const seedPrimary = cur.contacts.find((c) => c.isPrimary);
  const progressPct = targets.length
    ? Math.round((approvedCount / targets.length) * 100)
    : 0;

  const approveCur = () =>
    update((s) => {
      const approved = { ...s.approved, [cur.id]: true };
      const i = targets.findIndex((b) => b.id === cur.id);
      const next =
        targets.find((b, j) => j > i && !approved[b.id]) ??
        targets.find((b) => !approved[b.id]);
      return { approved, copySel: next ? next.id : cur.id, editing: false };
    });

  return (
    <Screen maxWidth={1120}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Campaign copy
          </h1>
          <span style={{ fontSize: 13, color: "#6C757D" }}>
            Review each AI-drafted email before anything sends
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              minWidth: 170,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#00775f" }}>
              {approvedCount} of {targets.length} approved
            </span>
            <div
              style={{
                height: 6,
                borderRadius: 100,
                background: "#F4F6FA",
                border: "1px solid #E8ECF0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 100,
                  background: "#00C2A8",
                  transition: "width 300ms cubic-bezier(0.4,0,0.2,1)",
                  width: `${progressPct}%`,
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 3,
            }}
          >
            <button
              className="go-btn-primary"
              onClick={() =>
                update((s) => {
                  const approved: Record<string, boolean> = {};
                  targets.forEach((b) => (approved[b.id] = true));
                  return { ...s, approved, queued: true };
                })
              }
              style={{
                fontSize: 14,
                padding: "10px 20px",
                boxShadow: "0 4px 14px rgba(0,194,168,0.28)",
                ...(state.queued ? { opacity: 0.5, pointerEvents: "none" } : {}),
              }}
            >
              {state.queued
                ? "✓ Queued for sending"
                : "Approve all & queue for sending"}
            </button>
            <span style={{ fontSize: 11.5, color: "#6C757D" }}>
              Sends in daily batches of ~{state.dailyLimit}
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div
          style={{
            ...panelStyle,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ ...thStyle, padding: "14px 16px 8px" }}>
            Selected targets
          </span>
          {targets.map((t) => {
            const active = state.copySel === t.id;
            return (
              <div
                key={t.id}
                className="go-row"
                onClick={() => patch({ copySel: t.id, editing: false })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderLeft: `2.5px solid ${active ? "#00C2A8" : "transparent"}`,
                  ...(active ? { background: "rgba(0,194,168,0.07)" } : {}),
                }}
              >
                <span
                  style={{
                    fontSize: 13.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                    flex: 1,
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {t.name}
                </span>
                {state.approved[t.id] && (
                  <span
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      background: "rgba(14,138,99,0.12)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "none",
                    }}
                  >
                    <Tick size={9} stroke="#0E8A63" strokeWidth={2} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ ...panelStyle, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "16px 24px",
              borderBottom: "1px solid #F4F6FA",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600 }}>{cur.name}</span>
              <span style={{ fontSize: 12.5, color: "#6C757D" }}>
                {cur.type} · {cur.suburb} · To:{" "}
                {(seedPrimary ? seedPrimary.name + " — " : "") +
                  (cur.email ?? "—")}
              </span>
            </div>
            {curOk && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 100,
                  padding: "3px 10px",
                  color: "#0E8A63",
                  background: "rgba(14,138,99,0.10)",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#0E8A63",
                  }}
                />
                Approved
              </span>
            )}
          </div>
          {!state.editing ? (
            <>
              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={thStyle}>Subject</span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {curDraft.subject}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    color: "#303a4a",
                    whiteSpace: "pre-wrap",
                    borderTop: "1px solid #F4F6FA",
                    paddingTop: 14,
                  }}
                >
                  {curDraft.body}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 24px",
                  borderTop: "1px solid #F4F6FA",
                }}
              >
                <button
                  className="go-btn-primary"
                  onClick={approveCur}
                  style={{
                    fontSize: 13.5,
                    padding: "9px 18px",
                    boxShadow: "0 4px 14px rgba(0,194,168,0.28)",
                  }}
                >
                  Approve
                </button>
                <button
                  className="go-btn-secondary"
                  onClick={() =>
                    patch({
                      editing: true,
                      editSub: curDraft.subject,
                      editText: curDraft.body,
                    })
                  }
                  style={{ fontSize: 13.5, padding: "8px 17px" }}
                >
                  Edit
                </button>
                <button
                  className="go-btn-secondary"
                  onClick={() =>
                    update((s) => {
                      const regen = {
                        ...s.regen,
                        [cur.id]: (s.regen[cur.id] ?? 0) + 1,
                      };
                      const overrides = { ...s.overrides };
                      delete overrides[cur.id];
                      return { regen, overrides, editing: false };
                    })
                  }
                  style={{ fontSize: 13.5, padding: "8px 17px" }}
                >
                  ↻ Regenerate
                </button>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11.5,
                    color: "#6C757D",
                    textAlign: "right",
                  }}
                >
                  Every email ends with Game On&apos;s details
                  <br />
                  and a one-click unsubscribe
                </span>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <input
                  value={state.editSub}
                  onChange={(e) => patch({ editSub: e.target.value })}
                  style={{
                    fontFamily: "inherit",
                    fontSize: 14.5,
                    fontWeight: 600,
                    padding: "10px 13px",
                    border: "1.5px solid #00C2A8",
                    borderRadius: 6,
                    outline: "none",
                    boxShadow: "0 0 0 3px rgba(0,194,168,0.15)",
                    color: "#0A1628",
                  }}
                />
                <textarea
                  value={state.editText}
                  onChange={(e) => patch({ editText: e.target.value })}
                  rows={16}
                  style={{
                    fontFamily: "inherit",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    padding: "12px 13px",
                    border: "1.5px solid #E8ECF0",
                    borderRadius: 6,
                    outline: "none",
                    resize: "vertical",
                    color: "#303a4a",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 24px",
                  borderTop: "1px solid #F4F6FA",
                }}
              >
                <button
                  className="go-btn-primary"
                  onClick={() =>
                    update((s) => ({
                      editing: false,
                      overrides: {
                        ...s.overrides,
                        [cur.id]: { subject: s.editSub, body: s.editText },
                      },
                    }))
                  }
                  style={{
                    fontSize: 13.5,
                    padding: "9px 18px",
                    boxShadow: "0 4px 14px rgba(0,194,168,0.28)",
                  }}
                >
                  Save changes
                </button>
                <button
                  className="go-btn-ghost"
                  onClick={() => patch({ editing: false })}
                  style={{ fontSize: 13.5, padding: "9px 16px" }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
