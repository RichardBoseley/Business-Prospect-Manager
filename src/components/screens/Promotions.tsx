"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { PencilIcon } from "@/components/icons";
import { PageHeader, Screen } from "@/components/Screen";
import { useApp } from "@/lib/store";

const statStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};
const statNumStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "-0.01em",
};
const statLabelStyle: CSSProperties = {
  fontSize: 10.5,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#6C757D",
};

export function PromotionsScreen() {
  const router = useRouter();
  const { state, patch, update } = useApp();

  const openWizard = () =>
    patch({
      wizOpen: true,
      wizStep: 1,
      wizEditId: null,
      wizName: "",
      wizDesc: "",
      wizPointInput: "",
    });

  return (
    <Screen maxWidth={1120} gap={24}>
      <PageHeader
        title="Promotions"
        subtitle="Every campaign starts from an offer worth talking about"
        action={
          <button
            className="go-btn-primary go-lift"
            onClick={openWizard}
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
          gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
          gap: 16,
        }}
      >
        {state.promotions.map((p) => {
          const active = p.status === "Active";
          return (
            <div
              key={p.id}
              className="go-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {p.name}
                </h3>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    flex: "none",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 100,
                      padding: "3px 10px",
                      ...(active
                        ? { color: "#0E8A63", background: "rgba(14,138,99,0.10)" }
                        : { color: "#9A5B00", background: "rgba(255,170,0,0.12)" }),
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: active ? "#0E8A63" : "#E8960C",
                      }}
                    />
                    {p.status}
                  </span>
                  <span
                    className="go-iconbtn"
                    title="Edit promotion"
                    onClick={() =>
                      patch({
                        wizOpen: true,
                        wizStep: 1,
                        wizEditId: p.id,
                        wizName: p.name,
                        wizDesc: p.description === "—" ? "" : p.description,
                        wizPointInput: "",
                      })
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                    }}
                  >
                    <PencilIcon />
                  </span>
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#6C757D",
                  lineHeight: 1.55,
                }}
              >
                {p.description}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: 8,
                  borderTop: "1px solid #F4F6FA",
                  paddingTop: 14,
                }}
              >
                <span style={statStyle}>
                  <span style={statNumStyle}>{p.metrics.targets}</span>
                  <span style={statLabelStyle}>Targets</span>
                </span>
                <span style={statStyle}>
                  <span style={statNumStyle}>{p.metrics.sent}</span>
                  <span style={statLabelStyle}>Sent</span>
                </span>
                <span style={statStyle}>
                  <span style={statNumStyle}>{p.metrics.opened}</span>
                  <span style={statLabelStyle}>Opened</span>
                </span>
                <span style={statStyle}>
                  <span style={statNumStyle}>{p.metrics.clicked}</span>
                  <span style={statLabelStyle}>Clicked</span>
                </span>
                <span style={statStyle}>
                  <span style={{ ...statNumStyle, color: "#00775f" }}>
                    {p.metrics.replied}
                  </span>
                  <span style={statLabelStyle}>Replied</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  className="go-link"
                  onClick={() => {
                    patch({ currentPromoId: p.id });
                    router.push("/find");
                  }}
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Find businesses →
                </span>
                {p.status === "Draft" && (
                  <button
                    className="go-btn-primary"
                    onClick={() =>
                      update((s) => ({
                        promotions: s.promotions.map((x) =>
                          x.id === p.id ? { ...x, status: "Active" } : x,
                        ),
                      }))
                    }
                    style={{
                      fontSize: 12.5,
                      padding: "6px 14px",
                      marginLeft: "auto",
                    }}
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
