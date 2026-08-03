'use client';

import React from 'react';
import { 
  Globe2, 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { MOCK_MARKETS, DEMAND_TREND_CHART } from '../mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DynamicMap from './DynamicMap';

export default function MarketIntelligenceView({ onExpressInterest }) {
  const [selectedMarket, setSelectedMarket] = useState(MOCK_MARKETS[0]);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMarkets = MOCK_MARKETS.filter(m => 
    m.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.topImports.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Sticky Smart Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
            <input 
              type="text" 
              placeholder="Search country or product..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                paddingLeft: '36px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {['All Categories', 'Agriculture', 'Renewables', 'Textiles', 'Engineering'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: activeCategory === cat ? 'var(--accent-blue)' : 'var(--border-color)',
                backgroundColor: activeCategory === cat ? 'var(--accent-blue-light)' : 'transparent',
                color: activeCategory === cat ? 'var(--accent-blue)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ height: '36px', fontSize: '13px' }}>
            <SlidersHorizontal size={14} /> Advanced Filters
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Country Deep-Dive */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Global Interactive Heatmap */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '480px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Global Market Demand Hotspots</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click country node to inspect tariffs & import volume</p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="badge badge-emerald">High Growth</span>
              <span className="badge badge-blue">Low Tariff</span>
            </div>
          </div>

          {/* Leaflet Map */}
          <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', zIndex: 1 }}>
            <DynamicMap 
              markets={filteredMarkets} 
              selectedMarket={selectedMarket} 
              onSelectMarket={setSelectedMarket} 
            />
          </div>
        </div>

        {/* Selected Country Deep-Dive Drawer / Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#ffffff' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{selectedMarket.flag}</span>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {selectedMarket.country}
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Regional Trade Zone Code: <strong>{selectedMarket.code}</strong>
                </span>
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '12px', padding: '4px 10px' }}>
              Demand Score: {selectedMarket.demandScore}
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Annual Import Size</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                {selectedMarket.marketSize}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Effective Tariff Rate</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '2px' }}>
                {selectedMarket.tariffRate}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Maritime Transit</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                {selectedMarket.avgShippingDays} Days
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>YoY Growth Rate</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                {selectedMarket.yoyGrowth}
              </div>
            </div>
          </div>

          {/* Top High Demand Products */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              Top High Demand Commodities
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedMarket.topImports.map((item, idx) => (
                <span 
                  key={idx}
                  style={{
                    backgroundColor: 'var(--accent-blue-light)',
                    color: 'var(--accent-blue)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => onExpressInterest({ destination: selectedMarket.country, title: `Direct Trade Inquiry for ${selectedMarket.country}` })}
              className="btn btn-primary" 
              style={{ flex: 1, padding: '10px' }}
            >
              <Zap size={16} /> Contact Verified Importers in {selectedMarket.country}
            </button>
          </div>

        </div>

      </div>

      {/* Demand Forecasting & Trend Chart */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>6-Month Demand Forecasting (Commodity Wise)</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Machine learning predicted import trajectory based on global sea freight customs data</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0066FF' }} /> Spices & Agro
            </span>
            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} /> CleanTech
            </span>
            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} /> Textiles
            </span>
          </div>
        </div>

        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DEMAND_TREND_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }} />
              <Area type="monotone" dataKey="Spices" stroke="#0066FF" fill="#0066FF" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="CleanTech" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="Textiles" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
