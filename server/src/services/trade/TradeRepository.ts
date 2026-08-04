import type { CountryMeta, TradeRecord } from '@shared/types';

/**
 * The single boundary between PortsAI and its trade data source.
 *
 * Everything above this interface (matching, summaries, chat, the entire
 * frontend) is written against these four methods only. Connecting a real trade
 * dataset later means writing one new class that implements this interface and
 * changing the factory in `./index.ts` — no route, service or component changes.
 *
 * The current implementation is backed by a PROTOTYPE DEMO DATASET.
 * Prototype demo dataset. Replace with production trade data.
 */
export interface TradeRepository {
  /** All records. Callers must treat the result as read-only. */
  all(): Promise<readonly TradeRecord[]>;

  /** Records whose product name, category or keywords match any of the terms. */
  search(terms: string[]): Promise<readonly TradeRecord[]>;

  /** Country metadata (ISO code, centroid, region) by name. */
  country(name: string): Promise<CountryMeta | undefined>;

  /** All known countries. */
  countries(): Promise<readonly CountryMeta[]>;

  /** Human-readable provenance, surfaced in the UI next to any result. */
  disclaimer(): string;
}
