'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Globe2, 
  Sparkles, 
  FileCheck, 
  Users, 
  LineChart, 
  Settings, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function MinimalSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Market Intelligence', icon: Globe2 },
    { id: 'opportunities', label: 'My Opportunities', icon: Sparkles, badge: 'New' },
    { id: 'transactions', label: 'Orders & Pipeline', icon: FileCheck },
    { id: 'network', label: 'Network & Buyers', icon: Users },
    { id: 'analytics', label: 'Business Analytics', icon: LineChart },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  return (
    <aside style={{
      width: '72px',
      height: '100vh',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-dark)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0
    }}>
      {/* Brand Icon */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        marginBottom: '28px',
        boxShadow: '0 4px 14px rgba(0, 102, 255, 0.4)',
        cursor: 'pointer'
      }} onClick={() => setActiveTab('dashboard')} title="MSME Global Trade Platform">
        <Globe2 size={24} strokeWidth={2.2} />
      </div>

      {/* Nav Icons list */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        alignItems: 'center',
        flex: 1
      }}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div 
              key={item.id} 
              style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <button
                onClick={() => setActiveTab(item.id)}
                className="sidebar-btn"
                title={item.label}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--accent-blue)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <IconComponent size={20} strokeWidth={isActive ? 2.3 : 1.8} />
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '2px solid var(--bg-sidebar)'
                  }} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Status Badge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        paddingBottom: '8px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10b981',
          cursor: 'pointer'
        }} title="Gold Verified Exporter MSME">
          <ShieldCheck size={20} />
        </div>
      </div>
    </aside>
  );
}
