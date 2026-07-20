/**
 * Entity types for outreach by smallteam.ai, shaped after the handoff README's
 * "State Management (real build)" section. The mock repository and services
 * return these; real persistence and integrations can swap in behind the same
 * shapes.
 */

export type SizeBand = "S" | "M" | "L";

export type Stage =
  | "New"
  | "Selected"
  | "Contacted"
  | "Opened"
  | "Clicked"
  | "Replied"
  | "Potential"
  | "Booked"
  | "Not interested";

export const STAGES: Stage[] = [
  "New",
  "Selected",
  "Contacted",
  "Opened",
  "Clicked",
  "Replied",
  "Potential",
  "Booked",
  "Not interested",
];

/** How the discovery source found a way to reach the business. */
export type ContactMethod = "email" | "named" | "phone";

export interface Venue {
  id: string;
  name: string;
  address: string;
}

/** Workspace — the customer business (multi-tenant by design). */
export interface Workspace {
  name: string;
  location: string;
  venues: Venue[];
  /** Default venue for "distance from venue" searches. */
  primaryVenueId: string;
  /** The area list offered in Find businesses. */
  namedAreas: string[];
  /** Per-day send batch cap, configurable 10–50. */
  dailySendLimit: number;
  /** Show the AI fit-rationale line on the shortlist. */
  showRationale: boolean;
}

export interface PromotionMetrics {
  targets: number;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
}

export type PromotionStatus = "Active" | "Draft";

export interface Promotion {
  id: string;
  name: string;
  description: string;
  sellingPoints: string[];
  audiences: string[];
  photos: string[];
  status: PromotionStatus;
  metrics: PromotionMetrics;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  /** Primary is changeable over time (e.g. handover from manager to owner). */
  isPrimary: boolean;
}

export interface Business {
  id: string;
  name: string;
  suburb: string;
  /** Business type, e.g. "Dance school". */
  type: string;
  industry: string;
  /** Estimated from public signals — not exact. */
  sizeBand: SizeBand;
  contactMethod: ContactMethod;
  email?: string;
  phone?: string;
  website?: string;
  abn?: string;
  entityName: string;
  address: string;
  /** Drive time from the primary venue, e.g. "14 min". */
  driveTime: string;
  /** AI fit score (0–100) against the current promotion. */
  fit: number;
  /** One-line AI rationale for the fit score. */
  rationale: string;
  stage: Stage;
  lastActivity: string;
  aiSummary: string;
  /** Personalised opening line the drafting service leads with. */
  hook: string;
  /** Set when a previous campaign already touched this business. */
  previouslyContacted?: { period: string };
  /** Permanently excluded — mirrored by a DNCEntry. */
  dnc: boolean;
  contacts: Contact[];
}

export type TimelineKind =
  | "search"
  | "flag"
  | "mail"
  | "open"
  | "click"
  | "reply"
  | "note"
  | "rem"
  | "dnc"
  | "book"
  | "phone";

export interface TimelineEvent {
  kind: TimelineKind;
  date: string;
  /** Plain entry text (mutually exclusive with note headline/body). */
  text?: string;
  /** Note entries show the headline in the timeline; body expands. */
  noteHeadline?: string;
  noteBody?: string;
  /** "View email" / "View reply" style link label. */
  link?: string;
}

export interface Note {
  headline: string;
  body?: string;
  date: string;
  author: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export interface Reminder {
  date: string;
  /** Optional — reminders can be date-only. */
  time?: string;
}

export type DNCReason =
  | "Unsubscribed via link"
  | "Requested by reply"
  | "Manual"
  | "Manual — added from lead detail";

export interface DNCEntry {
  businessName: string;
  detail: string;
  reason: DNCReason;
  date: string;
  /** Always true — the register is permanent under the Spam Act 2003. */
  permanent: true;
}

/** A record card on the lead drawer's "Notes & emails" tab. */
export interface LeadDoc {
  kind: "Note" | "Email" | "File";
  title: string;
  meta: string;
  body?: string;
}

export interface SavedList {
  id: string;
  label: string;
  memberIds: string[];
}
