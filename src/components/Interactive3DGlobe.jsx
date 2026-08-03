'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Interactive3DGlobe({ onSelectCountry }) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0.22, y: 0.5 });
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [hoveredHub, setHoveredHub] = useState(null);
  const [photonProgress, setPhotonProgress] = useState(0);

  // Global Hubs & Market Data
  const HUBS = [
    { id: 'de', name: 'Germany', flag: '🇩🇪', lat: 51.16, lng: 10.45, demand: 'High Demand (94)', volume: '$128.6M', color: '#0066FF' },
    { id: 'ae', name: 'UAE', flag: '🇦🇪', lat: 23.42, lng: 53.84, demand: 'Very High Demand (98)', volume: '$38.7M', color: '#0066FF' },
    { id: 'us', name: 'United States', flag: '🇺🇸', lat: 37.09, lng: -95.71, demand: 'High Demand (91)', volume: '$312.4M', color: '#0066FF' },
    { id: 'cn', name: 'China', flag: '🇨🇳', lat: 35.86, lng: 104.19, demand: 'Top Supplier (99)', volume: '$580.2M', color: '#0066FF' },
    { id: 'au', name: 'Australia', flag: '🇦🇺', lat: -25.27, lng: 133.77, demand: 'High Demand (88)', volume: '$45.2M', color: '#0066FF' },
    { id: 'jp', name: 'Japan', flag: '🇯🇵', lat: 36.20, lng: 138.25, demand: 'Moderate Demand (82)', volume: '$85.3M', color: '#0066FF' },
    { id: 'sg', name: 'Singapore', flag: '🇸🇬', lat: 1.35, lng: 103.81, demand: 'High Transit (92)', volume: '$42.1M', color: '#0066FF' },
    { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', lat: 55.37, lng: -3.43, demand: 'High Demand (89)', volume: '$96.4M', color: '#0066FF' }
  ];

  // Auto-rotation & Photon Pulse Animation Loop
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (!isDragging) {
        setRotation(prev => ({ ...prev, y: prev.y + 0.0035 }));
      }
      setPhotonProgress(prev => (prev + 0.008) % 1);
      drawGlobe();
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging, rotation, photonProgress]);

  const latLngTo3D = (lat, lng, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180) + rotation.y;

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi) * Math.cos(rotation.x) - z * Math.sin(rotation.x);
    const finalZ = radius * Math.cos(phi) * Math.sin(rotation.x) + z * Math.cos(rotation.x);

    return { x, y, z: finalZ, visible: finalZ > 0 };
  };

  const drawGlobe = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Retina Resolution Scaling
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.38;

    ctx.clearRect(0, 0, width, height);

    // 1. Soft Blue Outer Atmosphere Glow
    const atmosGrad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.3);
    atmosGrad.addColorStop(0, 'rgba(0, 102, 255, 0.12)');
    atmosGrad.addColorStop(0.5, 'rgba(0, 102, 255, 0.04)');
    atmosGrad.addColorStop(1, 'rgba(0, 102, 255, 0)');
    ctx.fillStyle = atmosGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // 2. Globe Sphere (Crisp Ocean Gradient)
    const oceanGrad = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.05, cx, cy, radius);
    oceanGrad.addColorStop(0, '#ffffff');
    oceanGrad.addColorStop(0.4, '#f0f6ff');
    oceanGrad.addColorStop(1, '#dbeafe');
    ctx.fillStyle = oceanGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Outer subtle border
    ctx.strokeStyle = '#bfdbfe';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Grid Lines (Subtle parallels & meridians)
    ctx.strokeStyle = 'rgba(0, 102, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lng = -180; lng <= 180; lng += 8) {
        const pt = latLngTo3D(lat, lng, radius);
        if (pt.visible) {
          const screenX = cx + pt.x;
          const screenY = cy + pt.y;
          if (lng === -180) ctx.moveTo(screenX, screenY);
          else ctx.lineTo(screenX, screenY);
        }
      }
      ctx.stroke();
    }

    // 4. Continents Point Cloud Simulation
    for (let lat = -70; lat <= 70; lat += 10) {
      for (let lng = -180; lng <= 180; lng += 12) {
        // Simple procedural landmass filter
        const isLand = Math.sin(lat * 0.05) * Math.cos(lng * 0.04) + Math.cos(lat * 0.08) > 0.15;
        if (isLand) {
          const pt = latLngTo3D(lat, lng, radius);
          if (pt.visible) {
            ctx.fillStyle = '#93c5fd';
            ctx.beginPath();
            ctx.arc(cx + pt.x, cy + pt.y, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 5. Dynamic Trade Corridors (Curved Arcs)
    const tradeConnections = [
      [HUBS[0], HUBS[1]], // DE -> UAE
      [HUBS[1], HUBS[3]], // UAE -> CN
      [HUBS[3], HUBS[4]], // CN -> AU
      [HUBS[0], HUBS[2]], // DE -> US
      [HUBS[2], HUBS[3]], // US -> CN
      [HUBS[1], HUBS[6]], // UAE -> SG
      [HUBS[3], HUBS[5]]  // CN -> JP
    ];

    tradeConnections.forEach(([hub1, hub2]) => {
      const p1 = latLngTo3D(hub1.lat, hub1.lng, radius);
      const p2 = latLngTo3D(hub2.lat, hub2.lng, radius);

      if (p1.visible && p2.visible) {
        const sx1 = cx + p1.x;
        const sy1 = cy + p1.y;
        const sx2 = cx + p2.x;
        const sy2 = cy + p2.y;

        const midX = (sx1 + sx2) / 2 + (sy2 - sy1) * 0.2;
        const midY = (sy1 + sy2) / 2 - Math.abs(sx2 - sx1) * 0.25;

        // Base Arc
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 102, 255, 0.55)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(sx1, sy1);
        ctx.quadraticCurveTo(midX, midY, sx2, sy2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Traveling Photon Particle along Bezier curve
        const t = photonProgress;
        const px = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * midX + t * t * sx2;
        const py = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * midY + t * t * sy2;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#0066FF';
        ctx.shadowColor = '#0066FF';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // 6. Hub Pins & Badges
    HUBS.forEach((hub) => {
      const p = latLngTo3D(hub.lat, hub.lng, radius);
      if (p.visible) {
        const sx = cx + p.x;
        const sy = cy + p.y;

        // Pulsing radar ring
        ctx.beginPath();
        ctx.arc(sx, sy, 7 + Math.sin(photonProgress * Math.PI * 2) * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 102, 255, 0.2)';
        ctx.fill();

        // Pin core
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0066FF';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Flag & Country label
        ctx.font = '600 11.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(`${hub.flag} ${hub.name}`, sx + 8, sy + 4);
      }
    });

    ctx.restore();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setRotation(prev => ({
      x: Math.max(-0.85, Math.min(0.85, prev.x + dy * 0.005)),
      y: prev.y + dx * 0.005
    }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />

      {/* Floating Interactive Badge Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        padding: '6px 14px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '11.5px',
        color: '#475569',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        pointerEvents: 'none'
      }}>
        🖱️ Click & Drag to Explore Live 3D Corridors
      </div>
    </div>
  );
}
