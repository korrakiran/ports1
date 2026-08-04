'use client';

import React, { forwardRef } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Hover card for a country on the globe.
 *
 * Positioning is driven imperatively by the parent (it writes `transform` straight
 * onto this node on mousemove) so that tracking the cursor never re-renders the
 * WebGL canvas above it.
 *
 * Shows the country name and its qualitative example label only — never a score.
 */
const GlobeTooltip = forwardRef(function GlobeTooltip({ country }, ref) {
  const visible = Boolean(country);

  return (
    <div
      ref={ref}
      aria-hidden={!visible}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.18s ease',
        willChange: 'transform',
        pointerEvents: 'none',
        zIndex: 40,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        padding: '12px 16px',
        minWidth: '190px',
        maxWidth: '250px'
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em' }}>
        {country?.name ?? ''}
      </div>

      {country?.level ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '5px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: country.color,
            flexShrink: 0
          }} />
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: country.color }}>
            {country.level}
          </span>
        </div>
      ) : (
        <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '5px' }}>
          {country?.emptyLabel}
        </div>
      )}

      {country?.level && !country.isOrigin && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '10px',
          paddingTop: '9px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '11.5px',
          fontWeight: 700,
          color: '#0066ff'
        }}>
          Click to view details <ArrowRight size={12} />
        </div>
      )}
    </div>
  );
});

export default GlobeTooltip;
