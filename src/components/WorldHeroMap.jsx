'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import WorldSVGMap from './WorldSVGMap';

// Dynamically import 3D Globe to avoid SSR canvas / window issues
const Interactive3DGlobe = dynamic(() => import('./globe/Interactive3DGlobe'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '20px',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: 600
      }}
    >
      Loading 3D Globe...
    </div>
  )
});

/**
 * WorldHeroMap Component
 * Interactive vector map with centroid target beacons, hover callouts, and 3D Globe toggle.
 */
export default function WorldHeroMap() {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'globe'
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // PINS mapped to SVG Centroids
  const pins = [
    { id: 'us', name: 'United States', left: '22%', top: '44%', demand: 'High Demand', type: 'Primary Importer' },
    { id: 'de', name: 'Germany', left: '50.5%', top: '35%', demand: 'High Demand', type: 'European Hub' },
    { id: 'ae', name: 'United Arab Emirates', left: '61.5%', top: '49%', demand: 'Very High Demand', type: 'Middle East Gateway' },
    { id: 'in', name: 'India', left: '67%', top: '51%', demand: 'Origin Country', type: 'Export Base' },
    { id: 'au', name: 'Australia', left: '85.5%', top: '75%', demand: 'High Demand', type: 'Pacific Importer' }
  ];

  // SVG Mouse handlers for interactive hover
  const handleSvgMouseOver = (e) => {
    const path = e.target.closest('path');
    if (!path) return;

    const id = path.id;
    const matchedPin = pins.find((p) => p.id === id);

    if (matchedPin) {
      setHoveredCountry(matchedPin);
    } else {
      const countryName = path.getAttribute('name') || id.toUpperCase();
      setHoveredCountry({
        id,
        name: countryName,
        demand: 'Active Market',
        type: 'Trade Partner'
      });
    }
  };

  const handleSvgMouseLeave = () => {
    setHoveredCountry(null);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const stage = document.getElementById('world-hero-stage');
      if (stage) {
        const rect = stage.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      id="world-hero-stage"
      className="hero-map-stage"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <style jsx global>{`
        /* Target SVG paths styling */
        .world-map-svg path {
          fill: #e4e9f0;
          stroke: #ffffff;
          stroke-width: 0.75;
          transition: fill 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease;
          cursor: pointer;
        }

        .world-map-svg path:hover {
          fill: #0066FF !important;
          filter: drop-shadow(0 4px 12px rgba(0, 102, 255, 0.4));
        }

        /* Key recommended markets highlighted in soft blue */
        .world-map-svg path#us,
        .world-map-svg path#de,
        .world-map-svg path#ae,
        .world-map-svg path#au {
          fill: #7392e2;
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
        className="hero-map-mode-toggle"
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
            height: '420px',
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
            overflow: 'hidden'
          }}
        >
          {/* Vector SVG World Map */}
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
                <div
                  style={{
                    position: 'absolute',
                    width: isHovered ? '36px' : '26px',
                    height: isHovered ? '36px' : '26px',
                    borderRadius: '50%',
                    backgroundColor: pin.id === 'us' ? 'rgba(115, 146, 226, 0.55)' : 'rgba(0, 102, 255, 0.35)',
                    transformOrigin: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  className="map-ping-ring"
                />
                <div
                  style={{
                    position: 'absolute',
                    width: isHovered ? '16px' : '12px',
                    height: isHovered ? '16px' : '12px',
                    borderRadius: '50%',
                    backgroundColor: pin.id === 'us' ? 'rgba(115, 146, 226, 0.8)' : 'rgba(0, 102, 255, 0.65)',
                    transition: 'all 0.2s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    width: isHovered ? '7px' : '5px',
                    height: isHovered ? '7px' : '5px',
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
            className="hero-map-callout hero-map-callout-germany"
            style={{
              position: 'absolute',
              top: '38.5%',
              left: '53%',
              backgroundColor: '#ffffff',
              padding: '6px 12px',
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
            <span className="hero-map-callout-title" style={{ fontSize: '12px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Germany
            </span>
            <span className="hero-map-callout-sub" style={{ fontSize: '10.5px', fontWeight: 600, color: '#0066FF', lineHeight: 1.2 }}>
              High demand
            </span>
          </div>

          {/* Card 2: United Arab Emirates */}
          <div
            className="hero-map-callout hero-map-callout-uae"
            style={{
              position: 'absolute',
              top: '53.5%',
              left: '64.5%',
              backgroundColor: '#ffffff',
              padding: '6px 12px',
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
            <span className="hero-map-callout-title" style={{ fontSize: '12px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              United Arab Emirates
            </span>
            <span className="hero-map-callout-sub" style={{ fontSize: '10.5px', fontWeight: 600, color: '#0066FF', lineHeight: 1.2 }}>
              Very high demand
            </span>
          </div>

          {/* Card 3: Australia */}
          <div
            className="hero-map-callout hero-map-callout-aus"
            style={{
              position: 'absolute',
              top: '73%',
              left: '70.5%',
              backgroundColor: '#ffffff',
              padding: '6px 12px',
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
            <span className="hero-map-callout-title" style={{ fontSize: '12px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Australia
            </span>
            <span className="hero-map-callout-sub" style={{ fontSize: '10.5px', fontWeight: 600, color: '#0066FF', lineHeight: 1.2 }}>
              High demand
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
