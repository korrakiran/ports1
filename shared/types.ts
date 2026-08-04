/**
 * Domain types shared by the Express API and the Next.js frontend.
 *
 * The trade data behind these types currently comes from a PROTOTYPE DEMO DATASET
 * (`/data/trade-demo.json`). Prototype demo dataset. Replace with production trade data.
 *
 * Note what is deliberately absent: there is no field anywhere for a percentage,
 * import value, tariff rate, profit margin or ranking score. Demand and market
 * positioning are expressed only as qualitative labels, because the prototype has
 * no real trade statistics to back a number.
 */

/* ------------------------------------------------------------------ */
/* Trade data                                                          */
/* ------------------------------------------------------------------ */

export const DEMAND_LEVELS = ['Very High', 'High', 'Medium', 'Growing', 'Emerging'] as const;
export type DemandLevel = (typeof DEMAND_LEVELS)[number];

export const MARKET_TYPES = [
  'Premium Market',
  'Volume Market',
  'Niche Market',
  'Manufacturing Hub',
  'Re-export Hub'
] as const;
export type MarketType = (typeof MARKET_TYPES)[number];

/** One row of the prototype dataset. */
export interface TradeRecord {
  id: string;
  country: string;
  country_iso: string;
  product: string;
  category: string;
  keywords: string[];
  demand: DemandLevel;
  market_type: MarketType;
  notes: string;
}

export interface CountryMeta {
  name: string;
  iso3: string;
  /** Lowercase ISO-3166 alpha-2 — the key the results heat map paints on. */
  iso2: string;
  lat: number;
  lng: number;
  region: string;
}

/* ------------------------------------------------------------------ */
/* Analysis                                                            */
/* ------------------------------------------------------------------ */

/** What the user submitted for analysis. */
export interface ProductInput {
  description: string;
  productUrl?: string;
  imageNames: string[];
  catalogueName?: string;
}

/** What the vision model read from the uploaded images. */
export interface VisionAnalysis {
  /** The model's own one-line description of the product. */
  description: string;
  /** Keywords it extracted, fed into dataset matching alongside the description. */
  terms: string[];
  /** Model identifier, shown in the UI so the source of this text is never unclear. */
  model: string;
}

/** How the matcher understood the product. Every field is derived from the
 *  dataset — nothing is invented. */
export interface ProductUnderstanding {
  /** Dataset category the description matched most strongly. */
  category: string | null;
  /** Closest catalogue product names, best first. */
  closestProducts: string[];
  /** Description tokens that actually matched dataset keywords. */
  matchedKeywords: string[];
  /** True when the description matched nothing — the UI must say so plainly. */
  isUnmatched: boolean;
}

/** A recommended market, assembled from the dataset rows that matched. */
export interface MarketRecommendation {
  country: string;
  countryIso: string;
  /** Lowercase ISO alpha-2, for the heat map. */
  countryIso2: string;
  lat: number;
  lng: number;
  region: string;
  demand: DemandLevel;
  marketType: MarketType;
  /** Dataset rows this recommendation was built from — the audit trail. */
  matchedProducts: string[];
  notes: string[];
  /** Relative match strength, used only for ordering. Never shown as a score. */
  relevance: number;
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
  /** Present when images were uploaded and the vision model succeeded. */
  vision?: VisionAnalysis | null;
  /** Set when images were uploaded but vision failed — the UI says so rather
   *  than silently pretending the images were read. */
  visionError?: string | null;
  /** Carried through to the UI so the disclaimer is never separated from the data. */
  disclaimer: string;
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
  /** Dataset rows used to answer, so a reply can always be traced back. */
  sources?: string[];
}

/* ------------------------------------------------------------------ */
/* API envelope                                                        */
/* ------------------------------------------------------------------ */

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
