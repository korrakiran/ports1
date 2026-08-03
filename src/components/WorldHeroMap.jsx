'use client';

import React, { useState } from 'react';
import Interactive3DGlobe from './Interactive3DGlobe';
import WorldSVGMap from './WorldSVGMap';

/**
 * WorldHeroMap matching the exact design in Screenshot 2026-08-03 210354.png
 * Features:
 * - Detailed equirectangular political SVG Map (WorldSVGMap)
 * - Highlighted United States in deep slate-blue (#7392e2)
 * - Highlighted Australia in soft periwinkle (#a5c4f7)
 * - Rest of the world in light periwinkle (#e8effb) with clean white country borders
 * - Double concentric radar beacon pins positioned accurately at:
 *   USA, UK, Germany, Brazil, UAE, China, Japan, Australia
 * - 3 exact floating white callout cards matching the screenshot
 */
export default function WorldHeroMap() {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'globe'

  // Coordinates of the pins on the SVG map (viewBox="0 0 1010 666")
  // Converted to percentages: X% = (x / 1010) * 100, Y% = (y / 666) * 100
  // Centroids computed from WorldSVGMap's actual path geometry (viewBox 0 0 1010 666)
  // by taking the largest-bbox subpath per country (i.e. the mainland, not outlying islands).
  const pins = [
    { id: 'us', name: 'USA', left: '22.2%', top: '51.4%', size: 7 },
    { id: 'br', name: 'Brazil', left: '31.4%', top: '74.0%', size: 6 },
    { id: 'gb', name: 'UK', left: '46.1%', top: '42.3%', size: 5 },
    { id: 'de', name: 'Germany', left: '49.9%', top: '44.7%', size: 6.5 },
    { id: 'ae', name: 'UAE', left: '62.2%', top: '59.1%', size: 7 },
    { id: 'cn', name: 'China', left: '76.5%', top: '52.9%', size: 5.5 },
    { id: 'jp', name: 'Japan', left: '85.3%', top: '52.9%', size: 5.5 },
    { id: 'au', name: 'Australia', left: '84.3%', top: '79.7%', size: 7 },
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '480px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none'
    }}>
      {/* Dynamic Style Injection for Map and Ping Animations */}
      <style>{`
        /* Map Styles */
        .world-map-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .world-map-svg path {
          fill: #e8effb;
          stroke: #ffffff;
          stroke-width: 0.65;
          transition: fill 0.25s ease;
        }
        .world-map-svg path#us {
          fill: #7392e2;
        }
        .world-map-svg path#au {
          fill: #a5c4f7;
        }
        .world-map-svg path:hover {
          fill: #d2e1f9;
        }

        /* Ping Ring Animation */
        @keyframes map-ping {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .map-ping-ring {
          animation: map-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Mode Switcher Toggle */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        padding: '3px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '4px',
        zIndex: 30,
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
      }}>
        <button
          onClick={() => setViewMode('map')}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 700,
            border: 'none',
            backgroundColor: viewMode === 'map' ? '#0066FF' : 'transparent',
            color: viewMode === 'map' ? '#ffffff' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Map View
        </button>
        <button
          onClick={() => setViewMode('globe')}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 700,
            border: 'none',
            backgroundColor: viewMode === 'globe' ? '#0066FF' : 'transparent',
            color: viewMode === 'globe' ? '#ffffff' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          3D Globe
        </button>
      </div>

      {viewMode === 'globe' ? (
        <div style={{ width: '100%', height: '480px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <Interactive3DGlobe />
        </div>
      ) : (
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible'
        }}>
          {/* Vector SVG World Map with country paths */}
          <WorldSVGMap className="world-map-svg" />

          {/* ======================================================== */}
          {/* BEACON TARGET PINS overlaying the centroids */}
          {/* ======================================================== */}
          {pins.map((pin) => (
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
                zIndex: 10
              }}
            >
              {/* Outer pulsing ring */}
              <div style={{
                position: 'absolute',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: pin.id === 'us' ? 'rgba(115, 146, 226, 0.45)' : 'rgba(0, 102, 255, 0.25)',
                transformOrigin: 'center'
              }} className="map-ping-ring" />

              {/* Middle glow */}
              <div style={{
                position: 'absolute',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: pin.id === 'us' ? 'rgba(115, 146, 226, 0.6)' : 'rgba(0, 102, 255, 0.45)'
              }} />

              {/* Inner core dot */}
              <div style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: pin.id === 'us' ? '#ffffff' : '#0066FF',
                boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)'
              }} />
            </div>
          ))}

          {/* ======================================================== */}
          {/* 3 EXACT FLOATING WHITE CALLOUT CARDS (Matching Screenshot) */}
          {/* ======================================================== */}

          {/* Card 1: Germany (Positioned right of DE pin) */}
          <div style={{
            position: 'absolute',
            top: '38.5%',
            left: '53%',
            backgroundColor: '#ffffff',
            padding: '7px 14px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            zIndex: 15,
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Germany
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#0066FF', lineHeight: 1.2 }}>
              High demand
            </span>
          </div>

          {/* Card 2: United Arab Emirates (Positioned right/above UAE pin) */}
          <div style={{
            position: 'absolute',
            top: '53.5%',
            left: '65.5%',
            backgroundColor: '#ffffff',
            padding: '7px 14px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            zIndex: 15,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              United Arab Emirates
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#0066FF', lineHeight: 1.2 }}>
              Very high demand
            </span>
          </div>

          {/* Card 3: Australia (Positioned left of Australia pin) */}
          <div style={{
            position: 'absolute',
            top: '73%',
            left: '72.5%',
            backgroundColor: '#ffffff',
            padding: '7px 14px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            zIndex: 15,
            pointerEvents: 'none'
          }}>
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
