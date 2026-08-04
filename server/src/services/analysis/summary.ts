import type { AnalysisSummary, MarketRecommendation, ProductUnderstanding } from '@shared/types';

/**
 * Builds the written summary shown on the results page.
 *
 * Every sentence is derived from what actually matched in the dataset. The only
 * quantities that appear are counts of matched demo records — which are facts
 * about the prototype file, not trade statistics. No percentage, import value,
 * tariff rate or margin is ever produced here.
 *
 * Prototype demo dataset. Replace with production trade data.
 */

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

const BASE_NEXT_STEPS = [
  'Confirm the correct HS classification for your product with a customs broker before quoting — duty treatment and paperwork both follow from it.',
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
      headline: 'No matching markets in the demo dataset',
      paragraphs: [
        `Nothing in the prototype dataset matched "${description.trim().slice(0, 140)}". That is a limitation of this demo, not a judgement about your product.`,
        'The prototype covers a fixed catalogue across handicrafts, textiles, furniture, home decor, fashion, electronics, cosmetics, food, toys, automotive and industrial products. A description outside that catalogue returns nothing rather than a guess.',
        'Try describing the product in plainer terms — its material and what it is, for example "cotton bed linen" or "brass decorative bowl".'
      ],
      nextSteps: BASE_NEXT_STEPS.slice(0, 3)
    };
  }

  const top = recommendations.slice(0, 5);
  const regions = [...new Set(top.map((r) => r.region))];
  const marketTypes = [...new Set(top.map((r) => r.marketType))];
  const strongDemand = recommendations.filter(
    (r) => r.demand === 'Very High' || r.demand === 'High'
  );
  const growing = recommendations.filter((r) => r.demand === 'Growing' || r.demand === 'Emerging');

  const productLabel = understanding.closestProducts[0] ?? understanding.category ?? 'your product';

  const paragraphs: string[] = [];

  paragraphs.push(
    `Your description was read as ${understanding.category?.toLowerCase() ?? 'an uncategorised product'}, closest to ${list(
      understanding.closestProducts.slice(0, 2).map((p) => p.toLowerCase())
    )} in the demo catalogue. ${recommendations.length} ${
      recommendations.length === 1 ? 'market' : 'markets'
    } in the dataset carry entries for this kind of product.`
  );

  if (strongDemand.length > 0) {
    paragraphs.push(
      `Demand is recorded as strongest in ${list(
        strongDemand.slice(0, 4).map((r) => r.country)
      )}. These entries are concentrated in ${list(regions)}, and are described mainly as ${list(
        marketTypes.map((m) => m.toLowerCase())
      )}.`
    );
  }

  if (growing.length > 0) {
    paragraphs.push(
      `${list(growing.slice(0, 3).map((r) => r.country))} ${
        growing.slice(0, 3).length === 1 ? 'is' : 'are'
      } marked as growing or emerging for this category — typically slower to convert, but with less established competition.`
    );
  }

  paragraphs.push(
    'These markets come from a fixed demo dataset built for this prototype. They illustrate the shape of a PortsAI recommendation; they are not live trade statistics and should not be used for commercial decisions.'
  );

  const nextSteps = [
    `Shortlist two markets from the list above rather than pursuing all ${recommendations.length} — export effort concentrates badly.`,
    ...BASE_NEXT_STEPS
  ];

  return {
    headline: `${recommendations.length} ${
      recommendations.length === 1 ? 'market matches' : 'markets match'
    } ${productLabel.toLowerCase()}`,
    paragraphs,
    nextSteps
  };
}
