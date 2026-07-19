/**
 * Bespoke inline SVG icon set copied from the prototype — stroke-only,
 * 1.3–1.8px, rounded caps and joins. All draw in a 14x14 viewBox.
 */

import type { TimelineKind } from "@/lib/types";

const PATHS: Record<TimelineKind, string> = {
  search: '<circle cx="6.3" cy="6.3" r="3.8"/><path d="m9.2 9.2 2.8 2.8"/>',
  flag: '<path d="M3.5 12.5V2.5h7L8.8 5l1.7 2.5h-7"/>',
  mail: '<rect x="1.8" y="3.2" width="10.4" height="7.6" rx="1.2"/><path d="m2.2 4 4.8 3.6L11.8 4"/>',
  open: '<path d="M1.5 7s2-3.8 5.5-3.8S12.5 7 12.5 7s-2 3.8-5.5 3.8S1.5 7 1.5 7Z"/><circle cx="7" cy="7" r="1.6"/>',
  click: '<path d="M4 2.5 10.5 8l-2.8.5 1.6 3-1.5.7-1.6-3-2 2Z"/>',
  reply: '<path d="M5.5 3 2 6.5 5.5 10"/><path d="M2 6.5h6a4 4 0 0 1 4 4v1"/>',
  note: '<path d="m9.5 2 2.5 2.5-6.5 6.5-3 .5.5-3Z"/>',
  rem: '<path d="M7 2a3.6 3.6 0 0 1 3.6 3.6c0 2.7 1 3.4 1 3.4H2.4s1-.7 1-3.4A3.6 3.6 0 0 1 7 2Z"/><path d="M5.8 11.2a1.3 1.3 0 0 0 2.4 0"/>',
  dnc: '<rect x="3" y="6" width="8" height="5.5" rx="1.2"/><path d="M4.8 6V4.6a2.2 2.2 0 0 1 4.4 0V6"/>',
  book: '<rect x="2" y="3" width="10" height="9" rx="1.2"/><path d="M2 5.8h10M4.8 2v2M9.2 2v2"/><path d="m5.2 8.6 1.3 1.3 2.4-2.4"/>',
  phone:
    '<path d="M3 2.5h2.2l1 2.6-1.3 1a7.5 7.5 0 0 0 3 3l1-1.3 2.6 1V11a1.5 1.5 0 0 1-1.6 1.5A9.9 9.9 0 0 1 1.5 4.1 1.5 1.5 0 0 1 3 2.5Z"/>',
};

export function Icon({
  kind,
  size = 12,
  stroke = "currentColor",
  strokeWidth = 1.4,
}: {
  kind: TimelineKind;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: PATHS[kind] ?? PATHS.search }}
    />
  );
}

/** Tick used in checkboxes and the approved badge. */
export function Tick({
  size = 11,
  stroke = "#0A1628",
  strokeWidth = 1.8,
}: {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none">
      <path
        d="M2 5.8 4.4 8 9 3"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Contact person icon (named contact, teal). */
export function PersonIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="#00a891"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="4.6" r="2.2" />
      <path d="M2.8 12a4.4 4.4 0 0 1 8.4 0" />
    </svg>
  );
}

/** Padlock outline used on the DNC screen header/rows. */
export function PadlockIcon({
  size = 13,
  stroke = "#6C757D",
}: {
  size?: number;
  stroke?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <rect
        x="2.5"
        y="6"
        width="9"
        height="6"
        rx="1.5"
        stroke={stroke}
        strokeWidth={1.4}
      />
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke={stroke} strokeWidth={1.4} />
    </svg>
  );
}

/** Pencil edit icon (promotion card icon-button). */
export function PencilIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9.5 2 2.5 2.5-6.5 6.5-3 .5.5-3Z" />
    </svg>
  );
}
