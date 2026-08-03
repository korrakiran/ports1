'use client';

import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  ExternalLink,
  Download,
  Filter,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { MOCK_MARKETS } from '../mockData';

export function PriceIntelligenceView() {
  const [selectedCommodity, setSelectedCommodity] = useState('Wireless Earbuds');

  const benchmarkPrices = [
    { market: 'Germany 🇩🇪', low: '$14.20', avg: '$18.50', high: '$22.00', margin: '+34%', trend: 'Upward' },
    { market: 'United Arab Emirates 🇦🇪', low: '$16.00', avg: '$19.80', high: '$24.50', margin: '+28%', trend: 'Stable' },
    { market: 'United States 🇺🇸', low: '$12.50', avg: '$17.10', high: '$21.00', margin: '+41%', trend: 'Upward' },
    { market: 'Japan 🇯🇵', low: '$15.80', avg: '$20.20', high: '$25.00', margin: '+25%', trend: 'Upward' },
    { market: 'Australia 🇦🇺', low: '$13.90', avg: '$18.00', high: '$22.40', margin: '+30%', trend: 'Stable' }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Global Price Intelligence Benchmark</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Real-time price ranges by target market & HS Code</p>
        </div>
        <select 
          value={selectedCommodity} 
          onChange={(e) => setSelectedCommodity(e.target.value)}
          style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', backgroundColor: '#ffffff' }}
        >
          <option value="Wireless Earbuds">Wireless Earbuds (HS: 8518.30)</option>
          <option value="Organic Cardamom">Organic Cardamom (HS: 0908.31)</option>
          <option value="Solar Inverters">Solar Inverters (HS: 8504.40)</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Target Market</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Low Range</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>FOB Benchmark Avg</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>High Range</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Est. Profit Margin</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Price Trajectory</th>
            </tr>
          </thead>
          <tbody>
            {benchmarkPrices.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{item.market}</td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.low}</td>
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0066FF' }}>{item.avg}</td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.high}</td>
                <td style={{ padding: '14px 16px' }}><span className="badge badge-emerald">{item.margin}</span></td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#10b981' }}>{item.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ReportsView() {
  const [downloading, setDownloading] = useState(false);

  const handleExport = (format) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Exported report successfully as ${format}!`);
    }, 1000);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Trade Reports & Saved Searches</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Export customs intelligence, tariffs, & target buyer dossiers</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleExport('CSV')} className="btn btn-secondary" style={{ fontSize: '13px' }}>
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => handleExport('PDF')} className="btn btn-primary" style={{ fontSize: '13px' }}>
            <Download size={14} /> Download PDF Dossier
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Saved Search Queries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>HS 8518.30 - Wireless Earbuds (Germany & UAE)</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Saved 2 days ago • 14 Matching Importers</div>
              </div>
              <button className="btn btn-ghost" style={{ fontSize: '12px', color: '#0066FF' }}>Run</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Recent Trade Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>EU Tariff & CEPA Duty Exemption Audit 2026</div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Verified Compliant</div>
              </div>
              <button onClick={() => handleExport('PDF')} className="btn btn-ghost" style={{ fontSize: '12px', color: '#0066FF' }}>Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
