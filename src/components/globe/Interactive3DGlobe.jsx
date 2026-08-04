'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import GlobeTooltip from './GlobeTooltip';
import GlobeLegend from './GlobeLegend';
import {
  DEMAND_LEVELS,
  GEOJSON_URL,
  MARKER_POINTS,
  MARKET_BY_ISO,
  ORIGIN,
  TEXTURES,
  TRADE_ROUTES,
  UNHIGHLIGHTED_COLOR,
  UNHIGHLIGHTED_LABEL
} from './globeData';

// react-globe.gl touches `window` on import, so it can never run through SSR.
// Loading it lazily also keeps three.js out of the initial bundle until the
// user actually opens the 3D tab.
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => <GlobeFallback message="Loading globe…" />
});

function GlobeFallback({ message }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: '13px',
      fontWeight: 500
    }}>
      {message}
    </div>
  );
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Interactive3DGlobe({ onSelectCountry }) {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [countries, setCountries] = useState([]);
  const [hovered, setHovered] = useState(null);
  // Routes and markers stay hidden until the intro flight finishes.
  const [revealed, setRevealed] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Responsive sizing                                                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ------------------------------------------------------------------ */
  /* Country polygons (lazy fetched)                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let cancelled = false;
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((geo) => {
        if (cancelled) return;
        // Antarctica adds a large distracting cap and is never a target market.
        setCountries(geo.features.filter((f) => f.properties.ADM0_A3 !== 'ATA'));
      })
      .catch(() => {
        /* Globe still renders with textures if the polygon layer fails. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /* Intro camera flight: space -> Earth -> India -> reveal markets      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || size.width === 0) return;

    const controls = globe.controls();
    controls.enableDamping = true;      // inertial rotation
    controls.dampingFactor = 0.12;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.enablePan = true;
    controls.minDistance = 130;         // clamp zoom so the globe can't be lost
    controls.maxDistance = 620;
    controls.autoRotate = false;

    if (prefersReducedMotion()) {
      globe.pointOfView({ lat: ORIGIN.lat, lng: ORIGIN.lng, altitude: 1.9 }, 0);
      setRevealed(true);
      return;
    }

    // Start far out, off to one side, so the flight has somewhere to travel from.
    globe.pointOfView({ lat: 8, lng: -40, altitude: 3.6 }, 0);

    const flyIn = setTimeout(() => {
      globe.pointOfView({ lat: ORIGIN.lat, lng: ORIGIN.lng, altitude: 1.9 }, 3800);
    }, 400);

    const reveal = setTimeout(() => setRevealed(true), 4000);

    const spin = setTimeout(() => {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.28;
    }, 6200);

    return () => {
      clearTimeout(flyIn);
      clearTimeout(reveal);
      clearTimeout(spin);
    };
  }, [size.width]);

  /* Pause the idle spin while the user is inspecting a country. */
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !revealed || prefersReducedMotion()) return;
    const controls = globe.controls();
    controls.autoRotate = !hovered;
  }, [hovered, revealed]);

  /* ------------------------------------------------------------------ */
  /* Layer accessors                                                     */
  /* ------------------------------------------------------------------ */
  const hoveredIso = hovered?.iso ?? null;

  const polygonCapColor = useCallback(
    (feat) => {
      const iso = feat.properties.ADM0_A3;
      const market = MARKET_BY_ISO[iso];
      if (iso === hoveredIso) return '#ffffff';
      if (iso === ORIGIN.iso) return ORIGIN.color;
      if (market) return DEMAND_LEVELS[market.level].color;
      return UNHIGHLIGHTED_COLOR;
    },
    [hoveredIso]
  );

  const polygonAltitude = useCallback(
    (feat) => {
      const iso = feat.properties.ADM0_A3;
      if (iso === hoveredIso) return 0.05;
      if (MARKET_BY_ISO[iso] || iso === ORIGIN.iso) return 0.022;
      return 0.008;
    },
    [hoveredIso]
  );

  const handlePolygonHover = useCallback((feat) => {
    if (!feat) {
      setHovered(null);
      return;
    }
    const iso = feat.properties.ADM0_A3;
    const market = MARKET_BY_ISO[iso];

    if (iso === ORIGIN.iso) {
      setHovered({ iso, name: ORIGIN.name, level: 'Your base', color: ORIGIN.color, isOrigin: true });
    } else if (market) {
      setHovered({
        iso,
        name: market.name,
        level: DEMAND_LEVELS[market.level].label,
        color: DEMAND_LEVELS[market.level].color
      });
    } else {
      setHovered({
        iso,
        name: feat.properties.ADMIN,
        level: null,
        emptyLabel: UNHIGHLIGHTED_LABEL
      });
    }
  }, []);

  const handlePolygonClick = useCallback(
    (feat) => {
      const market = MARKET_BY_ISO[feat?.properties?.ADM0_A3];
      if (market && onSelectCountry) onSelectCountry(market);
    },
    [onSelectCountry]
  );

  /* Singapore has no polygon at 110m resolution, so points carry hover too. */
  const handlePointHover = useCallback((pt) => {
    if (!pt) {
      setHovered(null);
      return;
    }
    setHovered({
      iso: pt.iso,
      name: pt.name,
      level: pt.levelLabel,
      color: pt.isOrigin ? ORIGIN.color : pt.color,
      isOrigin: pt.isOrigin
    });
  }, []);

  /* Cursor tracking is imperative — updating state here would re-render the canvas. */
  const handleMouseMove = useCallback((e) => {
    const node = tooltipRef.current;
    const box = containerRef.current;
    if (!node || !box) return;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Flip the card near the right/bottom edges so it stays inside the panel.
    const dx = x + 270 > rect.width ? x - 250 : x + 16;
    const dy = y + 130 > rect.height ? y - 120 : y + 16;
    node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  }, []);

  const arcsData = useMemo(() => (revealed ? TRADE_ROUTES : []), [revealed]);
  const pointsData = useMemo(() => (revealed ? MARKER_POINTS : []), [revealed]);
  const ringsData = useMemo(
    () => (revealed && !prefersReducedMotion() ? MARKER_POINTS : []),
    [revealed]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: hovered ? 'pointer' : 'grab',
        touchAction: 'none'
      }}
    >
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          animateIn={false}
          rendererConfig={{ antialias: true, alpha: true }}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={TEXTURES.earth}
          bumpImageUrl={TEXTURES.bump}
          showAtmosphere
          atmosphereColor="#7ab3ff"
          atmosphereAltitude={0.18}
          /* Country layer */
          polygonsData={countries}
          polygonCapColor={polygonCapColor}
          polygonSideColor={() => 'rgba(0, 71, 179, 0.14)'}
          polygonStrokeColor={() => 'rgba(255, 255, 255, 0.45)'}
          polygonAltitude={polygonAltitude}
          polygonsTransitionDuration={280}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={handlePolygonClick}
          /* Trade routes from India */
          arcsData={arcsData}
          arcColor={(d) => [`rgba(0, 102, 255, 0.05)`, d.color]}
          arcAltitudeAutoScale={0.42}
          arcStroke={0.55}
          arcDashLength={0.4}
          arcDashGap={0.22}
          arcDashAnimateTime={prefersReducedMotion() ? 0 : 2600}
          arcsTransitionDuration={1200}
          /* Market markers */
          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointColor={(d) => (d.isOrigin ? ORIGIN.color : d.color)}
          pointAltitude={0.028}
          pointRadius={0.32}
          pointsMerge={false}
          pointsTransitionDuration={900}
          onPointHover={handlePointHover}
          onPointClick={(pt) => !pt.isOrigin && onSelectCountry?.(pt)}
          /* Pulsing halo under each marker */
          ringsData={ringsData}
          ringLat="lat"
          ringLng="lng"
          ringColor={(d) => () => (d.isOrigin ? 'rgba(9, 13, 22, 0.5)' : `${d.color}88`)}
          ringMaxRadius={3.2}
          ringPropagationSpeed={1.4}
          ringRepeatPeriod={1400}
        />
      )}

      <GlobeTooltip ref={tooltipRef} country={hovered} />
      <GlobeLegend />
    </div>
  );
}
