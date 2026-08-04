import type { AnalysisResult, ChatMessage, MarketRecommendation } from '@shared/types';
import { normalise } from './tokens.js';

/**
 * The results-page assistant.
 *
 * This is intent matching over the analysis that was already produced — not a
 * language model. It can only answer from the recommendations in hand, and when
 * it cannot answer it says so rather than improvising. That honesty is the point:
 * a prototype assistant that bluffs would put invented trade claims in front of
 * users.
 *
 * Prototype demo dataset. Replace with production trade data.
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

const CAPABILITIES =
  'I can tell you which markets matched, why a particular country is on the list, ' +
  'which are premium versus growing, and what to prepare before approaching a buyer.';

export function answerQuestion(question: string, analysis: AnalysisResult): ChatMessage {
  const q = normalise(question);
  const recs = analysis.recommendations;

  if (recs.length === 0) {
    return {
      role: 'assistant',
      content:
        'This analysis did not match anything in the demo dataset, so I have no markets to discuss. ' +
        'Try running the analysis again with a plainer product description — for example "cotton bed linen" or "leather wallet".'
    };
  }

  /* --- A specific country --- */
  const country = findCountry(question, recs);
  if (country) {
    return {
      role: 'assistant',
      content:
        `${country.country} is on your list because the demo dataset has entries for ${list(
          country.matchedProducts.map((p) => p.toLowerCase())
        )} there. ` +
        `Demand is recorded as ${country.demand.toLowerCase()} and the market is described as a ${country.marketType.toLowerCase()}. ` +
        country.notes[0],
      sources: country.matchedProducts
    };
  }

  /* --- Premium / high-end --- */
  if (/premium|high end|luxury|upmarket/.test(q)) {
    const premium = recs.filter((r) => r.marketType === 'Premium Market');
    return {
      role: 'assistant',
      content: premium.length
        ? `The markets flagged as premium for your product are ${list(premium.map((r) => r.country))}. ` +
          'Premium here means buyers weigh finish, consistency and documentation over unit price — expect sampling and certification requests before any order.'
        : 'None of your matched markets are flagged as premium in the demo dataset. They are mostly volume, niche or hub markets.',
      sources: premium.map((r) => r.country)
    };
  }

  /* --- Growing / emerging --- */
  if (/growing|emerging|new market|early/.test(q)) {
    const growing = recs.filter((r) => r.demand === 'Growing' || r.demand === 'Emerging');
    return {
      role: 'assistant',
      content: growing.length
        ? `${list(growing.map((r) => r.country))} ${growing.length === 1 ? 'is' : 'are'} marked as growing or emerging for this category. ` +
          'These usually mean less entrenched competition but longer sales cycles, and they reward distributors who can hold stock locally.'
        : 'Your matched markets are all recorded at established demand levels rather than growing or emerging.',
      sources: growing.map((r) => r.country)
    };
  }

  /* --- Best / where to start --- */
  if (/best|start|first|top|recommend|which country|where should/.test(q)) {
    const top = recs.slice(0, 3);
    return {
      role: 'assistant',
      content:
        `Based on the dataset entries, ${list(top.map((r) => r.country))} matched most strongly. ` +
        `${top[0].country} is recorded at ${top[0].demand.toLowerCase()} demand as a ${top[0].marketType.toLowerCase()}. ` +
        'I would shortlist two of these rather than approaching all of them — export effort spreads thin very quickly.',
      sources: top.map((r) => r.country)
    };
  }

  /* --- Documentation, certification, compliance --- */
  if (/certif|document|complian|standard|test|label|paperwork|hs code|customs|duty|tariff/.test(q)) {
    return {
      role: 'assistant',
      content:
        'This prototype does not carry certification or tariff data, so I will not guess at specifics. ' +
        'What holds generally: confirm your HS classification with a customs broker first, since duty treatment and documentation both follow from it; ' +
        'prepare a specification sheet covering materials, dimensions and packaging; and check destination-specific product certification early, because testing is usually the longest lead item. ' +
        'Verify all of it against the destination customs authority before you quote.'
    };
  }

  /* --- Shipping / logistics --- */
  if (/ship|freight|logistic|courier|container|deliver/.test(q)) {
    return {
      role: 'assistant',
      content:
        'The prototype has no freight or routing data, so I cannot give you lead times or costs. ' +
        'Practically: ask two or three freight forwarders for indicative routing to your shortlisted markets, and decide early whether you are quoting ex-works, FOB or CIF — buyers will ask, and it changes your price.'
    };
  }

  /* --- Summary --- */
  if (/summar|overview|explain|what did|result/.test(q)) {
    return {
      role: 'assistant',
      content: `${analysis.summary.headline}. ${analysis.summary.paragraphs[0]}`
    };
  }

  /* --- Honest fallback --- */
  return {
    role: 'assistant',
    content:
      `I could not map that to the analysis. ${CAPABILITIES} ` +
      `Your matched markets are ${list(recs.slice(0, 5).map((r) => r.country))}${
        recs.length > 5 ? ` and ${recs.length - 5} more` : ''
      }.`
  };
}
