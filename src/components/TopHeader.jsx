'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Plus, 
  Check, 
  X, 
  ShieldCheck, 
  LogOut,
  SlidersHorizontal,
  Globe2,
  FileCheck
} from 'lucide-react';
import { CURRENT_USER } from '../mockData';

export default function TopHeader({ activeTab, onOpenNewDealModal, user, onSignOut }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Customs Approved #TRX-44910', text: 'BioHerb Germany confirmed customs release.', read: false },
    { id: 2, title: 'New High Intent Inquiry', text: 'Al-Maktoum UAE submitted pricing proposal.', read: false }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'intelligence': return 'Market Intelligence & Global Demand';
      case 'import_opp':
      case 'opportunities': return 'Import Opportunity Wizard';
      case 'export_opp': return 'Export Opportunity Engine';
      case 'transactions': return 'HS Code Explorer & Orders';
      case 'analytics': return 'Trade Analytics';
      case 'network': return 'Buyers & Suppliers Directory';
      case 'price_intel': return 'Price Intelligence';
      case 'reports': return 'Reports & Saved Searches';
      case 'settings': return 'Settings & Account';
      default: return 'Overview';
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      setSearchResults([
        { type: 'HS Code', title: '8518.30 - Wireless Earbuds & Headphones' },
        { type: 'Market', title: 'Germany 🇩🇪 (Demand Score: 94/100)' },
        { type: 'Opportunity', title: 'Organic Cardamom Bulk Supply (Germany)' }
      ]);
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left Branding & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
          {getBreadcrumb()}
        </span>
      </div>

      {/* Global Autocomplete Search Bar */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#94a3b8'
        }} size={16} />
        <input 
          type="text" 
          placeholder="Search HS Code (e.g. 8518.30), product, or target market..." 
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.length > 1 && setShowSearchDropdown(true)}
          style={{
            width: '100%',
            height: '38px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            paddingLeft: '36px',
            paddingRight: '60px',
            color: '#0f172a',
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
            backgroundColor: '#ffffff',
            color: '#64748b',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0'
          }}>⌘K</kbd>
        </div>

        {/* Dropdown Results */}
        {showSearchDropdown && (
          <div style={{
            position: 'absolute',
            top: '44px',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            padding: '8px 0',
            zIndex: 100
          }}>
            {searchResults.map((res, i) => (
              <div 
                key={i}
                onClick={() => setShowSearchDropdown(false)}
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: i < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}
              >
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{res.title}</span>
                <span style={{ fontSize: '10px', backgroundColor: '#e6f0ff', color: '#0066FF', padding: '2px 6px', borderRadius: '4px' }}>
                  {res.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button 
          onClick={onOpenNewDealModal}
          className="btn btn-primary"
          style={{ height: '36px', fontSize: '13px', padding: '0 14px' }}
        >
          <Plus size={16} />
          Create Listing
        </button>

        {/* Notifications Slide-out Drawer */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {notifications.some(n => !n.read) && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444'
              }} />
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '46px',
              width: '320px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              padding: '14px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>Trade Notifications</span>
                <span 
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                  style={{ fontSize: '11px', color: '#0066FF', cursor: 'pointer', fontWeight: 600 }}
                >
                  Clear All
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ fontSize: '12px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, color: '#0066FF' }}>{n.title}</div>
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{n.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingLeft: '12px',
          borderLeft: '1px solid #e2e8f0'
        }}>
          <img 
            src={CURRENT_USER.avatar} 
            alt="User" 
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #0066FF' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
              {user ? user.email.split('@')[0] : CURRENT_USER.name}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              {CURRENT_USER.company}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
