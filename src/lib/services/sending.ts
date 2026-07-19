/**
 * Email send/track — stubbed. The real build queues approved copy with a
 * per-day batch cap (default 30, configurable 10–50) and tracks
 * sent/opened/clicked/replied per email.
 */

import type { EmailDraft } from "../types";

export interface QueuedCampaign {
  promotionId: string;
  emails: { businessId: string; draft: EmailDraft }[];
  dailyLimit: number;
}

export interface EmailSendService {
  queue(campaign: QueuedCampaign): Promise<{ queued: number }>;
}

export class MockEmailSendService implements EmailSendService {
  async queue(campaign: QueuedCampaign): Promise<{ queued: number }> {
    return { queued: campaign.emails.length };
  }
}

export const sendService: EmailSendService = new MockEmailSendService();
