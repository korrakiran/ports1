import { DATA_SOURCE, type AnalysisResult, type ChatMessage, type MarketRecommendation } from '@shared/types';
import { formatShare, formatTradeValue } from '../trade/demand.js';
import { normalise } from './tokens.js';

/**
 * The results-page assistant.
 *
 * Answers are composed from the recommendations already computed for this
 * analysis — every number quoted traces back to global_imports_hs4.csv. It is
 * intent matching, not a language model, and when it cannot answer from the
 * data it says so rather than improvising.
 */

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function findCountry(
  question: string,
  recommendations: MarketRecommendation[]
): MarketRecommendation | undefined {
  const q = normalise(question);
  return recommendations.find((r) => q.includes(normalise(r.country)));
}

/** The canonical explanation for one market, built entirely from its figures. */
function explain(m: MarketRecommendation): string {
  return (
    `${m.country} imported ${formatTradeValue(m.tradeValue)} of ${m.hs4} in ${DATA_SOURCE.year}. ` +
    `It ranked #${m.rank} among the ${m.productCount.toLocaleString()} HS4 import categories ${m.country} records, ` +
    `and represented ${formatShare(m.sharePct)} of its ${formatTradeValue(m.totalImports)} in total imports. ` +
    `Based on that rank and share, PortsAI classifies this as ${m.demand} Demand.`
  );
}

const CAPABILITIES =
  'I can explain why a market is on your list, what it imported and how that ranks, ' +
  'which markets show the strongest demand, and what to prepare before approaching a buyer.';

export function answerQuestion(question: string, analysis: AnalysisResult): ChatMessage {
  const q = normalise(question);
  const recs = analysis.recommendations;

  if (recs.length === 0) {
    return {
      role: 'assistant',
      content:
        'This analysis did not match an HS4 category in the 2024 trade data, so I have no markets to discuss. ' +
        'Try re-running it with a plainer product description — for example "cotton shirts" or "leather handbags".'
    };
  }

  /* --- A specific country --- */
  const country = findCountry(question, recs);
  if (country) {
    return { role: 'assistant', content: explain(country), sources: [country.country] };
  }

  /* --- Why this product / why recommended / why is demand high --- */
  if (/^why|why /.test(q) || /recommend|explain|reason|how did you/.test(q)) {
    const top = recs[0];
    return {
      role: 'assistant',
      content:
        `${explain(top)} ` +
        `The same calculation is applied to every country that imports ${top.hs4}, and the list is ordered by ${DATA_SOURCE.year} trade value.`,
      sources: [top.country]
    };
  }

  /* --- Strongest demand --- */
  if (/strong|high|best|top|start|first|which country|where should|biggest|largest/.test(q)) {
    const top = recs.slice(0, 3);
    return {
      role: 'assistant',
      content:
        `By ${DATA_SOURCE.year} import value, the largest markets for ${top[0].hs4} on your list are ` +
        `${list(top.map((r) => `${r.country} (${formatTradeValue(r.tradeValue)}, ${r.demand.toLowerCase()} demand)`))}. ` +
        'I would shortlist two of these rather than approaching all of them — export effort spreads thin very quickly.',
      sources: top.map((r) => r.country)
    };
  }

  /* --- Share / rank questions --- */
  if (/share|rank|percent|percentage|proportion|position/.test(q)) {
    const top = recs.slice(0, 5);
    return {
      role: 'assistant',
      content:
        `Share and rank for ${top[0].hs4}: ` +
        list(top.map((r) => `${r.country} — #${r.rank}, ${formatShare(r.sharePct)} of total imports`)) +
        '. Rank is measured against every HS4 category that country imports.',
      sources: top.map((r) => r.country)
    };
  }

  /* --- Smaller / emerging markets --- */
  if (/small|niche|emerging|growing|less competitive|new market/.test(q)) {
    const tail = recs.filter((r) => r.demand === 'Low' || r.demand === 'Niche' || r.demand === 'Moderate');
    return {
      role: 'assistant',
      content: tail.length
        ? `${list(tail.slice(0, 4).map((r) => `${r.country} (${formatTradeValue(r.tradeValue)}, ${r.demand.toLowerCase()} demand)`))} ` +
          'import this category at a lower rank or share. Smaller absolute volume often means less entrenched competition, but also longer sales cycles.'
        : 'Every market on your list registers moderate demand or above for this category — none of them fall into the low or niche band.',
      sources: tail.slice(0, 4).map((r) => r.country)
    };
  }

  /* --- Documentation, certification, tariffs --- */
  if (/certif|document|complian|standard|test|label|paperwork|hs code|customs|duty|tariff/.test(q)) {
    return {
      role: 'assistant',
      content:
        'This dataset covers import values only — it carries no tariff, certification or duty information, so I will not guess at specifics. ' +
        'What holds generally: confirm your full HS classification with a customs broker first, since duty treatment and documentation both follow from it and HS4 is only the first four digits; ' +
        'prepare a specification sheet covering materials, dimensions and packaging; and check destination-specific certification early, because testing is usually the longest lead item. ' +
        'Verify all of it against the destination customs authority before you quote.'
    };
  }

  /* --- Shipping --- */
  if (/ship|freight|logistic|courier|container|deliver/.test(q)) {
    return {
      role: 'assistant',
      content:
        'This dataset has no freight or routing data, so I cannot give you lead times or costs. ' +
        'Practically: ask two or three freight forwarders for indicative routing to your shortlisted markets, and decide early whether you are quoting ex-works, FOB or CIF — buyers will ask, and it changes your price.'
    };
  }

  /* --- Data provenance --- */
  if (/data|source|where.*from|accurate|reliable|when|year|up to date/.test(q)) {
    return { role: 'assistant', content: DATA_SOURCE.notice };
  }

  /* --- Summary --- */
  if (/summar|overview|result|what did/.test(q)) {
    return { role: 'assistant', content: `${analysis.summary.headline}. ${analysis.summary.paragraphs[0]}` };
  }

  /* --- Honest fallback --- */
  return {
    role: 'assistant',
    content:
      `I could not map that to this analysis. ${CAPABILITIES} ` +
      `Your matched markets are ${list(recs.slice(0, 5).map((r) => r.country))}${
        recs.length > 5 ? ` and ${recs.length - 5} more` : ''
      }.`
  };
}
