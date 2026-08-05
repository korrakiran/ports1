'use client';

import React from 'react';
import type { MarketRecommendation } from '@shared/types';
import { DemandBadge } from '@/components/ui/primitives';
import { formatShare, formatTradeValue } from '@/lib/format';

/**
 * One recommended import market.
 *
 * Trade value, rank and share are computed from global_imports_hs4.csv and
 * shown together, because the demand level means nothing without them — it is
 * derived from exactly these two figures.
 *
 * `variant` is purely presentational: the strongest markets carry more weight
 * than the tail, so the grid has rhythm rather than identical boxes.
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
  const positionLabel = String(rank).padStart(2, '0');

  if (variant === 'compact') {
    return (
      <article className="market-card market-card--compact">
        <div className="row row-sm" style={{ minWidth: 0 }}>
          <span className="market-rank">{positionLabel}</span>
          <div style={{ minWidth: 0 }}>
            <div className="market-country">{market.country}</div>
            <div className="market-region">{formatTradeValue(market.tradeValue)}</div>
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
        <span className="market-rank">{positionLabel}</span>
        <h3 className="market-country" style={{ marginTop: 5 }}>
          {market.country}
        </h3>
        <div className="market-region">{market.region}</div>
      </div>

      <div className="row row-wrap" style={{ gap: 6 }}>
        <DemandBadge level={market.demand} />
      </div>

      {/* The figures the demand level was derived from. */}
      <dl className="market-figures">
        <div className="market-figure">
          <dt className="eyebrow">Trade value</dt>
          <dd className="market-figure-value market-figure-value--lead">
            {formatTradeValue(market.tradeValue)}
          </dd>
        </div>
        <div className="market-figure">
          <dt className="eyebrow">Rank</dt>
          <dd className="market-figure-value">
            #{market.rank}
            <span className="market-figure-note"> of {market.productCount.toLocaleString()}</span>
          </dd>
        </div>
        <div className="market-figure">
          <dt className="eyebrow">Share of imports</dt>
          <dd className="market-figure-value">{formatShare(market.sharePct)}</dd>
        </div>
      </dl>

      {featured && (
        <p className="market-note">
          {market.country} imported {formatTradeValue(market.tradeValue)} of {market.hs4} in 2024 —
          #{market.rank} of the {market.productCount.toLocaleString()} HS4 categories it imports, and{' '}
          {formatShare(market.sharePct)} of its total imports.
        </p>
      )}
    </article>
  );
}
