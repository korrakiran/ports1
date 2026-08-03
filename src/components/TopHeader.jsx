'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  FileCheck,
  Globe,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { CURRENT_USER } from '../mockData';

export default function TopHeader({ activeTab, onOpenNewDealModal }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'intelligence': return 'Market Intelligence & Global Demand';
      case 'opportunities': return 'AI Smart Match Opportunities';
      case 'transactions': return 'Orders & Transaction Pipeline';
      case 'network': return 'Global Verified Importers & Exporters';
      case 'analytics': return 'MSME Growth & Financial Intelligence';
      case 'settings': return 'Account Settings & Trade Preferences';
      default: return 'Overview';
    }
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-dark-header)',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--border-dark)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left Branding & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            GLOBAL<span style={{ color: 'var(--accent-blue)' }}>TRADE</span>
          </span>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: 700, 
            backgroundColor: 'rgba(0, 102, 255, 0.2)', 
            color: '#60a5fa', 
            padding: '2px 6px', 
            borderRadius: '4px',
            textTransform: 'uppercase' 
          }}>
            MSME PRO
          </span>
        </div>

        <span style={{ color: '#475569', fontSize: '14px' }}>/</span>

        <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>
          {getBreadcrumb()}
        </span>
      </div>

      {/* Global Search Bar */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#64748b'
        }} size={16} />
        <input 
          type="text" 
          placeholder="Search HS Code (e.g. 0908.31), product, or target country..." 
          style={{
            width: '100%',
            height: '38px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            paddingLeft: '36px',
            paddingRight: '60px',
            color: '#ffffff',
            fontSize: '13px',
            outline: 'none',
            transition: 'var(--transition)'
          }}
        />
        <div style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          gap: '4px'
        }}>
          <kbd style={{
            backgroundColor: '#0f172a',
            color: '#94a3b8',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #334155'
          }}>⌘K</kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onOpenNewDealModal}
          className="btn btn-primary"
          style={{ height: '36px', fontSize: '13px', padding: '0 14px' }}
        >
          <Plus size={16} />
          Create Trade Listing
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '46px',
              width: '320px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              padding: '12px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>Trade Alerts</span>
                <span style={{ fontSize: '11px', color: 'var(--accent-blue)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', padding: '8px', backgroundColor: '#0f172a', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: '#60a5fa' }}>Customs Approved #TRX-44910</div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>BioHerb Germany confirmed customs release.</div>
                </div>
                <div style={{ fontSize: '12px', padding: '8px', backgroundColor: '#0f172a', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: '#10b981' }}>New High Intent Inquiry</div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>Al-Maktoum UAE submitted target pricing proposal.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingLeft: '12px',
          borderLeft: '1px solid #334155',
          cursor: 'pointer'
        }}>
          <img 
            src={CURRENT_USER.avatar} 
            alt="User" 
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-blue)' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
              {CURRENT_USER.name} {CURRENT_USER.flag}
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {CURRENT_USER.company}
            </span>
          </div>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
      </div>
    </header>
  );
}
