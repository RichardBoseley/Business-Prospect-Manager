/**
 * Shared chip/pill styling ported from the prototype: stage chips (one colour,
 * one meaning), fit-score pills (colour-banded), size badges and toggle chips.
 */

import type { CSSProperties } from "react";
import type { Stage, TimelineKind } from "@/lib/types";

/** [text colour, background, dot colour] per stage. */
const STAGE_COLOURS: Record<Stage, [string, string, string]> = {
  New: ["#6C757D", "#F4F6FA", "#9AA5B1"],
  Selected: ["#303964", "rgba(10,22,40,0.06)", "#303964"],
  Contacted: ["#00775f", "rgba(0,194,168,0.10)", "#00C2A8"],
  Opened: ["#00775f", "rgba(0,194,168,0.10)", "#00C2A8"],
  Clicked: ["#00775f", "rgba(0,194,168,0.16)", "#00a891"],
  Replied: ["#0E8A63", "rgba(14,138,99,0.10)", "#0E8A63"],
  Potential: ["#9A5B00", "rgba(255,170,0,0.12)", "#E8960C"],
  Booked: ["#0E8A63", "rgba(14,138,99,0.14)", "#0E8A63"],
  "Not interested": ["#C03530", "rgba(192,53,48,0.08)", "#C03530"],
};

export function StageChip({ stage }: { stage: Stage }) {
  const [colour, background, dot] = STAGE_COLOURS[stage] ?? STAGE_COLOURS.New;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 100,
        padding: "3px 10px",
        whiteSpace: "nowrap",
        color: colour,
        background,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          flex: "none",
          background: dot,
        }}
      />
      {stage}
    </span>
  );
}

export function FitPill({ fit }: { fit: number }) {
  const [colour, background] =
    fit >= 80
      ? ["#0E8A63", "rgba(14,138,99,0.10)"]
      : fit >= 65
        ? ["#00775f", "rgba(0,194,168,0.12)"]
        : ["#9A5B00", "rgba(255,170,0,0.12)"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 38,
        fontSize: 12.5,
        fontWeight: 700,
        borderRadius: 100,
        padding: "3px 9px",
        color: colour,
        background,
      }}
    >
      {fit}
    </span>
  );
}

export function SizeBadge({ size }: { size: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 22,
        borderRadius: 5,
        fontSize: 11.5,
        fontWeight: 700,
        background: "#F4F6FA",
        border: "1px solid #E8ECF0",
        color: "#6C757D",
      }}
    >
      {size}
    </span>
  );
}

/** Toggle chip (find criteria, wizard selling points, settings areas). */
export function toggleChipStyle(on: boolean): CSSProperties {
  return on
    ? {
        fontFamily: "inherit",
        fontSize: 13,
        padding: "6px 13px",
        borderRadius: 100,
        cursor: "pointer",
        transition: "border-color 150ms",
        background: "rgba(0,194,168,0.10)",
        border: "1.5px solid rgba(0,194,168,0.45)",
        color: "#00775f",
        fontWeight: 600,
      }
    : {
        fontFamily: "inherit",
        fontSize: 13,
        padding: "6px 13px",
        borderRadius: 100,
        cursor: "pointer",
        transition: "border-color 150ms",
        background: "#fff",
        border: "1.5px solid #E8ECF0",
        color: "#0A1628",
        fontWeight: 500,
      };
}

/** Segmented-control button (location mode, size mode, note composer mode). */
export function segStyle(
  on: boolean,
  overrides?: CSSProperties,
): CSSProperties {
  return {
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
    padding: "7px 16px",
    borderRadius: 100,
    cursor: "pointer",
    border: "none",
    transition: "background 150ms",
    ...(on
      ? { background: "#0A1628", color: "#fff" }
      : { background: "transparent", color: "#6C757D" }),
    ...overrides,
  };
}

/** Uppercase table-header label. */
export const thStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#6C757D",
};

/** White panel card. */
export const panelStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #E8ECF0",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)",
};
