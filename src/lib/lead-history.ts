/**
 * Builds a lead's timeline and its "Notes & emails" records from the seed
 * activity plus anything added this session. Ported from the prototype's
 * timeline()/docsOf() so every business shows the same history as the design.
 */

import type {
  Business,
  EmailDraft,
  LeadDoc,
  Note,
  Reminder,
  Stage,
  TimelineEvent,
} from "./types";

const STAGE_RANK: Record<Stage, number> = {
  New: 0,
  Selected: 1,
  Contacted: 2,
  Opened: 3,
  Clicked: 4,
  Replied: 5,
  Potential: 2,
  Booked: 5,
  "Not interested": 2,
};

export interface LeadContext {
  /** Effective stage (seed stage or session override). */
  stage: Stage;
  /** Current outbound draft for the business. */
  draft: EmailDraft;
  detailedNotes: Note[];
  quickNotes: string[];
  reminder?: Reminder;
  /** Added to the DNC register from the drawer this session. */
  dncAddedManually: boolean;
}

export function buildTimeline(b: Business, ctx: LeadContext): TimelineEvent[] {
  const t: TimelineEvent[] = [];
  if (b.id === "stepz") {
    t.push(
      { date: "3 Jul", text: "Found in search", kind: "search" },
      {
        date: "5 Jul",
        text: 'Selected for "Christmas Corporate Parties"',
        kind: "flag",
      },
      {
        date: "8 Jul",
        text: 'Emailed Sarah Nguyen — "A Christmas party the Stepz team will actually talk about"',
        kind: "mail",
        link: "View email",
      },
      { date: "8 Jul", text: "Opened by Sarah Nguyen", kind: "open" },
      { date: "9 Jul", text: 'Sarah clicked "corporate events"', kind: "click" },
      {
        date: "10 Jul",
        text: 'Sarah replied — "best to talk to Jack Fielding about dates"',
        kind: "reply",
        link: "View reply",
      },
    );
    const first = ctx.detailedNotes[0];
    if (first) {
      t.push({
        date: first.date,
        kind: "note",
        noteHeadline: first.headline,
        noteBody: first.body,
      });
    }
    t.push({
      date: "11 Jul",
      text: "Emailed Jack Fielding — package details and December availability",
      kind: "mail",
      link: "View email",
    });
    t.push({
      date: "4 Aug",
      text: "Reminder — follow-up call with Jack Fielding",
      kind: "rem",
    });
  } else {
    const rank = STAGE_RANK[ctx.stage] ?? 0;
    t.push({ date: "3 Jul", text: "Found in search", kind: "search" });
    if (b.previouslyContacted) {
      t.unshift({
        date: "12 Mar",
        text: "Emailed — autumn promotion (no reply)",
        kind: "mail",
        link: "View email",
      });
    }
    if (rank >= 1) {
      t.push({
        date: "5 Jul",
        text: 'Selected for "Christmas Corporate Parties"',
        kind: "flag",
      });
    }
    if (rank >= 2 && ctx.stage !== "Not interested") {
      t.push({
        date: "8 Jul",
        text: 'Emailed — "' + ctx.draft.subject + '"',
        kind: "mail",
        link: "View email",
      });
    }
    if (rank >= 3) t.push({ date: "8 Jul", text: "Opened", kind: "open" });
    if (rank >= 4) {
      t.push({ date: "9 Jul", text: 'Clicked "corporate events"', kind: "click" });
    }
    if (rank >= 5) {
      t.push({ date: "10 Jul", text: "Replied", kind: "reply", link: "View reply" });
    }
    if (ctx.stage === "Potential") {
      t.push({ date: "10 Jul", text: "Marked as potential", kind: "note" });
    }
    if (ctx.stage === "Booked") {
      t.push({
        date: "11 Jul",
        text: "Booked — staff Christmas party, 40 pax, Fri 18 Dec",
        kind: "book",
      });
    }
    if (ctx.stage === "Not interested" && b.dnc) {
      t.push({
        date: "14 Jun",
        text: "Unsubscribed via link — added to do-not-contact",
        kind: "dnc",
      });
    }
    if (ctx.dncAddedManually) {
      t.push({ date: "Today", text: "Added to do-not-contact — manual", kind: "dnc" });
    }
  }
  ctx.detailedNotes.forEach((n, i) => {
    if (b.id === "stepz" && i === 0) return;
    t.push({ date: n.date, kind: "note", noteHeadline: n.headline, noteBody: n.body });
  });
  ctx.quickNotes.forEach((n) =>
    t.push({ date: "Today", kind: "note", noteHeadline: n }),
  );
  if (ctx.reminder) {
    t.push({
      date: ctx.reminder.date || "21 Jul",
      text:
        "Reminder set — follow up" +
        (ctx.reminder.time ? " at " + ctx.reminder.time : ""),
      kind: "rem",
    });
  }
  return t;
}

export function buildDocs(b: Business, ctx: LeadContext): LeadDoc[] {
  const rank = STAGE_RANK[ctx.stage] ?? 0;
  const d: LeadDoc[] = [];
  ctx.detailedNotes.forEach((n) =>
    d.push({
      kind: "Note",
      title: n.headline,
      meta: n.date + " · " + n.author,
      body: n.body,
    }),
  );
  ctx.quickNotes.forEach((n) =>
    d.push({ kind: "Note", title: n, meta: "Today · you" }),
  );
  if (rank >= 2 && ctx.stage !== "Not interested") {
    d.push({
      kind: "Email",
      title: ctx.draft.subject,
      meta: "Sent 8 Jul · outreach email",
      body: ctx.draft.body,
    });
  }
  if (b.id === "stepz") {
    d.push({
      kind: "Email",
      title: "Re: A Christmas party the Stepz team will actually talk about",
      meta: "From Sarah Nguyen · 10 Jul · pasted from inbox",
      body: "Hi Jess,\n\nThis looks great — our end-of-term concert wraps 19 Dec and the teaching team would love a proper night out.\n\nBest to talk to Jack Fielding (our owner) about dates and budget — he handles bookings. He is back Monday.\n\nSarah",
    });
    d.push({
      kind: "File",
      title: "Term4-concert-schedule.pdf",
      meta: "Attached by Sarah Nguyen · 10 Jul · 240 KB",
    });
  } else if (rank >= 5 && ctx.stage !== "Booked") {
    d.push({
      kind: "Email",
      title: "Re: " + ctx.draft.subject,
      meta: "Reply · 10 Jul · pasted from inbox",
      body: "Thanks — send through package details and December availability and we will take a look.",
    });
  }
  return d;
}
