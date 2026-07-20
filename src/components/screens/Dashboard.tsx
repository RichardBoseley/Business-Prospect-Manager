"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { panelStyle, StageChip, thStyle } from "@/components/chips";
import { Icon } from "@/components/icons";
import { PageHeader, Screen } from "@/components/Screen";
import { seedDashboardStats, seedFollowUpQueueIds } from "@/lib/data/seed";
import { EMPTY_PIPE_SEL, useApp } from "@/lib/store";
import type { Stage } from "@/lib/types";

const kpiCardStyle: CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  padding: "18px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)",
  cursor: "pointer",
};

const kpiLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "#6C757D",
};

const kpiNumberStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: 1,
};

const kpiMetaStyle: CSSProperties = { fontSize: 11.5, color: "#6C757D" };

const queueGrid = "2.2fr 1fr 1.3fr 1fr 84px";

export function DashboardScreen() {
  const router = useRouter();
  const { state, patch, businesses, stageOf, openLead } = useApp();
  const stats = seedDashboardStats;
  const limit = state.dailyLimit;
  const pct = Math.min(100, Math.round((stats.sentToday / limit) * 100));

  const goStage = (stage: Stage) => () => {
    patch({
      stageFilter: stage,
      listFilter: null,
      pipeSel: EMPTY_PIPE_SEL,
      openFilter: null,
    });
    router.push("/pipeline");
  };
  const goWarm = () => {
    patch({
      listFilter: "warm",
      stageFilter: null,
      pipeSel: EMPTY_PIPE_SEL,
      openFilter: null,
    });
    router.push("/pipeline");
  };

  const queueIds = [
    ...seedFollowUpQueueIds,
    ...Object.keys(state.reminders).filter(
      (id) => !seedFollowUpQueueIds.includes(id),
    ),
  ];
  const queueRows = queueIds
    .map((id) => businesses.find((b) => b.id === id))
    .filter((b) => b !== undefined);

  return (
    <Screen maxWidth={1120} gap={24}>
      <PageHeader
        title="Dashboard"
        subtitle="Friday 18 July · 4 leads need action today"
        action={
          <button
            className="go-btn-primary go-lift"
            onClick={() => router.push("/promotions")}
            style={{
              fontSize: 14,
              padding: "10px 20px",
              boxShadow: "0 4px 14px rgba(0,194,168,0.28)",
            }}
          >
            New promotion
          </button>
        }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
          gap: 14,
        }}
      >
        <div className="go-kpi" onClick={goStage("Contacted")} style={kpiCardStyle}>
          <span style={kpiLabelStyle}>Emails sent this week</span>
          <span style={kpiNumberStyle}>{stats.sentThisWeek}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
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
                  width: `${pct}%`,
                }}
              />
            </div>
            <span style={kpiMetaStyle}>
              {stats.sentToday} of {limit} daily limit used today
            </span>
          </div>
        </div>
        <div className="go-kpi" onClick={goStage("Opened")} style={kpiCardStyle}>
          <span style={kpiLabelStyle}>Opens</span>
          <span style={kpiNumberStyle}>{stats.opens}</span>
          <span style={kpiMetaStyle}>{stats.openRate} — indicative only</span>
        </div>
        <div className="go-kpi" onClick={goStage("Clicked")} style={kpiCardStyle}>
          <span style={kpiLabelStyle}>Clicks</span>
          <span style={kpiNumberStyle}>{stats.clicks}</span>
          <span style={kpiMetaStyle}>{stats.clickNote}</span>
        </div>
        <div className="go-kpi" onClick={goStage("Replied")} style={kpiCardStyle}>
          <span style={kpiLabelStyle}>Replies</span>
          <span style={kpiNumberStyle}>{stats.replies}</span>
          <span style={kpiMetaStyle}>{stats.repliesNote}</span>
        </div>
        <div
          className="go-warm"
          onClick={goWarm}
          style={{
            ...kpiCardStyle,
            border: "1.5px solid rgba(0,194,168,0.35)",
          }}
        >
          <span style={{ ...kpiLabelStyle, fontWeight: 600, color: "#00775f" }}>
            New warm leads
          </span>
          <span style={{ ...kpiNumberStyle, color: "#00775f" }}>
            {stats.warmLeads}
          </span>
          <span style={kpiMetaStyle}>clicked or replied</span>
        </div>
      </div>
      <div style={{ ...panelStyle, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            padding: "18px 24px 14px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Follow-up queue
          </h2>
          <span style={{ fontSize: 12, color: "#6C757D" }}>
            replied or clicked and not yet actioned, plus reminders due
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: queueGrid,
            gap: 12,
            padding: "8px 24px",
            borderTop: "1px solid #E8ECF0",
            borderBottom: "1px solid #E8ECF0",
            background: "#F9FAFC",
          }}
        >
          <span style={thStyle}>Business</span>
          <span style={thStyle}>Suburb</span>
          <span style={thStyle}>Last activity</span>
          <span style={thStyle}>Stage</span>
          <span />
        </div>
        {queueRows.map((b) => {
          const reminder = state.reminders[b.id];
          return (
            <div
              key={b.id}
              className="go-row"
              onClick={() => openLead(b.id)}
              style={{
                display: "grid",
                gridTemplateColumns: queueGrid,
                gap: 12,
                alignItems: "center",
                padding: "13px 24px",
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
                <span style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</span>
                <span style={{ fontSize: 12, color: "#6C757D" }}>{b.type}</span>
              </span>
              <span style={{ fontSize: 13, color: "#6C757D" }}>{b.suburb}</span>
              <span style={{ minWidth: 0 }}>
                {reminder ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#9A5B00",
                      background: "rgba(255,170,0,0.12)",
                      borderRadius: 100,
                      padding: "2px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon kind="rem" size={10} stroke="#9A5B00" strokeWidth={1.5} />
                    Reminder — {reminder.date || "21 Jul"}
                    {reminder.time ? ` ${reminder.time}` : ""}
                  </span>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {b.lastActivity}
                  </span>
                )}
              </span>
              <span>
                <StageChip stage={stageOf(b)} />
              </span>
              <button
                className="go-btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  openLead(b.id);
                }}
                style={{ fontSize: 12.5, padding: "6px 14px" }}
              >
                View
              </button>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
