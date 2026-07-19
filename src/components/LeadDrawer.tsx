"use client";

import type { CSSProperties } from "react";
import { StageChip, segStyle, thStyle } from "./chips";
import { Icon } from "./icons";
import { buildDocs, buildTimeline } from "@/lib/lead-history";
import { useApp } from "@/lib/store";
import type { TimelineKind } from "@/lib/types";

function categoryColours(kind: TimelineKind): [string, string] {
  if (kind === "reply" || kind === "book")
    return ["#0E8A63", "rgba(14,138,99,0.12)"];
  if (kind === "note" || kind === "rem")
    return ["#9A5B00", "rgba(255,170,0,0.16)"];
  if (kind === "dnc") return ["#C03530", "rgba(192,53,48,0.10)"];
  if (kind === "mail" || kind === "open" || kind === "click" || kind === "phone")
    return ["#00775f", "rgba(0,194,168,0.14)"];
  return ["#6C757D", "#EEF1F6"];
}

const tabStyle = (on: boolean): CSSProperties => ({
  fontSize: 13,
  fontWeight: 600,
  padding: "10px 2px",
  cursor: "pointer",
  marginBottom: -1,
  borderBottom: `2px solid ${on ? "#00C2A8" : "transparent"}`,
  color: on ? "#0A1628" : "#6C757D",
});

const smallInputStyle: CSSProperties = {
  fontSize: 12.5,
  padding: "7px 11px",
  background: "#fff",
};

export function LeadDrawer() {
  const {
    state,
    patch,
    update,
    businesses,
    stageOf,
    draftOf,
    contactsOf,
    primaryNameOf,
    closeDrawer,
  } = useApp();

  const lead = state.drawerId
    ? businesses.find((b) => b.id === state.drawerId)
    : null;
  if (!lead) return null;

  const stage = stageOf(lead);
  const draft = draftOf(lead);
  const detailedNotes = state.detailedNotes[lead.id] ?? [];
  const quickNotes = state.quickNotes[lead.id] ?? [];
  const context = {
    stage,
    draft,
    detailedNotes,
    quickNotes,
    reminder: state.reminders[lead.id],
    dncAddedManually: !!state.dncAdded[lead.id],
  };
  const timeline = buildTimeline(lead, context);
  const docs = buildDocs(lead, context);
  const contacts = contactsOf(lead);
  const primaryName = primaryNameOf(lead);
  const onDnc = !!state.dncAdded[lead.id] || lead.dnc;

  const addQuickNote = () =>
    update((s) => {
      const text = s.noteDraft.trim();
      if (!text) return {};
      return {
        quickNotes: {
          ...s.quickNotes,
          [lead.id]: [...(s.quickNotes[lead.id] ?? []), text],
        },
        noteDraft: "",
      };
    });

  const addDetailedNote = () =>
    update((s) => {
      const headline = s.noteHead.trim();
      if (!headline) return {};
      return {
        detailedNotes: {
          ...s.detailedNotes,
          [lead.id]: [
            ...(s.detailedNotes[lead.id] ?? []),
            { headline, body: s.noteBody.trim(), date: "Today", author: "you" },
          ],
        },
        noteHead: "",
        noteBody: "",
      };
    });

  const addContact = () =>
    update((s) => {
      const name = s.contactName.trim();
      if (!name) return {};
      return {
        addedContacts: {
          ...s.addedContacts,
          [lead.id]: [
            ...(s.addedContacts[lead.id] ?? []),
            {
              id: `${lead.id}-${name.toLowerCase().replace(/\s+/g, "-")}`,
              name,
              role: s.contactRole.trim() || "Contact",
              email: s.contactEmail.trim() || undefined,
              phone: s.contactPhone.trim() || undefined,
              isPrimary: false,
            },
          ],
        },
        contactName: "",
        contactRole: "",
        contactEmail: "",
        contactPhone: "",
        addContactOpen: false,
      };
    });

  return (
    <>
      <div
        onClick={closeDrawer}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,22,40,0.30)",
          zIndex: 15,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 760,
          maxWidth: "92vw",
          background: "#fff",
          zIndex: 16,
          boxShadow: "-24px 0 48px rgba(10,22,40,0.10)",
          display: "flex",
          flexDirection: "column",
          animation: "go-slidein 280ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: "22px 28px",
            borderBottom: "1px solid #F4F6FA",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {lead.name}
              </h2>
              <StageChip stage={stage} />
            </div>
            <span style={{ fontSize: 13, color: "#6C757D" }}>
              {lead.type} · {lead.suburb} · Size {lead.sizeBand}{" "}
              <span
                title="Estimated from public signals — not exact"
                style={{ cursor: "help" }}
              >
                ⓘ
              </span>{" "}
              · {lead.driveTime} from venue
            </span>
          </div>
          <span
            className="go-dim"
            onClick={closeDrawer}
            style={{
              marginLeft: "auto",
              fontSize: 17,
              lineHeight: 1,
              padding: 2,
            }}
          >
            ✕
          </span>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 0,
          }}
        >
          <div
            style={{
              padding: "22px 24px 28px 28px",
              borderRight: "1px solid #F4F6FA",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13.5,
                lineHeight: 1.6,
                color: "#303a4a",
                background: "rgba(0,194,168,0.05)",
                border: "1px solid rgba(0,194,168,0.2)",
                borderRadius: 8,
                padding: "12px 14px",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#00a891",
                  display: "block",
                  paddingBottom: 4,
                }}
              >
                ✦ AI summary
              </span>
              {lead.aiSummary}
            </p>
            <div
              style={{
                height: 96,
                borderRadius: 8,
                background:
                  "repeating-linear-gradient(45deg,#F4F6FA,#F4F6FA 8px,#eef1f6 8px,#eef1f6 16px)",
                border: "1px solid #E8ECF0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#6C757D",
                  background: "#fff",
                  border: "1px solid #E8ECF0",
                  borderRadius: 100,
                  padding: "4px 12px",
                }}
              >
                Map — {lead.address}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "88px 1fr",
                gap: "7px 12px",
                fontSize: 13,
              }}
            >
              <span style={{ color: "#6C757D" }}>Entity</span>
              <span style={{ fontWeight: 500 }}>{lead.entityName}</span>
              <span style={{ color: "#6C757D" }}>ABN</span>
              <span style={{ fontWeight: 500 }}>{lead.abn}</span>
              <span style={{ color: "#6C757D" }}>Website</span>
              <span style={{ fontWeight: 500, color: "#00a891" }}>
                {lead.website}
              </span>
              <span style={{ color: "#6C757D" }}>Phone</span>
              <span style={{ fontWeight: 500 }}>{lead.phone}</span>
              <span style={{ color: "#6C757D" }}>Email</span>
              <span style={{ fontWeight: 500, wordBreak: "break-all" }}>
                {lead.email ?? "No published email"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                borderTop: "1px solid #F4F6FA",
                paddingTop: 14,
              }}
            >
              <span style={thStyle}>Contacts</span>
              {contacts.map((c) => {
                const isPrimary = c.name === primaryName;
                const detail =
                  [c.email, c.phone].filter(Boolean).join(" · ") ||
                  "no direct contact details yet";
                return (
                  <div
                    key={c.id}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(0,194,168,0.12)",
                        color: "#00775f",
                        fontSize: 11,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "none",
                      }}
                    >
                      {c.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <span
                        style={{ display: "flex", alignItems: "center", gap: 7 }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          {c.name}
                        </span>
                        {isPrimary && (
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
                      <span style={{ fontSize: 11.5, color: "#6C757D" }}>
                        {c.role}
                      </span>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: "#00a891",
                          wordBreak: "break-all",
                        }}
                      >
                        {detail}
                      </span>
                    </span>
                    {!isPrimary && (
                      <span
                        className="go-link"
                        onClick={() =>
                          update((s) => ({
                            primaryOverride: {
                              ...s.primaryOverride,
                              [lead.id]: c.name,
                            },
                          }))
                        }
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Make primary
                      </span>
                    )}
                  </div>
                );
              })}
              {!state.addContactOpen ? (
                <span
                  className="go-link"
                  onClick={() => patch({ addContactOpen: true })}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    alignSelf: "flex-start",
                  }}
                >
                  + Add contact
                </span>
              ) : (
                <div
                  style={{
                    background: "#F9FAFC",
                    border: "1px solid #E8ECF0",
                    borderRadius: 8,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.3fr 1fr",
                      gap: 8,
                    }}
                  >
                    <input
                      className="go-input"
                      value={state.contactName}
                      onChange={(e) => patch({ contactName: e.target.value })}
                      placeholder="Name"
                      style={smallInputStyle}
                    />
                    <input
                      className="go-input"
                      value={state.contactRole}
                      onChange={(e) => patch({ contactRole: e.target.value })}
                      placeholder="Role"
                      style={smallInputStyle}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.3fr 1fr",
                      gap: 8,
                    }}
                  >
                    <input
                      className="go-input"
                      value={state.contactEmail}
                      onChange={(e) => patch({ contactEmail: e.target.value })}
                      placeholder="Email (optional)"
                      style={smallInputStyle}
                    />
                    <input
                      className="go-input"
                      value={state.contactPhone}
                      onChange={(e) => patch({ contactPhone: e.target.value })}
                      placeholder="Phone (optional)"
                      style={smallInputStyle}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="go-btn-primary"
                      onClick={addContact}
                      style={{ fontSize: 12.5, padding: "7px 15px" }}
                    >
                      Add contact
                    </button>
                    <button
                      className="go-btn-ghost"
                      onClick={() => patch({ addContactOpen: false })}
                      style={{ fontSize: 12.5, padding: "7px 11px" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                borderTop: "1px solid #F4F6FA",
                paddingTop: 14,
                marginTop: "auto",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  className="go-btn-secondary"
                  onClick={() => update((s) => ({ remOpen: !s.remOpen }))}
                  style={{
                    fontSize: 12.5,
                    padding: "7px 13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon kind="rem" size={12} stroke="#9A5B00" />
                  Set reminder
                </button>
                <button
                  className="go-btn-amber"
                  onClick={() =>
                    update((s) => ({
                      stageOverrides: {
                        ...s.stageOverrides,
                        [lead.id]: "Potential",
                      },
                    }))
                  }
                  style={{ fontSize: 12.5, padding: "7px 13px" }}
                >
                  Mark as potential
                </button>
                <button
                  className="go-btn-grey"
                  onClick={() =>
                    update((s) => ({
                      stageOverrides: {
                        ...s.stageOverrides,
                        [lead.id]: "Not interested",
                      },
                    }))
                  }
                  style={{ fontSize: 12.5, padding: "7px 13px" }}
                >
                  Mark not interested
                </button>
              </div>
              {state.remOpen && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#F9FAFC",
                    border: "1px solid #E8ECF0",
                    borderRadius: 8,
                    padding: "10px 12px",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="date"
                    className="go-input"
                    value={state.remDate}
                    onChange={(e) => patch({ remDate: e.target.value })}
                    style={{ fontSize: 12.5, padding: "6px 9px" }}
                  />
                  <input
                    type="time"
                    className="go-input"
                    value={state.remTime}
                    onChange={(e) => patch({ remTime: e.target.value })}
                    style={{ fontSize: 12.5, padding: "6px 9px" }}
                  />
                  <span style={{ fontSize: 11.5, color: "#6C757D" }}>
                    time optional
                  </span>
                  <button
                    className="go-btn-primary"
                    onClick={() =>
                      update((s) => ({
                        reminders: {
                          ...s.reminders,
                          [lead.id]: {
                            date: s.remDate || "21 Jul",
                            time: s.remTime || undefined,
                          },
                        },
                        remOpen: false,
                        remDate: "",
                        remTime: "",
                      }))
                    }
                    style={{
                      fontSize: 12.5,
                      padding: "7px 14px",
                      marginLeft: "auto",
                    }}
                  >
                    Save reminder
                  </button>
                </div>
              )}
              {!state.dncConfirm ? (
                !onDnc ? (
                  <span
                    className="go-fade75"
                    onClick={() => patch({ dncConfirm: true })}
                    style={{ fontSize: 12, color: "#C03530" }}
                  >
                    Add to Do-Not-Contact
                  </span>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "#C03530",
                    }}
                  >
                    <Icon kind="dnc" size={11} stroke="#C03530" strokeWidth={1.5} />
                    On the do-not-contact list — permanently excluded from all
                    campaigns
                  </span>
                )
              ) : (
                <div
                  style={{
                    background: "rgba(192,53,48,0.05)",
                    border: "1.5px solid rgba(192,53,48,0.35)",
                    borderRadius: 8,
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span
                    style={{ fontSize: 12.5, lineHeight: 1.5, color: "#0A1628" }}
                  >
                    <strong>Add {lead.name} to Do-Not-Contact?</strong> They&apos;ll
                    be permanently excluded from all current and future
                    campaigns. This can&apos;t be undone from the app.
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        update((s) => ({
                          stageOverrides: {
                            ...s.stageOverrides,
                            [lead.id]: "Not interested",
                          },
                          dncAdded: { ...s.dncAdded, [lead.id]: true },
                          dncConfirm: false,
                        }))
                      }
                      style={{
                        fontFamily: "inherit",
                        fontSize: 12.5,
                        fontWeight: 600,
                        padding: "7px 14px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        background: "#C03530",
                        color: "#fff",
                      }}
                    >
                      Confirm — never contact
                    </button>
                    <button
                      className="go-btn-ghost"
                      onClick={() => patch({ dncConfirm: false })}
                      style={{ fontSize: 12.5, padding: "7px 12px" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              padding: "0 28px 24px 24px",
              display: "flex",
              flexDirection: "column",
              background: "#FBFCFE",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 18,
                borderBottom: "1px solid #E8ECF0",
                position: "sticky",
                top: 0,
                background: "#FBFCFE",
                zIndex: 2,
              }}
            >
              <span
                onClick={() => patch({ drawerTab: "timeline" })}
                style={tabStyle(state.drawerTab === "timeline")}
              >
                Timeline
              </span>
              <span
                onClick={() => patch({ drawerTab: "docs" })}
                style={tabStyle(state.drawerTab === "docs")}
              >
                Notes &amp; emails ({docs.length})
              </span>
            </div>
            {state.drawerTab === "timeline" && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    padding: "18px 0 16px",
                  }}
                >
                  {timeline.map((t, i) => {
                    const [colour, background] = categoryColours(t.kind);
                    const key = `${lead.id}-${i}`;
                    const expanded = !!state.expandedNotes[key];
                    return (
                      <div
                        key={key}
                        style={{ display: "flex", gap: 12, position: "relative" }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            flex: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            zIndex: 1,
                            color: colour,
                            background,
                          }}
                        >
                          <Icon kind={t.kind} />
                        </span>
                        {i < timeline.length - 1 && (
                          <span
                            style={{
                              position: "absolute",
                              left: 10.5,
                              top: 24,
                              bottom: -14,
                              width: 1.5,
                              background: "#E8ECF0",
                            }}
                          />
                        )}
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          {t.noteHeadline == null ? (
                            <span style={{ fontSize: 13, lineHeight: 1.45 }}>
                              {t.text}{" "}
                              {t.link && (
                                <span
                                  className="go-link"
                                  style={{ fontSize: 12, fontWeight: 600 }}
                                >
                                  {t.link}
                                </span>
                              )}
                            </span>
                          ) : (
                            <>
                              <span
                                onClick={() =>
                                  update((s) => ({
                                    expandedNotes: {
                                      ...s.expandedNotes,
                                      [key]: !s.expandedNotes[key],
                                    },
                                  }))
                                }
                                style={{
                                  fontSize: 13,
                                  lineHeight: 1.45,
                                  cursor: "pointer",
                                }}
                              >
                                Note: &quot;{t.noteHeadline}&quot;{" "}
                                {t.noteBody && (
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: "#00a891",
                                    }}
                                  >
                                    details ▾
                                  </span>
                                )}
                              </span>
                              {expanded && t.noteBody && (
                                <span
                                  style={{
                                    fontSize: 12.5,
                                    lineHeight: 1.55,
                                    color: "#303a4a",
                                    background: "#fff",
                                    border: "1px solid #E8ECF0",
                                    borderRadius: 8,
                                    padding: "10px 12px",
                                    marginTop: 4,
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {t.noteBody}
                                </span>
                              )}
                            </>
                          )}
                          <span style={{ fontSize: 11.5, color: "#9AA5B1" }}>
                            {t.date}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: "auto",
                    borderTop: "1px solid #E8ECF0",
                    paddingTop: 12,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignSelf: "flex-start",
                      background: "#F4F6FA",
                      border: "1px solid #E8ECF0",
                      borderRadius: 100,
                      padding: 2,
                    }}
                  >
                    <button
                      onClick={() => patch({ noteMode: "quick" })}
                      style={segStyle(state.noteMode === "quick", {
                        fontSize: 12,
                        padding: "5px 12px",
                      })}
                    >
                      Quick note
                    </button>
                    <button
                      onClick={() => patch({ noteMode: "detailed" })}
                      style={segStyle(state.noteMode === "detailed", {
                        fontSize: 12,
                        padding: "5px 12px",
                      })}
                    >
                      Detailed note
                    </button>
                  </div>
                  {state.noteMode === "quick" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        className="go-input"
                        value={state.noteDraft}
                        onChange={(e) => patch({ noteDraft: e.target.value })}
                        placeholder="One-line note…"
                        style={{
                          fontSize: 13,
                          padding: "8px 12px",
                          flex: 1,
                          background: "#fff",
                        }}
                      />
                      <button
                        className="go-btn-primary"
                        onClick={addQuickNote}
                        style={{ fontSize: 13, padding: "8px 15px" }}
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        className="go-input"
                        value={state.noteHead}
                        onChange={(e) => patch({ noteHead: e.target.value })}
                        placeholder="Headline — this is what shows in the timeline"
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          padding: "8px 12px",
                          background: "#fff",
                        }}
                      />
                      <textarea
                        className="go-input"
                        value={state.noteBody}
                        onChange={(e) => patch({ noteBody: e.target.value })}
                        rows={4}
                        placeholder="Details — paste email content, call notes, anything worth keeping…"
                        style={{
                          fontSize: 12.5,
                          lineHeight: 1.55,
                          padding: "9px 12px",
                          resize: "vertical",
                          background: "#fff",
                        }}
                      />
                      <button
                        className="go-btn-primary"
                        onClick={addDetailedNote}
                        style={{
                          fontSize: 13,
                          padding: "8px 16px",
                          alignSelf: "flex-start",
                        }}
                      >
                        Save note
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            {state.drawerTab === "docs" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "18px 0",
                }}
              >
                {docs.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      border: "1px solid #E8ECF0",
                      borderRadius: 10,
                      padding: "13px 15px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 7,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 9 }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          borderRadius: 100,
                          padding: "2px 9px",
                          flex: "none",
                          ...(doc.kind === "Email"
                            ? {
                                color: "#00775f",
                                background: "rgba(0,194,168,0.12)",
                              }
                            : doc.kind === "File"
                              ? {
                                  color: "#303964",
                                  background: "rgba(10,22,40,0.06)",
                                }
                              : {
                                  color: "#9A5B00",
                                  background: "rgba(255,170,0,0.14)",
                                }),
                        }}
                      >
                        {doc.kind}
                      </span>
                      <span
                        style={{ fontSize: 13, fontWeight: 600, minWidth: 0 }}
                      >
                        {doc.title}
                      </span>
                    </div>
                    <span style={{ fontSize: 11.5, color: "#9AA5B1" }}>
                      {doc.meta}
                    </span>
                    {doc.body && (
                      <span
                        style={{
                          fontSize: 12.5,
                          lineHeight: 1.6,
                          color: "#303a4a",
                          whiteSpace: "pre-wrap",
                          borderTop: "1px solid #F4F6FA",
                          paddingTop: 8,
                        }}
                      >
                        {doc.body}
                      </span>
                    )}
                  </div>
                ))}
                <span style={{ fontSize: 12, color: "#6C757D", paddingTop: 4 }}>
                  Paste emails or add attachments from your email client with a
                  detailed note — the headline shows in the timeline, the full
                  content lives here.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
