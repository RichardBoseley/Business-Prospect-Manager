/**
 * Unsubscribe endpoint — stubbed. The real build exposes a one-click
 * unsubscribe URL in every email footer; hitting it writes a permanent
 * DNCEntry (Spam Act 2003).
 */

import type { DNCEntry } from "../types";

export interface UnsubscribeService {
  unsubscribe(businessName: string, detail: string): Promise<DNCEntry>;
}

export class MockUnsubscribeService implements UnsubscribeService {
  async unsubscribe(businessName: string, detail: string): Promise<DNCEntry> {
    return {
      businessName,
      detail,
      reason: "Unsubscribed via link",
      date: "18 Jul 2026",
      permanent: true,
    };
  }
}

export const unsubscribeService: UnsubscribeService =
  new MockUnsubscribeService();
