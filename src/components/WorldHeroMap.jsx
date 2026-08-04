'use client';

import React, { useState, useRef, useCallback } from 'react';
import Interactive3DGlobe from './globe/Interactive3DGlobe';
import WorldSVGMap from './WorldSVGMap';

/**
 * Enhanced WorldHeroMap:
 * - Interactive 2D & 3D switching
 * - Country hover 3D "Pop Out" effect with dynamic glow, elevation shadow, and hover tooltips
 * - Concurrently pulsing target market beacon pins
 * - Widescreen width layout
 */
export default function WorldHeroMap() {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'globe'
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const pins = [
    { id: 'us', name: 'United States', demand: 'Very high demand', type: 'Premium Market', left: '22.2%', top: '51.4%' },
    { id: 'br', name: 'Brazil', demand: 'Growing demand', type: 'Volume Market', left: '31.4%', top: '74.0%' },
    { id: 'gb', name: 'United Kingdom', demand: 'High demand', type: 'Premium Market', left: '46.1%', top: '42.3%' },
    { id: 'de', name: 'Germany', demand: 'High demand', type: 'Premium Market', left: '49.9%', top: '44.7%' },
    { id: 'ae', name: 'United Arab Emirates', demand: 'Very high demand', type: 'Re-export Hub', left: '62.2%', top: '59.1%' },
    { id: 'in', name: 'India', demand: 'Export Origin (Your Base)', type: 'Manufacturing Hub', left: '68.5%', top: '57.0%' },
    { id: 'cn', name: 'China', demand: 'Volume Market', type: 'Manufacturing Hub', left: '76.5%', top: '52.9%' },
    { id: 'jp', name: 'Japan', demand: 'High demand', type: 'Premium Market', left: '85.3%', top: '52.9%' },
    { id: 'au', name: 'Australia', demand: 'High demand', type: 'Volume Market', left: '84.3%', top: '79.7%' },
  ];

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleSvgMouseOver = (e) => {
    const target = e.target;
    if (target.tagName === 'path') {
      const id = target.getAttribute('id');
      const label = target.getAttribute('aria-label');
      if (label || id) {
        const pin = pins.find((p) => p.id === id);
        setHoveredCountry({
          id,
          name: label || id?.toUpperCase(),
          demand: pin?.demand || 'Active Market Opportunity',
          type: pin?.type || 'Target Export Destination',
          isTarget: Boolean(pin)
        });
      }
    }
  };

  const handleSvgMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* Dynamic Style Injection for Map Pop and Beacon Animations */}
      <style>{`
        .world-map-svg {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 8px 24px rgba(15, 23, 42, 0.04));
        }
        .world-map-svg path {
          fill: #e8effb;
          stroke: #ffffff;
          stroke-width: 0.7;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      fill 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      stroke-width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center center;
          cursor: pointer;
        }
        .world-map-svg path#us {
          fill: #7392e2;
        }
        .world-map-svg path#au {
          fill: #a5c4f7;
        }
        .world-map-svg path#de {
          fill: #3b82f6;
        }
        .world-map-svg path#ae {
          fill: #2563eb;
        }
        .world-map-svg path#in {
          fill: #1d4ed8;
        }

        /* 3D POP OUT HOVER EFFECT FOR COUNTRY PATHS */
        .world-map-svg path:hover {
          fill: #0066FF !important;
          stroke: #ffffff !important;
          stroke-width: 1.8 !important;
          filter: drop-shadow(0 10px 20px rgba(0, 102, 255, 0.45));
          transform: translateY(-4px) scale(1.02);
        }

        /* Ping Ring Animation */
        @keyframes map-ping {
          0% {
            transform: scale(0.6);
            opacity: 0.85;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .map-ping-ring {
          animation: map-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Mode Switcher Toggle */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          display: 'flex',
          gap: '4px',
          zIndex: 35,
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)'
        }}
      >
        <button
          onClick={() => setViewMode('map')}
          style={{
            padding: '5px 12px',
            borderRadius: '7px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            backgroundColor: viewMode === 'map' ? '#0066FF' : 'transparent',
            color: viewMode === 'map' ? '#ffffff' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.18s ease'
          }}
        >
          Map View
        </button>
        <button
          onClick={() => setViewMode('globe')}
          style={{
            padding: '5px 12px',
            borderRadius: '7px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            backgroundColor: viewMode === 'globe' ? '#0066FF' : 'transparent',
            color: viewMode === 'globe' ? '#ffffff' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.18s ease'
          }}
        >
          3D Globe
        </button>
      </div>

      {viewMode === 'globe' ? (
        <div
          style={{
            width: '100%',
            height: '520px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}
        >
          <Interactive3DGlobe />
        </div>
      ) : (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible'
          }}
        >
          {/* Vector SVG World Map with Hover Interactions */}
          <WorldSVGMap
            className="world-map-svg"
            onMouseOver={handleSvgMouseOver}
            onMouseLeave={handleSvgMouseLeave}
          />

          {/* Dynamic Hover Tooltip following the cursor */}
          {hoveredCountry && (
            <div
              style={{
                position: 'absolute',
                left: `${tooltipPos.x + 16}px`,
                top: `${tooltipPos.y - 48}px`,
                transform: 'translate3d(0, 0, 0)',
                backgroundColor: '#ffffff',
                padding: '9px 15px',
                borderRadius: '10px',
                boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(0, 102, 255, 0.15)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 40,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#0066FF',
                    boxShadow: '0 0 6px rgba(0, 102, 255, 0.6)'
                  }}
                />
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em' }}>
                  {hoveredCountry.name}
                </span>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#0066FF' }}>
                {hoveredCountry.demand}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 500, color: '#64748b' }}>
                {hoveredCountry.type}
              </span>
            </div>
          )}

          {/* BEACON TARGET PINS overlaying the centroids */}
          {pins.map((pin) => {
            const isHovered = hoveredCountry?.id === pin.id;
            return (
              <div
                key={pin.id}
                style={{
                  position: 'absolute',
                  left: pin.left,
                  top: pin.top,
                  width: '0px',
                  height: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'visible',
                  zIndex: isHovered ? 25 : 10
                }}
              >
                {/* Outer pulsing ring */}
                <div
                  style={{
                    position: 'absolute',
                    width: isHovered ? '42px' : '32px',
                    height: isHovered ? '42px' : '32px',
                    borderRadius: '50%',
                    backgroundColor: pin.id === 'us' ? 'rgba(115, 146, 226, 0.55)' : 'rgba(0, 102, 255, 0.35)',
                    transformOrigin: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  className="map-ping-ring"
                />

                {/* Middle glow */}
                <div
                  style={{
                    position: 'absolute',
                    width: isHovered ? '18px' : '14px',
                    height: isHovered ? '18px' : '14px',
                    borderRadius: '50%',
                    backgroundColor: pin.id === 'us' ? 'rgba(115, 146, 226, 0.8)' : 'rgba(0, 102, 255, 0.65)',
                    transition: 'all 0.2s ease'
                  }}
                />

                {/* Inner core dot */}
                <div
                  style={{
                    position: 'absolute',
                    width: isHovered ? '8px' : '6px',
                    height: isHovered ? '8px' : '6px',
                    borderRadius: '50%',
                    backgroundColor: pin.id === 'us' ? '#ffffff' : '#0066FF',
                    boxShadow: '0 0 6px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            );
          })}

          {/* 3 DEFAULT FLOATING CALLOUT CARDS */}
          {/* Card 1: Germany */}
          <div
            style={{
              position: 'absolute',
              top: '38.5%',
              left: '53%',
              backgroundColor: '#ffffff',
              padding: '7px 14px',
              borderRadius: '9px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              zIndex: 15,
              pointerEvents: 'none'
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Germany
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#0066FF', lineHeight: 1.2 }}>
              High demand
            </span>
          </div>

          {/* Card 2: United Arab Emirates */}
          <div
            style={{
              position: 'absolute',
              top: '53.5%',
              left: '65.5%',
              backgroundColor: '#ffffff',
              padding: '7px 14px',
              borderRadius: '9px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              zIndex: 15,
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              United Arab Emirates
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#0066FF', lineHeight: 1.2 }}>
              Very high demand
            </span>
          </div>

          {/* Card 3: Australia */}
          <div
            style={{
              position: 'absolute',
              top: '73%',
              left: '72.5%',
              backgroundColor: '#ffffff',
              padding: '7px 14px',
              borderRadius: '9px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              zIndex: 15,
              pointerEvents: 'none'
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Australia
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#0066FF', lineHeight: 1.2 }}>
              High demand
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
