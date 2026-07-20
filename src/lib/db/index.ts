/**
 * SQLite connection + schema + first-run seeding. Server-only.
 *
 * The database file lives at a stable path outside the repo checkout on the
 * server (/var/app/data/app.db) and falls back to ./.data/app.db for local
 * development. It is created and seeded automatically on first run — a fresh
 * clone needs no env vars and no manual migration step. Set DB_PATH to
 * override.
 *
 * Multi-tenant from day one: every business, promotion, contact, note, email
 * and DNC entry belongs to a workspace.
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import {
  seedApprovedIds,
  seedBusinesses,
  seedDetailedNotes,
  seedDncEntries,
  seedPromotionMembers,
  seedPromotions,
  seedSavedLists,
  seedSelectedAreas,
  seedSelectedIds,
  seedWorkspace,
} from "../data/seed";
import { draftingService } from "../services/drafting";

export const DEFAULT_WORKSPACE_ID = "game-on";

function resolveDbPath(): string {
  if (process.env.DB_PATH) return process.env.DB_PATH;
  const stable = "/var/app/data";
  try {
    fs.accessSync(stable, fs.constants.W_OK);
    return path.join(stable, "app.db");
  } catch {
    const local = path.join(process.cwd(), ".data");
    fs.mkdirSync(local, { recursive: true });
    return path.join(local, "app.db");
  }
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  daily_send_limit INTEGER NOT NULL DEFAULT 30,
  show_rationale INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  is_primary INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS named_areas (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  selected INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (workspace_id, name)
);
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft',
  selling_points TEXT NOT NULL DEFAULT '[]',
  audiences TEXT NOT NULL DEFAULT '[]',
  targets INTEGER NOT NULL DEFAULT 0,
  sent INTEGER NOT NULL DEFAULT 0,
  opened INTEGER NOT NULL DEFAULT 0,
  clicked INTEGER NOT NULL DEFAULT 0,
  replied INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS promotion_members (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  promotion_id TEXT NOT NULL REFERENCES promotions(id),
  business_id TEXT NOT NULL,
  PRIMARY KEY (promotion_id, business_id)
);
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  suburb TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  size_band TEXT NOT NULL DEFAULT 'S',
  contact_method TEXT NOT NULL DEFAULT 'email',
  email TEXT,
  phone TEXT,
  website TEXT,
  abn TEXT,
  entity_name TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  drive_time TEXT NOT NULL DEFAULT '',
  fit INTEGER NOT NULL DEFAULT 0,
  rationale TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'New',
  last_activity TEXT NOT NULL DEFAULT '',
  ai_summary TEXT NOT NULL DEFAULT '',
  hook TEXT NOT NULL DEFAULT '',
  previously_contacted TEXT,
  dnc INTEGER NOT NULL DEFAULT 0,
  selected INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  business_id TEXT NOT NULL REFERENCES businesses(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Contact',
  email TEXT,
  phone TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  business_id TEXT NOT NULL REFERENCES businesses(id),
  headline TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  business_id TEXT NOT NULL REFERENCES businesses(id),
  promotion_id TEXT REFERENCES promotions(id),
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  variant INTEGER NOT NULL DEFAULT 0,
  approved INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS dnc_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  business_name TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT 'Manual',
  date TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS saved_lists (
  id TEXT NOT NULL,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  label TEXT NOT NULL,
  sort INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (workspace_id, id)
);
CREATE TABLE IF NOT EXISTS saved_list_members (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  list_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  PRIMARY KEY (workspace_id, list_id, business_id)
);
`;

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  ensureSchemaAndSeed(db);
  return db;
}

/** Idempotent: creates missing tables and seeds only when empty. */
export function ensureDatabase(): void {
  getDb();
}

function ensureSchemaAndSeed(d: Database.Database): void {
  d.exec(SCHEMA);
  const count = d
    .prepare("SELECT COUNT(*) AS n FROM workspaces")
    .get() as { n: number };
  if (count.n > 0) return;
  seed(d);
}

function seed(d: Database.Database): void {
  const ws = DEFAULT_WORKSPACE_ID;
  const tx = d.transaction(() => {
    d.prepare(
      "INSERT INTO workspaces (id, name, location, daily_send_limit, show_rationale) VALUES (?,?,?,?,?)",
    ).run(
      ws,
      seedWorkspace.name,
      seedWorkspace.location,
      seedWorkspace.dailySendLimit,
      seedWorkspace.showRationale ? 1 : 0,
    );

    const venueStmt = d.prepare(
      "INSERT INTO venues (id, workspace_id, name, address, is_primary, sort) VALUES (?,?,?,?,?,?)",
    );
    seedWorkspace.venues.forEach((v, i) =>
      venueStmt.run(v.id, ws, v.name, v.address, v.id === seedWorkspace.primaryVenueId ? 1 : 0, i),
    );

    const areaStmt = d.prepare(
      "INSERT INTO named_areas (workspace_id, name, selected, sort) VALUES (?,?,?,?)",
    );
    seedWorkspace.namedAreas.forEach((a, i) =>
      areaStmt.run(ws, a, seedSelectedAreas.includes(a) ? 1 : 0, i),
    );

    const promoStmt = d.prepare(
      `INSERT INTO promotions (id, workspace_id, name, description, status, selling_points, audiences,
        targets, sent, opened, clicked, replied, sort) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    );
    seedPromotions.forEach((p, i) =>
      promoStmt.run(
        p.id, ws, p.name, p.description, p.status,
        JSON.stringify(p.sellingPoints), JSON.stringify(p.audiences),
        p.metrics.targets, p.metrics.sent, p.metrics.opened, p.metrics.clicked,
        p.metrics.replied, i,
      ),
    );

    const memberStmt = d.prepare(
      "INSERT INTO promotion_members (workspace_id, promotion_id, business_id) VALUES (?,?,?)",
    );
    Object.entries(seedPromotionMembers).forEach(([promoId, ids]) =>
      ids.forEach((bid) => memberStmt.run(ws, promoId, bid)),
    );

    const bizStmt = d.prepare(
      `INSERT INTO businesses (id, workspace_id, name, suburb, type, industry, size_band, contact_method,
        email, phone, website, abn, entity_name, address, drive_time, fit, rationale, stage,
        last_activity, ai_summary, hook, previously_contacted, dnc, selected, sort)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    );
    const contactStmt = d.prepare(
      "INSERT INTO contacts (id, workspace_id, business_id, name, role, email, phone, is_primary, sort) VALUES (?,?,?,?,?,?,?,?,?)",
    );
    seedBusinesses.forEach((b, i) => {
      bizStmt.run(
        b.id, ws, b.name, b.suburb, b.type, b.industry, b.sizeBand,
        b.contactMethod, b.email ?? null, b.phone ?? null, b.website ?? null,
        b.abn ?? null, b.entityName, b.address, b.driveTime, b.fit,
        b.rationale, b.stage, b.lastActivity, b.aiSummary, b.hook,
        b.previouslyContacted ? b.previouslyContacted.period : null,
        b.dnc ? 1 : 0, seedSelectedIds.includes(b.id) ? 1 : 0, i,
      );
      b.contacts.forEach((c, j) =>
        contactStmt.run(c.id, ws, b.id, c.name, c.role, c.email ?? null, c.phone ?? null, c.isPrimary ? 1 : 0, j),
      );
    });

    const noteStmt = d.prepare(
      "INSERT INTO notes (workspace_id, business_id, headline, body, date, author) VALUES (?,?,?,?,?,?)",
    );
    Object.entries(seedDetailedNotes).forEach(([bid, notes]) =>
      notes.forEach((n) => noteStmt.run(ws, bid, n.headline, n.body ?? "", n.date, n.author)),
    );

    const emailStmt = d.prepare(
      "INSERT INTO emails (workspace_id, business_id, promotion_id, subject, body, variant, approved) VALUES (?,?,?,?,?,?,?)",
    );
    seedApprovedIds.forEach((bid) => {
      const b = seedBusinesses.find((x) => x.id === bid);
      if (!b) return;
      const draft = draftingService.draft(b, 0);
      emailStmt.run(ws, bid, "xmas", draft.subject, draft.body, 0, 1);
    });

    const dncStmt = d.prepare(
      "INSERT INTO dnc_entries (workspace_id, business_name, detail, reason, date) VALUES (?,?,?,?,?)",
    );
    seedDncEntries.forEach((e) =>
      dncStmt.run(ws, e.businessName, e.detail, e.reason, e.date),
    );

    const listStmt = d.prepare(
      "INSERT INTO saved_lists (id, workspace_id, label, sort) VALUES (?,?,?,?)",
    );
    const listMemberStmt = d.prepare(
      "INSERT INTO saved_list_members (workspace_id, list_id, business_id) VALUES (?,?,?)",
    );
    seedSavedLists.forEach((l, i) => {
      listStmt.run(l.id, ws, l.label, i);
      l.memberIds.forEach((bid) => listMemberStmt.run(ws, l.id, bid));
    });
  });
  tx();
}
