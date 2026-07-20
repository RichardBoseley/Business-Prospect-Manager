/**
 * Maps — stubbed. The lead drawer renders a striped placeholder; a real
 * provider (static map image or embedded map) drops in behind this interface
 * without touching UI code.
 */

export interface MapPreview {
  /** URL of a static map image, or null while stubbed (placeholder renders). */
  imageUrl: string | null;
  address: string;
}

export interface MapsService {
  preview(address: string): Promise<MapPreview>;
}

export class MockMapsService implements MapsService {
  async preview(address: string): Promise<MapPreview> {
    return { imageUrl: null, address };
  }
}

export const mapsService: MapsService = new MockMapsService();
