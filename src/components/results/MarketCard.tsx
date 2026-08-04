'use client';

import React from 'react';
import type { MarketRecommendation } from '@shared/types';
import { DemandBadge, MarketTypeChip } from '@/components/ui/primitives';

/**
 * One recommended market.
 *
 * `variant` is purely presentational — the top matches carry more visual weight
 * than the tail, so the grid has rhythm instead of twelve identical boxes.
 *
 * `matchedProducts` is shown deliberately: it is the audit trail explaining why
 * this country appears at all, so a recommendation can never look like it came
 * from nowhere.
 */
export default function MarketCard({
  market,
  rank,
  variant = 'default'
}: {
  market: MarketRecommendation;
  rank: number;
  variant?: 'featured' | 'default' | 'compact';
}) {
  const rankLabel = String(rank).padStart(2, '0');

  if (variant === 'compact') {
    return (
      <article className="market-card market-card--compact">
        <div className="row row-sm" style={{ minWidth: 0 }}>
          <span className="market-rank">{rankLabel}</span>
          <div style={{ minWidth: 0 }}>
            <div className="market-country">{market.country}</div>
            <div className="market-region">{market.region}</div>
          </div>
        </div>
        <DemandBadge level={market.demand} />
      </article>
    );
  }

  const featured = variant === 'featured';

  return (
    <article className={`market-card ${featured ? 'market-card--featured' : ''} fade-up`}>
      <div>
        <span className="market-rank">{rankLabel}</span>
        <h3 className="market-country" style={{ marginTop: 5 }}>
          {market.country}
        </h3>
        <div className="market-region">{market.region}</div>
      </div>

      <div className="row row-wrap" style={{ gap: 6 }}>
        <DemandBadge level={market.demand} />
        <MarketTypeChip type={market.marketType} />
      </div>

      {featured && <p className="market-note">{market.notes[0]}</p>}

      <div className="market-matched" style={{ marginTop: 'auto' }}>
        <span className="eyebrow">Matched on</span>
        <div className="row row-wrap" style={{ gap: 5, marginTop: 8 }}>
          {market.matchedProducts.slice(0, featured ? 3 : 2).map((p) => (
            <span key={p} className="chip">
              {p}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
