/**
 * Business discovery/enrichment — stubbed. The real build queries a discovery
 * source by radius/areas, type, industry and size; this mock returns the seed
 * businesses after a short delay so the search spinner behaves like the
 * prototype (900ms).
 */

import { seedBusinesses } from "../data/seed";
import type { Business, SizeBand } from "../types";

export interface DiscoveryCriteria {
  promotionId: string;
  location:
    | { mode: "distance"; venueId: string; maxDriveMinutes: number }
    | { mode: "areas"; areas: string[] };
  types: string[];
  industries: string[];
  size:
    | { mode: "bands"; bands: SizeBand[] }
    | { mode: "range"; minStaff: number; maxStaff: number };
}

export interface BusinessDiscoveryService {
  search(criteria: DiscoveryCriteria): Promise<Business[]>;
}

export class MockBusinessDiscoveryService implements BusinessDiscoveryService {
  async search(_criteria: DiscoveryCriteria): Promise<Business[]> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return seedBusinesses;
  }
}

export const discoveryService: BusinessDiscoveryService =
  new MockBusinessDiscoveryService();
