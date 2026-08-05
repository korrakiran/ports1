'use client';

import React from 'react';
import type { MarketRecommendation } from '@shared/types';
import { DemandBadge } from '@/components/ui/primitives';
import { formatShare, formatTradeValue } from '@/lib/format';

/**
 * One recommended import market card.
 * Clicking the card triggers the onClick handler to view full market details.
 */
export default function MarketCard({
  market,
  rank,
  variant = 'default',
  onClick
}: {
  market: MarketRecommendation;
  rank: number;
  variant?: 'featured' | 'default' | 'compact';
  onClick?: () => void;
}) {
  const positionLabel = String(rank).padStart(2, '0');

  if (variant === 'compact') {
    return (
      <article
        className="market-card market-card--compact"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
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
    <article
      className={`market-card ${featured ? 'market-card--featured' : ''} fade-up`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
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

      {/* Clear figures row showing Global Importer Position & Trade Volume */}
      <dl className="market-figures">
        <div className="market-figure">
          <dt className="eyebrow">Trade value</dt>
          <dd className="market-figure-value market-figure-value--lead">
            {formatTradeValue(market.tradeValue)}
          </dd>
        </div>
        <div className="market-figure">
          <dt className="eyebrow">Global Position</dt>
          <dd className="market-figure-value">
            #{rank} <span className="market-figure-note">Importer</span>
          </dd>
        </div>
        <div className="market-figure">
          <dt className="eyebrow">Share of imports</dt>
          <dd className="market-figure-value">{formatShare(market.sharePct)}</dd>
        </div>
      </dl>

      {featured && (
        <p className="market-note">
          {market.country} is the <strong>#{rank} global import market</strong> for {market.hs4} in 2024, absorbing{' '}
          {formatTradeValue(market.tradeValue)} in annual imports.
        </p>
      )}
    </article>
  );
}
