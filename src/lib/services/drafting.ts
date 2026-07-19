/**
 * AI email drafting — stubbed. The real build calls a drafting model with the
 * promotion + business signals; this mock reproduces the prototype's three
 * deterministic draft variants per business (subject + personalised body with
 * hook, drive time, size-appropriate group rates, sender block and compliance
 * footer with one-click unsubscribe).
 */

import type { Business, EmailDraft } from "../types";

export interface EmailDraftingService {
  /** Returns draft variant `variant % 3` for the business. */
  draft(business: Business, variant: number): EmailDraft;
}

export class MockEmailDraftingService implements EmailDraftingService {
  draft(b: Business, variant: number): EmailDraft {
    const v = ((variant % 3) + 3) % 3;
    const primary = b.contacts.find((c) => c.isPrimary);
    const first = primary ? primary.name.split(" ")[0] : "there";
    const subjects = [
      "A Christmas party the " + b.name + " team will actually talk about",
      "End-of-year celebration idea for " + b.name,
      "December dates are going — group rates for " + b.name,
    ];
    const openers = [
      b.hook,
      "Quick one — if you're starting to think about an end-of-year event for the team, we'd love " +
        b.name +
        " to see what a night at Game On looks like.",
      "Most " +
        b.type.toLowerCase() +
        "s we talk to around " +
        b.suburb +
        " leave the Christmas booking too late — the good December dates go first.",
    ];
    const sizeLine =
      b.sizeBand === "L"
        ? " for groups of 20 or more"
        : b.sizeBand === "M"
          ? " for teams of 10–25"
          : ", starting from 8 people";
    const body =
      "Hi " +
      first +
      ",\n\n" +
      openers[v] +
      "\n\nWe're Game On in Cranbourne West — VR arcade, karaoke rooms and laser tag under one roof, about " +
      b.driveTime +
      " from " +
      b.suburb +
      ". Our Christmas corporate packages include exclusive-use party areas, catering and drinks options, and group rates" +
      sizeLine +
      ".\n\nIf a night like that could work for your team, just reply here or pick a time that suits: gameonec.com.au/corporate\n\nJess Carter\nEvents & group bookings — Game On Entertainment Centre\n14 Marriott Waters Bvd, Cranbourne West VIC 3977 · (03) 5990 4820\n\nYou're receiving this because " +
      b.name +
      " publishes its contact details publicly. Don't want to hear from us? Unsubscribe (one click) — we'll never email you again.";
    return { subject: subjects[v], body };
  }
}

export const draftingService: EmailDraftingService =
  new MockEmailDraftingService();
