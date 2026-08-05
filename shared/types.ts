/**
 * Domain types shared by the Express API and the Next.js frontend.
 *
 * Trade data comes from `global_imports_hs4.csv` — 2024 import records from the
 * Observatory of Economic Complexity (OEC), powered by the CEPII BACI trade
 * database, derived from official UN Comtrade customs data. 226 countries and
 * territories, 232,930 HS4-level records.
 *
 * Every figure surfaced to a user (trade value, rank, share, demand level) is
 * computed from that file at request time. Nothing is hardcoded.
 */

export const DATA_SOURCE = {
  file: 'global_imports_hs4.csv',
  year: 2024,
  provider: 'Observatory of Economic Complexity (OEC)',
  database: 'CEPII BACI (HS 2022 / HS4)',
  origin: 'official UN Comtrade customs data',
  notice:
    'Our recommendations are based on 2024 international trade data from the Observatory of ' +
    'Economic Complexity (OEC), powered by the CEPII BACI trade database derived from official ' +
    'UN Comtrade customs data. The dataset covers 226 countries and territories and more than ' +
    '232,000 HS4-level import records. This is historical trade data for 2024 and should be ' +
    'interpreted as trade intelligence rather than real-time market activity.'
} as const;

/* ------------------------------------------------------------------ */
/* Demand                                                              */
/* ------------------------------------------------------------------ */

/**
 * Demand levels, strongest first.
 *
 * Assigned by `classifyDemand` from a product's rank and import share within a
 * given country — never stored, never hardcoded.
 */
export const DEMAND_LEVELS = ['Very High', 'High', 'Moderate', 'Low', 'Niche'] as const;
export type DemandLevel = (typeof DEMAND_LEVELS)[number];

/* ------------------------------------------------------------------ */
/* Trade data                                                          */
/* ------------------------------------------------------------------ */

/** One row of global_imports_hs4.csv, with codes resolved. */
export interface TradeRecord {
  /** OEC country id, e.g. "asind" — region prefix + ISO-3166 alpha-3. */
  countryId: string;
  country: string;
  iso3: string;
  /** Lowercase ISO-3166 alpha-2 — the key the results heat map paints on. */
  iso2: string;
  region: string;
  hs4Id: string;
  /** HS4 product description, e.g. "Electrical Machinery". */
  hs4: string;
  tradeValue: number;
}

export interface CountryTotals {
  country: string;
  iso3: string;
  iso2: string;
  region: string;
  /** Sum of every HS4 import value for this country. */
  totalImports: number;
  productCount: number;
}

/* ------------------------------------------------------------------ */
/* Analysis                                                            */
/* ------------------------------------------------------------------ */

export interface ProductInput {
  description: string;
  productUrl?: string;
  imageNames: string[];
  catalogueName?: string;
}

export interface VisionAnalysis {
  description: string;
  terms: string[];
  model: string;
}

/** How the search terms were resolved to HS4 categories in the dataset. */
export interface ProductUnderstanding {
  /** HS4 categories the description matched, best first. */
  matchedProducts: { hs4Id: string; hs4: string }[];
  /** Description tokens that actually hit an HS4 description. */
  matchedKeywords: string[];
  /** True when nothing matched — the UI must say so rather than guess. */
  isUnmatched: boolean;
}

/**
 * One recommended import market for a matched HS4 product.
 * Every numeric field is computed from the CSV.
 */
export interface MarketRecommendation {
  country: string;
  countryIso: string;
  countryIso2: string;
  region: string;

  hs4Id: string;
  hs4: string;

  /** USD import value of this HS4 into this country in 2024. */
  tradeValue: number;
  /** Rank of this HS4 among all HS4 categories this country imports (1 = largest). */
  rank: number;
  /** tradeValue / totalImports * 100. */
  sharePct: number;
  /** This country's total 2024 imports across all HS4 categories. */
  totalImports: number;
  /** How many distinct HS4 categories this country imports. */
  productCount: number;

  demand: DemandLevel;
}

export interface AnalysisSummary {
  headline: string;
  paragraphs: string[];
  nextSteps: string[];
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  input: ProductInput;
  understanding: ProductUnderstanding;
  recommendations: MarketRecommendation[];
  summary: AnalysisSummary;
  vision?: VisionAnalysis | null;
  visionError?: string | null;
  /** Provenance, carried with the data so it is never shown detached from it. */
  dataNotice: string;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: PublicUser;
}

/* ------------------------------------------------------------------ */
/* Chat                                                                */
/* ------------------------------------------------------------------ */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Countries or HS4 categories the answer was computed from. */
  sources?: string[];
}

/* ------------------------------------------------------------------ */
/* API envelope                                                        */
/* ------------------------------------------------------------------ */

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
