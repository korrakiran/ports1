'use client';

import dynamic from 'next/dynamic';

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
  if (typeof window === 'undefined') return <div style={{ height: '100%', width: '100%', backgroundColor: '#f1f5f9' }} />;

  return (
    <MapContainer 
      center={[20.0, 10.0]} 
      zoom={2} 
      scrollWheelZoom={false} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            <div style={{ padding: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px' }}>{m.flag} <strong>{m.country}</strong></div>
              <div style={{ fontSize: '12px', color: '#0066FF', fontWeight: 700, marginTop: '2px' }}>
                Demand Score: {m.demandScore}/100
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Tariff Rate: {m.tariffRate}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
