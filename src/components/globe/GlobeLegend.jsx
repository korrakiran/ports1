'use client';

import React from 'react';
import { LEGEND_ITEMS } from './globeData';

/**
 * Colour key for the hero globe. These are fixed example countries used as a
 * visual, not analysis output — real recommendations come from the trade data.
 */
export default function GlobeLegend() {
  return (
    <div style={{
      position: 'absolute',
      left: '16px',
      bottom: '16px',
      zIndex: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(226, 232, 240, 0.9)',
      borderRadius: '12px',
      padding: '12px 14px',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
      pointerEvents: 'none',
      maxWidth: '220px'
    }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '9px'
      }}>
        Example markets
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '9px',
              height: '9px',
              borderRadius: '2px',
              backgroundColor: item.color,
              flexShrink: 0
            }} />
            <span style={{ fontSize: '11.5px', color: '#334155', fontWeight: 500, lineHeight: 1.3 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '10px',
        paddingTop: '9px',
        borderTop: '1px solid #f1f5f9',
        fontSize: '10.5px',
        color: '#94a3b8',
        lineHeight: 1.45
      }}>
        Example countries shown as a visual. Your own results are computed from 2024 trade data.
      </div>
    </div>
  );
}
