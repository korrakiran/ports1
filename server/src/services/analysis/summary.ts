import { DATA_SOURCE, type AnalysisSummary, type MarketRecommendation, type ProductUnderstanding } from '@shared/types';
import { formatShare, formatTradeValue } from '../trade/demand.js';

/**
 * Builds the written summary shown on the results page.
 *
 * Every figure quoted here — trade value, rank, share — is read off the
 * MarketRecommendation objects, which are computed from global_imports_hs4.csv.
 * Nothing is estimated or rounded into a claim the data does not support.
 */

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

const BASE_NEXT_STEPS = [
  'Confirm the exact HS classification for your product with a customs broker — duty treatment and paperwork both follow from it, and HS4 is only the first four digits.',
  'Prepare a specification sheet with materials, dimensions, packaging and care instructions. Buyers ask for this first.',
  'Check which product certifications each destination requires, and budget time for testing — it is usually the longest lead item.',
  'Register for an Importer Exporter Code (IEC) if you do not already hold one.',
  'Ask two or three freight forwarders for indicative routing and lead times to your shortlisted markets.'
];

export function buildSummary(
  description: string,
  understanding: ProductUnderstanding,
  recommendations: MarketRecommendation[]
): AnalysisSummary {
  if (understanding.isUnmatched || recommendations.length === 0) {
    return {
      headline: 'No matching trade category found',
      paragraphs: [
        `Nothing in the 2024 trade data matched "${description.trim().slice(0, 140)}".`,
        `The dataset is organised by HS4 category — broad product groups such as "Electrical Machinery" or "Leather Apparel" — across ${DATA_SOURCE.year} imports for 226 countries. A description that does not correspond to one of those categories returns nothing rather than a guess.`,
        'Try naming the product in plainer commercial terms — what it is and what it is made of, for example "leather handbags", "cotton shirts" or "electric motors".'
      ],
      nextSteps: BASE_NEXT_STEPS.slice(0, 3)
    };
  }

  const product = recommendations[0].hs4;
  const top = recommendations[0];
  const strong = recommendations.filter((r) => r.demand === 'Very High' || r.demand === 'High');
  const regions = [...new Set(recommendations.slice(0, 6).map((r) => r.region))];

  const paragraphs: string[] = [];

  paragraphs.push(
    `Your description was matched to the HS4 category ${product}. ` +
      `In ${DATA_SOURCE.year}, ${top.country} was the largest importer of ${product} among the countries in this dataset, at ${formatTradeValue(
        top.tradeValue
      )} — ranking #${top.rank} of the ${top.productCount.toLocaleString()} HS4 categories it imports and making up ${formatShare(
        top.sharePct
      )} of its total imports. PortsAI classifies that as ${top.demand.toLowerCase()} demand.`
  );

  if (strong.length > 0) {
    paragraphs.push(
      `${list(strong.slice(0, 5).map((r) => `${r.country} (${formatTradeValue(r.tradeValue)})`))} ` +
        `${strong.slice(0, 5).length === 1 ? 'shows' : 'show'} high or very high demand for this category, concentrated in ${list(
          regions
        )}. Demand level reflects both a product's rank within a country's imports and its share of them, so a large absolute value in a very large economy is not automatically treated as strong demand.`
    );
  }

  paragraphs.push(
    `These are historical ${DATA_SOURCE.year} customs figures from ${DATA_SOURCE.provider}, via ${DATA_SOURCE.database}. They describe what each country actually imported last year — read them as trade intelligence, not as a forecast or as current market activity.`
  );

  const nextSteps = [
    `Shortlist two markets from this list rather than pursuing all ${recommendations.length} — export effort concentrates badly.`,
    ...BASE_NEXT_STEPS
  ];

  return {
    headline: `${recommendations.length} import ${
      recommendations.length === 1 ? 'market' : 'markets'
    } for ${product}`,
    paragraphs,
    nextSteps
  };
}
