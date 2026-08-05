'use client';

import React from 'react';
import { 
  LineChart as ChartIcon, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Globe2, 
  Award,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function AnalyticsView() {
  const salesData = [
    { country: 'Germany', Sales: 620000, Margin: 34 },
    { country: 'UAE', Sales: 480000, Margin: 28 },
    { country: 'USA', Sales: 290000, Margin: 41 },
    { country: 'Australia', Sales: 180000, Margin: 30 },
    { country: 'Japan', Sales: 150000, Margin: 25 }
  ];

  return (
    <div className="view-container">
      
      {/* Top Intelligence Bar */}
      <div className="grid-3">
        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Export Revenue (YTD)</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>$1,720,000</div>
          <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <ArrowUpRight size={14} /> +24.8% vs Previous Year
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Average Gross Margin</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px', color: '#10b981' }}>32.4%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Top: USA Jute Bags (41% Margin)
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Export Readiness Score</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px', color: 'var(--accent-blue)' }}>94 / 100</div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
            Fully Compliant for EU & GCC Markets
          </div>
        </div>
      </div>

      {/* Main Bar Chart: Sales & Margin by Geography */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Geographic Revenue Breakdown (USD)</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Export sales volume per destination country</p>
          </div>
          <span className="badge badge-emerald">Audited Trade Data</span>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="country" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px' }} />
              <Bar dataKey="Sales" fill="#0066FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
