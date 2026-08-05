'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { MarketRecommendation } from '@shared/types';
import WorldSVGMap from '@/components/WorldSVGMap';
import { demandFill } from '@/components/ui/primitives';
import { formatShare, formatTradeValue } from '@/lib/format';

/**
 * Enhanced Choropleth HeatMap:
 * - Bold, high-contrast demand colors
 * - Hover 3D Pop Out elevation effect on demanding countries
 * - Clean callout card detailing market revenue, rank, and import share
 */
export default function MarketHeatMap({
  recommendations,
  onSelect
}: {
  recommendations: MarketRecommendation[];
  onSelect?: (market: MarketRecommendation) => void;
}) {
  const [hovered, setHovered] = useState<MarketRecommendation | null>(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const byIso2 = useMemo(
    () => new Map(recommendations.map((r) => [(r.countryIso2 || '').toLowerCase(), r])),
    [recommendations]
  );

  const css = useMemo(
    () =>
      recommendations
        .filter((r) => r.countryIso2)
        .map(
          (r) =>
            `.heatmap-svg path#${r.countryIso2.toLowerCase()} { fill: ${demandFill(r.demand)} !important; cursor: pointer; }`
        )
        .join('\n'),
    [recommendations]
  );

  function isoFromEvent(e: React.MouseEvent): string | null {
    const target = e.target as SVGElement;
    return target.tagName === 'path' && target.id ? target.id.toLowerCase() : null;
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const box = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    setTipPos({ x, y });
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const iso = isoFromEvent(e);
      const match = iso ? (byIso2.get(iso) ?? null) : null;
      setHovered((prev) => (prev?.countryIso2 === match?.countryIso2 ? prev : match));
      handleMouseMove(e);
    },
    [byIso2, handleMouseMove]
  );

  return (
    <div className="card card--flush" style={{ position: 'relative', overflow: 'visible' }} ref={wrapRef}>
      <style>{`
        .heatmap-svg {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 6px 18px rgba(15, 23, 42, 0.04));
        }
        .heatmap-svg path {
          fill: #e8effb;
          stroke: #ffffff;
          stroke-width: 0.7;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      fill 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      stroke-width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center center;
        }

        /* 3D POP OUT HOVER EFFECT FOR DEMANDING COUNTRIES */
        .heatmap-svg path:hover {
          fill: #0066FF !important;
          stroke: #ffffff !important;
          stroke-width: 1.8 !important;
          filter: drop-shadow(0 10px 22px rgba(0, 102, 255, 0.45));
          transform: translateY(-4px) scale(1.025);
        }

        ${css}
      `}</style>

      <div
        style={{ padding: 'var(--sp-5) var(--sp-4)', position: 'relative' }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
        onClick={(e) => {
          const iso = isoFromEvent(e);
          const match = iso ? byIso2.get(iso) : undefined;
          if (match && onSelect) onSelect(match);
        }}
      >
        <WorldSVGMap className="heatmap-svg" />

        {/* Clean, Bold Hover Tooltip */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(tipPos.x + 16, (wrapRef.current?.offsetWidth ?? 800) - 240)}px`,
              top: `${Math.max(10, tipPos.y - 80)}px`,
              backgroundColor: '#ffffff',
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: '0 12px 32px -6px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(0, 102, 255, 0.15)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 50,
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em' }}>
                {hovered.country}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(0, 102, 255, 0.08)',
                  color: '#0066FF'
                }}
              >
                #{hovered.rank} Rank
              </span>
            </div>

            <div style={{ fontSize: '17px', fontWeight: 800, color: '#0066FF', letterSpacing: '-0.02em', marginTop: '2px' }}>
              {formatTradeValue(hovered.tradeValue)}
            </div>

            <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: demandFill(hovered.demand)
                }}
              />
              {hovered.demand} Demand · {formatShare(hovered.sharePct)} market share
            </div>
          </div>
        )}
      </div>

      {/* Legend bar */}
      <div
        className="row row-wrap"
        style={{
          gap: 'var(--sp-4)',
          padding: 'var(--sp-3) var(--sp-4)',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#f8fafc',
          borderBottomLeftRadius: '14px',
          borderBottomRightRadius: '14px'
        }}
      >
        {(['Very High', 'High', 'Moderate', 'Low', 'Niche'] as const)
          .filter((level) => recommendations.some((r) => r.demand === level))
          .map((level) => (
            <span key={level} className="row row-sm" style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: demandFill(level),
                  display: 'inline-block'
                }}
              />
              {level} Demand
            </span>
          ))}
      </div>
    </div>
  );
}
