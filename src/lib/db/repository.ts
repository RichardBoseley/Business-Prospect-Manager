/**
 * Read/write access to the SQLite data layer, shaped to the entity types the
 * UI already consumes. Server-only.
 */

import { DEFAULT_WORKSPACE_ID, getDb } from "./index";
import type {
  Business,
  Contact,
  DNCEntry,
  Note,
  Promotion,
  SavedList,
  SizeBand,
  Stage,
  Venue,
} from "../types";

export interface WorkspaceBootstrap {
  workspace: {
    id: string;
    name: string;
    location: string;
    dailySendLimit: number;
    showRationale: boolean;
  };
  venues: Venue[];
  primaryVenueIndex: number;
  areas: { name: string; selected: boolean }[];
  promotions: Promotion[];
  promotionMembers: Record<string, string[]>;
  businesses: Business[];
  detailedNotes: Record<string, Note[]>;
  approvedIds: string[];
  selectedIds: string[];
  dncEntries: DNCEntry[];
  savedLists: SavedList[];
}

interface BusinessRow {
  id: string;
  name: string;
  suburb: string;
  type: string;
  industry: string;
  size_band: string;
  contact_method: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  abn: string | null;
  entity_name: string;
  address: string;
  drive_time: string;
  fit: number;
  rationale: string;
  stage: string;
  last_activity: string;
  ai_summary: string;
  hook: string;
  previously_contacted: string | null;
  dnc: number;
  selected: number;
}

export function getWorkspaceBootstrap(
  workspaceId = DEFAULT_WORKSPACE_ID,
): WorkspaceBootstrap {
  const db = getDb();
  const ws = db
    .prepare("SELECT * FROM workspaces WHERE id = ?")
    .get(workspaceId) as {
    id: string;
    name: string;
    location: string;
    daily_send_limit: number;
    show_rationale: number;
  };

  const venueRows = db
    .prepare("SELECT * FROM venues WHERE workspace_id = ? ORDER BY sort")
    .all(workspaceId) as {
    id: string;
    name: string;
    address: string;
    is_primary: number;
  }[];

  const areas = (
    db
      .prepare("SELECT name, selected FROM named_areas WHERE workspace_id = ? ORDER BY sort")
      .all(workspaceId) as { name: string; selected: number }[]
  ).map((a) => ({ name: a.name, selected: !!a.selected }));

  const promotions = (
    db
      .prepare("SELECT * FROM promotions WHERE workspace_id = ? ORDER BY sort")
      .all(workspaceId) as {
      id: string;
      name: string;
      description: string;
      status: string;
      selling_points: string;
      audiences: string;
      targets: number;
      sent: number;
      opened: number;
      clicked: number;
      replied: number;
    }[]
  ).map(
    (p): Promotion => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status as Promotion["status"],
      sellingPoints: JSON.parse(p.selling_points),
      audiences: JSON.parse(p.audiences),
      photos: [],
      metrics: {
        targets: p.targets,
        sent: p.sent,
        opened: p.opened,
        clicked: p.clicked,
        replied: p.replied,
      },
    }),
  );

  const promotionMembers: Record<string, string[]> = {};
  (
    db
      .prepare("SELECT promotion_id, business_id FROM promotion_members WHERE workspace_id = ?")
      .all(workspaceId) as { promotion_id: string; business_id: string }[]
  ).forEach((m) => {
    (promotionMembers[m.promotion_id] ??= []).push(m.business_id);
  });

  const contactRows = db
    .prepare("SELECT * FROM contacts WHERE workspace_id = ? ORDER BY sort")
    .all(workspaceId) as {
    id: string;
    business_id: string;
    name: string;
    role: string;
    email: string | null;
    phone: string | null;
    is_primary: number;
  }[];
  const contactsByBusiness: Record<string, Contact[]> = {};
  contactRows.forEach((c) => {
    (contactsByBusiness[c.business_id] ??= []).push({
      id: c.id,
      name: c.name,
      role: c.role,
      email: c.email ?? undefined,
      phone: c.phone ?? undefined,
      isPrimary: !!c.is_primary,
    });
  });

  const businessRows = db
    .prepare("SELECT * FROM businesses WHERE workspace_id = ? ORDER BY sort")
    .all(workspaceId) as BusinessRow[];
  const businesses = businessRows.map(
    (b): Business => ({
      id: b.id,
      name: b.name,
      suburb: b.suburb,
      type: b.type,
      industry: b.industry,
      sizeBand: b.size_band as SizeBand,
      contactMethod: b.contact_method as Business["contactMethod"],
      email: b.email ?? undefined,
      phone: b.phone ?? undefined,
      website: b.website ?? undefined,
      abn: b.abn ?? undefined,
      entityName: b.entity_name,
      address: b.address,
      driveTime: b.drive_time,
      fit: b.fit,
      rationale: b.rationale,
      stage: b.stage as Stage,
      lastActivity: b.last_activity,
      aiSummary: b.ai_summary,
      hook: b.hook,
      previouslyContacted: b.previously_contacted
        ? { period: b.previously_contacted }
        : undefined,
      dnc: !!b.dnc,
      contacts: contactsByBusiness[b.id] ?? [],
    }),
  );

  const detailedNotes: Record<string, Note[]> = {};
  (
    db
      .prepare("SELECT * FROM notes WHERE workspace_id = ? ORDER BY id")
      .all(workspaceId) as {
      business_id: string;
      headline: string;
      body: string;
      date: string;
      author: string;
    }[]
  ).forEach((n) => {
    (detailedNotes[n.business_id] ??= []).push({
      headline: n.headline,
      body: n.body || undefined,
      date: n.date,
      author: n.author,
    });
  });

  const approvedIds = (
    db
      .prepare("SELECT DISTINCT business_id FROM emails WHERE workspace_id = ? AND approved = 1")
      .all(workspaceId) as { business_id: string }[]
  ).map((r) => r.business_id);

  const dncEntries = (
    db
      .prepare("SELECT * FROM dnc_entries WHERE workspace_id = ? ORDER BY id")
      .all(workspaceId) as {
      business_name: string;
      detail: string;
      reason: string;
      date: string;
    }[]
  ).map(
    (e): DNCEntry => ({
      businessName: e.business_name,
      detail: e.detail,
      reason: e.reason as DNCEntry["reason"],
      date: e.date,
      permanent: true,
    }),
  );

  const savedLists = (
    db
      .prepare("SELECT * FROM saved_lists WHERE workspace_id = ? ORDER BY sort")
      .all(workspaceId) as { id: string; label: string }[]
  ).map((l): SavedList => {
    const memberIds = (
      db
        .prepare("SELECT business_id FROM saved_list_members WHERE workspace_id = ? AND list_id = ?")
        .all(workspaceId, l.id) as { business_id: string }[]
    ).map((m) => m.business_id);
    return { id: l.id, label: l.label, memberIds };
  });

  return {
    workspace: {
      id: ws.id,
      name: ws.name,
      location: ws.location,
      dailySendLimit: ws.daily_send_limit,
      showRationale: !!ws.show_rationale,
    },
    venues: venueRows.map((v) => ({ id: v.id, name: v.name, address: v.address })),
    primaryVenueIndex: Math.max(0, venueRows.findIndex((v) => v.is_primary)),
    areas,
    promotions,
    promotionMembers,
    businesses,
    detailedNotes,
    approvedIds,
    selectedIds: businessRows.filter((b) => b.selected).map((b) => b.id),
    dncEntries,
    savedLists,
  };
}

/**
 * Permanently add a business to the do-not-contact register (Spam Act 2003 —
 * there is deliberately no delete path).
 */
export function addToDnc(
  businessId: string,
  reason: DNCEntry["reason"],
  date: string,
  workspaceId = DEFAULT_WORKSPACE_ID,
): DNCEntry | null {
  const db = getDb();
  const b = db
    .prepare("SELECT name, type, suburb FROM businesses WHERE workspace_id = ? AND id = ?")
    .get(workspaceId, businessId) as
    | { name: string; type: string; suburb: string }
    | undefined;
  if (!b) return null;
  const detail = `${b.type} · ${b.suburb}`;
  const tx = db.transaction(() => {
    db.prepare(
      "UPDATE businesses SET dnc = 1, selected = 0, stage = 'Not interested' WHERE workspace_id = ? AND id = ?",
    ).run(workspaceId, businessId);
    db.prepare(
      "INSERT INTO dnc_entries (workspace_id, business_name, detail, reason, date) VALUES (?,?,?,?,?)",
    ).run(workspaceId, b.name, detail, reason, date);
  });
  tx();
  return { businessName: b.name, detail, reason, date, permanent: true };
}
