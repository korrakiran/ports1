'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  MessageSquare, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { MOCK_KPIS, MOCK_MARKETS, MOCK_OPPORTUNITIES, MOCK_TRANSACTIONS } from '../mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardView({ onNavigate, onExpressInterest }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const miniTrendData = [
    { name: 'Mon', volume: 120 },
    { name: 'Tue', volume: 180 },
    { name: 'Wed', volume: 240 },
    { name: 'Thu', volume: 310 },
    { name: 'Fri', volume: 290 },
    { name: 'Sat', volume: 380 },
    { name: 'Sun', volume: 450 }
  ];

  return (
    <div className="view-container">
      
      {/* Welcome Banner / Hero Bar */}
      <div className="hero-banner" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '24px 32px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-blue" style={{ fontSize: '11px' }}>
              <Sparkles size={12} /> AI Trade Intelligence Engine Active
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              CEPA & AI-ECTA Tax Benefit Activated
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Good afternoon, Vance Agro & Tech 🇮🇳
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '600px' }}>
            Your export readiness score is <strong style={{ color: '#10b981' }}>94/100</strong>. We found <strong>24 new high-margin opportunities</strong> matching your HS Code portfolio in Germany & UAE.
          </p>
        </div>

        <div className="hero-banner-buttons" style={{ display: 'flex', gap: '12px', zIndex: 2, flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('intelligence')}
            className="btn btn-primary" 
            style={{ padding: '10px 18px', fontSize: '14px' }}
          >
            <Globe2 size={16} /> Explore Demand Hotspots
          </button>
          <button 
            onClick={() => onNavigate('opportunities')}
            className="btn btn-secondary" 
            style={{ padding: '10px 18px', fontSize: '14px' }}
          >
            Find Matching Buyers
          </button>
        </div>
      </div>

      {/* KPI Cards (4 grid) */}
      <div className="grid-4">
        
        {/* Active Listings */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Active Listings</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} />
            </div>
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)' }}>{MOCK_KPIS.activeListings}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
              <ArrowUpRight size={14} /> {MOCK_KPIS.activeListingsTrend}
            </div>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Pipeline Value</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)' }}>{MOCK_KPIS.pipelineValue}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
              <ArrowUpRight size={14} /> {MOCK_KPIS.pipelineValueTrend}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Buyer Messages</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} />
            </div>
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)' }}>{MOCK_KPIS.unreadMessages}</span>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {MOCK_KPIS.unreadMessagesDetail}
            </div>
          </div>
        </div>

        {/* Opportunities Found */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>AI Matched Opportunities</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3e8ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)' }}>{MOCK_KPIS.opportunitiesFound}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
              <ArrowUpRight size={14} /> {MOCK_KPIS.oppTrend}
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: 2 Columns (Opportunities & Pipeline on left, Market Trends on right on desktop; stacked on mobile) */}
      <div className="grid-main-side">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Recent Opportunities */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>High Match Buyer Enquiries</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified global importers seeking MSME suppliers</p>
              </div>
              <button 
                onClick={() => onNavigate('opportunities')}
                className="btn btn-ghost" 
                style={{ fontSize: '13px', color: 'var(--accent-blue)' }}
              >
                View All Opportunities <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MOCK_OPPORTUNITIES.slice(0, 3).map((opp) => (
                <div 
                  key={opp.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--accent-blue-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {opp.flag}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {opp.title}
                        </span>
                        <span className="badge badge-emerald">
                          {opp.matchingRate} Match
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>HS: <strong>{opp.hsCode}</strong></span>
                        <span>•</span>
                        <span>Buyer: <strong>{opp.importerName}</strong></span>
                        <span>•</span>
                        <span>Est. Margin: <strong style={{ color: '#10b981' }}>{opp.estimatedMargin}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{opp.targetPrice}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opp.volumeRequired}</div>
                    </div>
                    <button 
                      onClick={() => onExpressInterest(opp)}
                      className="btn btn-primary" 
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      Express Interest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Orders / Transactions Pipeline */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Active Transaction Pipeline</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Live track shipments, customs, & escrow payments</p>
              </div>
              <button 
                onClick={() => onNavigate('transactions')}
                className="btn btn-ghost" 
                style={{ fontSize: '13px', color: 'var(--accent-blue)' }}
              >
                Open Order Pipeline <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MOCK_TRANSACTIONS.slice(0, 2).map((trx) => (
                <div 
                  key={trx.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                        {trx.id}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{trx.product}</span>
                    </div>
                    <span className="badge badge-amber">{trx.status}</span>
                  </div>

                  {/* Step Progress bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(trx.step / trx.totalSteps) * 100}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-blue)',
                      borderRadius: '3px'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Partner: <strong>{trx.partner}</strong></span>
                    <span>Value: <strong>{trx.value}</strong></span>
                    <span>ETA: <strong>{trx.eta}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Market Trends & Heatmap Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Mini Market Trend Chart */}
          <div className="card">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Global Demand Surge</h2>
                <span className="badge badge-blue">Real-time</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weekly trade volume growth (+34%)</p>
            </div>

            <div style={{ height: '160px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniTrendData}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="volume" stroke="#0066FF" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Destination Markets Widget */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Top Export Markets</h2>
              <button 
                onClick={() => onNavigate('intelligence')}
                style={{ fontSize: '12px', color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                View Map
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MOCK_MARKETS.slice(0, 4).map((m) => (
                <div 
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-card-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{m.flag}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{m.country}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>{m.yoyGrowth}</span>
                    <span className="badge badge-blue" style={{ fontSize: '10px' }}>{m.demandLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Readiness & Compliance Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #e6f0ff 0%, #ecfdf5 100%)',
            border: '1px solid #bfdbfe',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <CheckCircle2 color="#0066FF" size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                MSME Tariff Advantage Active
              </h3>
              <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                Your business is eligible for 0% preferential tariffs in UAE & Australia under bilateral treaties.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
