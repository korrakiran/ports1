'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

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

  /**
   * The card follows the cursor.
   *
   * Position is written straight onto the node rather than held in state — a
   * setState per mousemove would re-render the whole map on every pixel.
   */
  const moveTip = useCallback((clientX: number, clientY: number) => {
    const tip = tipRef.current;
    const wrap = wrapRef.current;
    if (!tip || !wrap) return;

    const box = wrap.getBoundingClientRect();
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;

    let x = clientX - box.left + 16;
    let y = clientY - box.top + 16;

    // Flip near the right and bottom edges so the card stays inside the map.
    if (x + w > box.width) x = clientX - box.left - w - 16;
    if (y + h > box.height) y = clientY - box.top - h - 16;

    tip.style.transform = `translate3d(${Math.max(0, x)}px, ${Math.max(0, y)}px, 0)`;
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const iso = isoFromEvent(e);
      const match = iso ? (byIso2.get(iso) ?? null) : null;
      setHovered((prev) => (prev?.countryIso2 === match?.countryIso2 ? prev : match));
      if (match) moveTip(e.clientX, e.clientY);
    },
    [byIso2, moveTip]
  );

  return (
    <div className="card card--flush" style={{ position: 'relative' }} ref={wrapRef}>
      <style>{`
        .heatmap-svg path { fill: #eff2f7; stroke: #ffffff; stroke-width: 0.5; }
        ${css}
      `}</style>

      <div
        style={{ padding: 'var(--sp-5) var(--sp-4)' }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
        onClick={(e) => {
          const iso = isoFromEvent(e);
          const match = iso ? byIso2.get(iso) : undefined;
          if (match && onSelect) onSelect(match);
        }}
      >
        {/* Full extent: the source SVG is already tightly fitted — Canada starts
            at y=12 and Australia ends at y=646, so there is no empty band to crop
            without clipping a real market. Size is controlled by width instead. */}
        <WorldSVGMap className="heatmap-svg" />
      </div>

      {/* Kept mounted so its size is measurable before the first move. */}
      <div
        ref={tipRef}
        className="map-tip"
        data-visible={hovered ? 'true' : 'false'}
        aria-hidden={!hovered}
      >
        <div className="map-tip-country">{hovered?.country ?? ''}</div>
        <div
          className="map-tip-meta"
          style={{ color: hovered ? demandFill(hovered.demand) : undefined }}
        >
          {hovered ? `${hovered.demand} demand · ${hovered.marketType}` : ''}
        </div>
      </div>

      <div
        className="row row-wrap"
        style={{
          gap: 'var(--sp-3)',
          padding: 'var(--sp-3) var(--sp-4)',
          borderTop: '1px solid var(--border-subtle)'
        }}
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
