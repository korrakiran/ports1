'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  Globe, 
  Key, 
  FileText, 
  Save, 
  Check,
  Award,
  CreditCard
} from 'lucide-react';
import { CURRENT_USER } from '../mockData';

export default function SettingsView() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="view-container" style={{ maxWidth: '900px' }}>
      
      <div className="card">
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px', overflowX: 'auto' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'profile' ? 'var(--accent-blue-light)' : 'transparent',
              color: activeTab === 'profile' ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Business Profile & Certifications
          </button>
          <button 
            onClick={() => setActiveTab('hs')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'hs' ? 'var(--accent-blue-light)' : 'transparent',
              color: activeTab === 'hs' ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            HS Code & Tariff Match Preferences
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'api' ? 'var(--accent-blue-light)' : 'transparent',
              color: activeTab === 'api' ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Customs & Logistics API Keys
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Company Name
              </label>
              <input 
                type="text" 
                defaultValue={CURRENT_USER.company} 
                style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }} 
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Primary Country of Operation
              </label>
              <input 
                type="text" 
                defaultValue={`${CURRENT_USER.country} ${CURRENT_USER.flag}`} 
                style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }} 
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Primary Export Commodity HS Code
              </label>
              <input 
                type="text" 
                defaultValue="0908.31 (Organic Spices & Pepper)" 
                style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }} 
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                MSME Registration / IEC Number
              </label>
              <input 
                type="text" 
                defaultValue="IEC-991204128X" 
                style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }} 
              />
            </div>
          </div>

          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="submit" style={{ padding: '8px 20px' }}>
              {saved ? <><Check size={16} /> Preferences Saved!</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
