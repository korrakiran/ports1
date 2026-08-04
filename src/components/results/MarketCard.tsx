'use client';

import React from 'react';
import type { MarketRecommendation } from '@shared/types';
import { DemandBadge, MarketTypeChip } from '@/components/ui/primitives';

/**
 * One recommended market.
 *
 * `matchedProducts` is shown deliberately: it is the audit trail explaining why
 * this country appears at all, so the recommendation can never look like it came
 * from nowhere.
 */
export default function MarketCard({
  market,
  rank
}: {
  market: MarketRecommendation;
  rank: number;
}) {
  return (
    <article className="card card--interactive stack stack-sm fade-up">
      <div className="row row-between" style={{ alignItems: 'flex-start' }}>
        <div className="row row-sm">
          <span className="rank-chip">{rank}</span>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>
              {market.country}
            </h3>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{market.region}</span>
          </div>
        </div>
      </div>

      <div className="row row-wrap" style={{ gap: 7 }}>
        <DemandBadge level={market.demand} />
        <MarketTypeChip type={market.marketType} />
      </div>

      <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6 }}>{market.notes[0]}</p>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
          MATCHED ON
        </span>
        <div className="row row-wrap" style={{ gap: 6, marginTop: 6 }}>
          {market.matchedProducts.slice(0, 3).map((p) => (
            <span key={p} className="chip">
              {p}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
