import type { CountryTotals, MarketRecommendation } from '@shared/types';

/** One HS4 category as matched from a free-text product description. */
export interface Hs4Match {
  hs4Id: string;
  hs4: string;
  /** Relative match strength. Ordering only — never shown to the user. */
  score: number;
  /** Query terms that hit this description. */
  matched: string[];
}

/**
 * The single boundary between PortsAI and its trade data source.
 *
 * Everything above this interface — matching, summaries, chat, the frontend —
 * is written against these methods only. Swapping the CSV for a live trade API
 * later means one new class and one line in `./index.ts`.
 *
 * The current implementation reads global_imports_hs4.csv (OEC / CEPII BACI,
 * 2024, 226 countries, 232,930 HS4 import records).
 */
export interface TradeRepository {
  /** HS4 categories whose description matches the supplied search terms. */
  searchProducts(terms: string[], limit?: number): Promise<Hs4Match[]>;

  /**
   * Importing countries for an HS4 category, ranked by 2024 trade value.
   * Rank, share and demand are computed per country at read time.
   */
  marketsForProduct(hs4Id: string, limit?: number): Promise<MarketRecommendation[]>;

  /** A country's largest imports by trade value, with rank, share and demand. */
  topImportsForCountry(iso3: string, limit?: number): Promise<MarketRecommendation[]>;

  /** Totals for one country, or undefined if it is not in the dataset. */
  country(iso3: string): Promise<CountryTotals | undefined>;

  /** Every country in the dataset. */
  countries(): Promise<readonly CountryTotals[]>;

  /** Provenance text, surfaced in the UI alongside any figure derived from it. */
  dataNotice(): string;
}
