'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  ArrowUpDown, 
  Sparkles, 
  Zap, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { MOCK_OPPORTUNITIES } from '../mockData';

export default function OpportunitiesView({ onExpressInterest }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [sortBy, setSortBy] = useState('score');

  const filteredOpportunities = MOCK_OPPORTUNITIES.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.hsCode.includes(searchTerm) ||
                          opp.importerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDest = selectedDestination === 'All' || opp.destination === selectedDestination;
    return matchesSearch && matchesDest;
  }).sort((a, b) => {
    if (sortBy === 'score') return b.opportunityScore - a.opportunityScore;
    if (sortBy === 'margin') return parseInt(b.estimatedMargin) - parseInt(a.estimatedMargin);
    return 0;
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Search & Sort Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
          <input 
            type="text" 
            placeholder="Filter by title, HS Code (e.g. 0908.31), or verified importer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              paddingLeft: '38px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            value={selectedDestination} 
            onChange={(e) => setSelectedDestination(e.target.value)}
            style={{
              height: '40px',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              backgroundColor: '#fff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Destinations</option>
            <option value="Germany">Germany 🇩🇪</option>
            <option value="United Arab Emirates">UAE 🇦🇪</option>
            <option value="United States">USA 🇺🇸</option>
            <option value="Australia">Australia 🇦🇺</option>
            <option value="Japan">Japan 🇯🇵</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              height: '40px',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              backgroundColor: '#fff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="score">Sort by AI Match Score</option>
            <option value="margin">Sort by Profit Margin</option>
          </select>
        </div>

      </div>

      {/* Opportunities List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Opportunity & Commodity</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Importer & Country</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Volume Needed</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Target Price</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Est. Margin</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>AI Match Score</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOpportunities.map((opp) => (
              <tr 
                key={opp.id}
                style={{ 
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'var(--transition)'
                }}
              >
                {/* Title & HS Code */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
                    {opp.title}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-blue)', backgroundColor: 'var(--accent-blue-light)', padding: '1px 6px', borderRadius: '4px' }}>
                      HS {opp.hsCode}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opp.category}</span>
                  </div>
                </td>

                {/* Importer */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{opp.flag}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {opp.importerName}
                        {opp.verified && <ShieldCheck size={14} color="#0066FF" title="Verified Gold Buyer" />}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opp.destination}</div>
                    </div>
                  </div>
                </td>

                {/* Volume */}
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {opp.volumeRequired}
                </td>

                {/* Target Price */}
                <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {opp.targetPrice}
                </td>

                {/* Est. Margin */}
                <td style={{ padding: '16px 20px' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '12px' }}>
                    +{opp.estimatedMargin}
                  </span>
                </td>

                {/* AI Score */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #e6f0ff 0%, #ecfdf5 100%)',
                      border: '2px solid var(--accent-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: 'var(--accent-blue)',
                      fontSize: '12px'
                    }}>
                      {opp.opportunityScore}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opp.deadline}</span>
                  </div>
                </td>

                {/* Action */}
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button 
                    onClick={() => onExpressInterest(opp)}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    <Zap size={14} /> Express Interest
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
