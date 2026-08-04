import type {
  DemandLevel,
  MarketRecommendation,
  ProductInput,
  ProductUnderstanding,
  TradeRecord
} from '@shared/types';
import type { TradeRepository } from '../trade/index.js';
import { extractTerms, normalise, termsFromUrl } from './tokens.js';

/**
 * Matches a user's product description against the trade dataset.
 *
 * The hard rule here: a country is only ever recommended because at least one
 * dataset record matched. Nothing is sampled, padded or invented — if the
 * description matches nothing, the result is empty and says so.
 *
 * Prototype demo dataset. Replace with production trade data.
 */

/** Ordering weight only. Never surfaced to the user as a number. */
const DEMAND_RANK: Record<DemandLevel, number> = {
  'Very High': 5,
  High: 4,
  Medium: 3,
  Growing: 2,
  Emerging: 1
};

interface ScoredRecord {
  record: TradeRecord;
  score: number;
  matched: string[];
}

/**
 * Records scoring below this fraction of the best match are dropped.
 *
 * Without it, one shared generic keyword is enough to pull a record in: a query
 * for "leather wallet" would otherwise rank belts and sandals — and their
 * countries — alongside actual wallet entries.
 */
const RELEVANCE_FLOOR = 0.5;

/** Markets shown. A recommendation list longer than this stops being a decision. */
const MAX_RECOMMENDATIONS = 12;

/**
 * How strongly one record answers the search terms.
 *
 * Coverage of the record's *product name* dominates, because that is what makes
 * "Handmade Leather Wallet" a better answer than "Leather Belt" when both share
 * the keyword "leather".
 */
function scoreRecord(record: TradeRecord, terms: Set<string>): ScoredRecord | null {
  const matched = new Set<string>();

  const productWords = normalise(record.product)
    .split(' ')
    .filter((w) => w.length > 2);
  const productHits = productWords.filter((w) => terms.has(w));
  const coverage = productWords.length > 0 ? productHits.length / productWords.length : 0;
  productHits.forEach((w) => matched.add(w));

  const keywordHits = record.keywords.filter((k) => terms.has(normalise(k)));
  keywordHits.forEach((k) => matched.add(k));
  const phraseHits = keywordHits.filter((k) => normalise(k).includes(' '));

  let score = coverage * 12 + keywordHits.length * 2 + phraseHits.length * 3;

  // The whole product name appearing verbatim is as strong as signal gets.
  if (terms.has(normalise(record.product))) {
    score += 15;
    matched.add(record.product);
  }

  if (terms.has(normalise(record.category))) {
    score += 1;
    matched.add(record.category);
  }

  return score > 0 ? { record, score, matched: [...matched] } : null;
}

export interface MatchOutcome {
  understanding: ProductUnderstanding;
  recommendations: MarketRecommendation[];
  scored: ScoredRecord[];
}

export async function matchProduct(
  input: ProductInput,
  repo: TradeRepository,
  /** Keywords the vision model read from the uploaded images, if any. */
  visionTerms: string[] = []
): Promise<MatchOutcome> {
  const terms = new Set([
    ...extractTerms(input.description),
    ...visionTerms.flatMap((t) => extractTerms(t)),
    ...(input.productUrl ? termsFromUrl(input.productUrl) : []),
    // Filenames are weak but real signal ("leather-wallet-front.jpg").
    ...input.imageNames.flatMap((n) => extractTerms(n.replace(/\.[a-z0-9]+$/i, ''))),
    ...(input.catalogueName ? extractTerms(input.catalogueName.replace(/\.[a-z0-9]+$/i, '')) : [])
  ]);

  const candidates = await repo.search([...terms]);

  const allScored = candidates
    .map((record) => scoreRecord(record, terms))
    .filter((s): s is ScoredRecord => s !== null)
    .sort((a, b) => b.score - a.score);

  // Keep only records close to the best match, so weak keyword overlap cannot
  // introduce a country the user never asked about.
  const bestScore = allScored[0]?.score ?? 0;
  const scored = allScored.filter((s) => s.score >= bestScore * RELEVANCE_FLOOR);

  if (scored.length === 0) {
    return {
      understanding: {
        category: null,
        closestProducts: [],
        matchedKeywords: [],
        isUnmatched: true
      },
      recommendations: [],
      scored: []
    };
  }

  /* ---- What did we understand the product to be? ---- */
  const categoryScores = new Map<string, number>();
  const productScores = new Map<string, number>();
  const keywordHits = new Set<string>();

  for (const { record, score, matched } of scored) {
    categoryScores.set(record.category, (categoryScores.get(record.category) ?? 0) + score);
    productScores.set(record.product, (productScores.get(record.product) ?? 0) + score);
    matched.forEach((m) => keywordHits.add(m));
  }

  const topCategory = [...categoryScores.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const closestProducts = [...productScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  /* ---- Only records from the dominant category shape the markets, so a stray
         keyword hit in an unrelated category cannot pull in a country. ---- */
  const relevant = scored.filter((s) => s.record.category === topCategory);

  /* ---- Aggregate matching records per country ---- */
  const byCountry = new Map<string, ScoredRecord[]>();
  for (const entry of relevant) {
    const bucket = byCountry.get(entry.record.country);
    if (bucket) bucket.push(entry);
    else byCountry.set(entry.record.country, [entry]);
  }

  const recommendations: MarketRecommendation[] = [];

  for (const [countryName, entries] of byCountry) {
    const meta = await repo.country(countryName);
    if (!meta) continue;

    // Represent the country by its strongest matching record.
    const best = entries.reduce((a, b) =>
      b.score > a.score || (b.score === a.score && DEMAND_RANK[b.record.demand] > DEMAND_RANK[a.record.demand])
        ? b
        : a
    );

    recommendations.push({
      country: countryName,
      countryIso: meta.iso3,
      countryIso2: meta.iso2,
      lat: meta.lat,
      lng: meta.lng,
      region: meta.region,
      demand: best.record.demand,
      marketType: best.record.market_type,
      matchedProducts: [...new Set(entries.map((e) => e.record.product))],
      notes: [...new Set(entries.map((e) => e.record.notes))].slice(0, 3),
      relevance: entries.reduce((sum, e) => sum + e.score, 0)
    });
  }

  // Relevance leads: a strongly-matching market outranks a loosely-matching one
  // regardless of its demand label. Demand only breaks ties.
  recommendations.sort(
    (a, b) =>
      b.relevance - a.relevance ||
      DEMAND_RANK[b.demand] - DEMAND_RANK[a.demand] ||
      a.country.localeCompare(b.country)
  );

  return {
    understanding: {
      category: topCategory,
      closestProducts,
      matchedKeywords: [...keywordHits].slice(0, 12),
      isUnmatched: false
    },
    recommendations: recommendations.slice(0, MAX_RECOMMENDATIONS),
    scored
  };
}
