'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports to prevent SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);

export default function DynamicMap({ markets, selectedMarket, onSelectMarket }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%', 
        backgroundColor: '#0f172a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: '13px' 
      }}>
        Loading Interactive World Map...
      </div>
    );
  }

  return (
    <MapContainer 
      center={[20.0, 10.0]} 
      zoom={2} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', background: '#0b0f19' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {markets.map((m) => (
        <Marker 
          key={m.id} 
          position={[m.lat, m.lng]}
          eventHandlers={{
            click: () => onSelectMarket(m)
          }}
        >
          <Popup>
            <div style={{ padding: '4px', textAlign: 'center', fontFamily: 'inherit' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>{m.flag}</span> <span>{m.country}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#0066FF', fontWeight: 800, marginTop: '4px' }}>
                Demand Index: {m.demandScore}/100
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                FTA Tariff: <strong>{m.tariffRate}</strong>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
