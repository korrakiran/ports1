import type { MarketRecommendation, ProductInput, ProductUnderstanding } from '@shared/types';
import type { TradeRepository } from '../trade/index.js';
import { extractTerms, termsFromUrl } from './tokens.js';

/**
 * Resolves a free-text product description to HS4 categories, then ranks the
 * countries that import them.
 */

const MAX_RECOMMENDATIONS = 12;

export interface MatchOutcome {
  understanding: ProductUnderstanding;
  recommendations: MarketRecommendation[];
}

export async function matchProduct(
  input: ProductInput,
  repo: TradeRepository,
  /** Keywords the vision model read from the uploaded images, if any. */
  visionTerms: string[] = []
): Promise<MatchOutcome> {
  const terms = [
    ...extractTerms(input.description),
    ...visionTerms.flatMap((t) => extractTerms(t)),
    ...(input.productUrl ? termsFromUrl(input.productUrl) : []),
    ...input.imageNames
      .filter((n) => !/^(image|photo|img|screenshot|download|unknown|temp|file)[_\-\d]*\.[a-z0-9]+$/i.test(n))
      .flatMap((n) => extractTerms(n.replace(/\.[a-z0-9]+$/i, ''))),
    ...(input.catalogueName ? extractTerms(input.catalogueName.replace(/\.[a-z0-9]+$/i, '')) : [])
  ];

  const matches = await repo.searchProducts([...new Set(terms)]);

  if (matches.length === 0) {
    return {
      understanding: { matchedProducts: [], matchedKeywords: [], isUnmatched: true },
      recommendations: []
    };
  }

  // The strongest HS4 match drives the market list. Weaker matches are still
  // reported so the user can see how their description was read.
  const primary = matches[0];
  const recommendations = await repo.marketsForProduct(primary.hs4Id, MAX_RECOMMENDATIONS);

  return {
    understanding: {
      matchedProducts: matches.map(({ hs4Id, hs4 }) => ({ hs4Id, hs4 })),
      matchedKeywords: [...new Set(matches.flatMap((m) => m.matched))].slice(0, 12),
      isUnmatched: false
    },
    recommendations
  };
}
