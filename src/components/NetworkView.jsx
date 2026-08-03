'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Building2, 
  Globe2, 
  Award, 
  CheckCircle,
  ExternalLink,
  Search
} from 'lucide-react';
import { MOCK_NETWORK } from '../mockData';

export default function NetworkView({ onOpenChat }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNetwork = MOCK_NETWORK.filter(net => 
    net.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    net.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Search Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Verified Global Trade Network</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Directly message background-checked importers, distributors, & retailers</p>
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
          <input 
            type="text" 
            placeholder="Search importer, country, or cert..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              paddingLeft: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Network Profiles Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {filteredNetwork.map((profile) => (
          <div className="card" key={profile.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '32px' }}>{profile.flag}</span>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {profile.name}
                    <ShieldCheck size={16} color="#0066FF" title="Gold Verified" />
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{profile.type} • {profile.country}</span>
                </div>
              </div>
            </div>

            {/* Ratings & Completed Deals */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', backgroundColor: 'var(--bg-card-subtle)', padding: '10px', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trust Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" /> {profile.trustRating} / 5.0
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Completed Orders</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', color: 'var(--text-main)' }}>
                  {profile.completedDeals} Deals
                </div>
              </div>
            </div>

            {/* Certifications Badge */}
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Verified Certifications:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profile.certifications.map((cert, i) => (
                  <span key={i} className="badge badge-blue" style={{ fontSize: '11px' }}>
                    <Award size={12} /> {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Person & Direct Message */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>{profile.contactPerson}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Resp. Rate: {profile.responseRate}</div>
              </div>

              <button 
                onClick={() => onOpenChat(profile)}
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <MessageSquare size={14} /> Message
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
