'use client';

import React, { useMemo, useState } from 'react';
import type { MarketRecommendation } from '@shared/types';
import WorldSVGMap from '@/components/WorldSVGMap';
import { demandFill } from '@/components/ui/primitives';

/**
 * Choropleth of the matched markets.
 *
 * Only countries that actually matched are painted; everything else stays
 * neutral. There is no interpolated "heat" across the rest of the world, because
 * the prototype has no data for those countries — an empty map region means
 * "not matched", not "low demand".
 */
export default function MarketHeatMap({
  recommendations,
  onSelect
}: {
  recommendations: MarketRecommendation[];
  onSelect?: (market: MarketRecommendation) => void;
}) {
  const [hovered, setHovered] = useState<MarketRecommendation | null>(null);

  const byIso2 = useMemo(
    () => new Map(recommendations.map((r) => [r.countryIso2, r])),
    [recommendations]
  );

  // One stylesheet keyed by country id beats attaching handlers to 250 paths.
  const css = useMemo(
    () =>
      recommendations
        .map(
          (r) => `.heatmap-svg path#${r.countryIso2}{fill:${demandFill(r.demand)};cursor:pointer}`
        )
        .join('\n'),
    [recommendations]
  );

  function isoFromEvent(e: React.MouseEvent): string | null {
    const target = e.target as SVGElement;
    return target.tagName === 'path' ? target.id : null;
  }

  return (
    <div className="card card--flush" style={{ position: 'relative' }}>
      <style>{`
        .heatmap-svg path { fill: #eef2f7; stroke: #ffffff; stroke-width: 0.5; }
        ${css}
      `}</style>

      <div
        style={{ padding: 16 }}
        onMouseMove={(e) => {
          const iso = isoFromEvent(e);
          setHovered(iso ? (byIso2.get(iso) ?? null) : null);
        }}
        onMouseLeave={() => setHovered(null)}
        onClick={(e) => {
          const iso = isoFromEvent(e);
          const match = iso ? byIso2.get(iso) : undefined;
          if (match && onSelect) onSelect(match);
        }}
      >
        <WorldSVGMap className="heatmap-svg" />
      </div>

      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '9px 13px',
            boxShadow: '0 8px 24px rgba(15,23,42,0.1)',
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 800 }}>{hovered.country}</div>
          <div style={{ fontSize: 12, color: demandFill(hovered.demand), fontWeight: 600 }}>
            {hovered.demand} demand · {hovered.marketType}
          </div>
        </div>
      )}

      <div
        className="row row-wrap"
        style={{ gap: 14, padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}
      >
        {(['Very High', 'High', 'Medium', 'Growing', 'Emerging'] as const)
          .filter((level) => recommendations.some((r) => r.demand === level))
          .map((level) => (
            <span key={level} className="row row-sm" style={{ fontSize: 11.5, color: '#475569' }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: demandFill(level),
                  display: 'inline-block'
                }}
              />
              {level}
            </span>
          ))}
      </div>
    </div>
  );
}
