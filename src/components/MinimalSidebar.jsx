'use client';

import React, { useState } from 'react';
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
  ShieldCheck,
  LogOut,
  TrendingUp,
  DollarSign,
  Search,
  BookOpen
} from 'lucide-react';

export default function MinimalSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Market Intelligence', icon: Globe2 },
    { id: 'opportunities', label: 'Import Opportunity', icon: Sparkles, badge: 'Hot' },
    { id: 'export_opp', label: 'Export Opportunity', icon: TrendingUp },
    { id: 'transactions', label: 'HS Code Explorer', icon: Search },
    { id: 'analytics', label: 'Trade Analytics', icon: LineChart },
    { id: 'network', label: 'Buyers & Suppliers', icon: Users },
    { id: 'price_intel', label: 'Price Intelligence', icon: DollarSign },
    { id: 'reports', label: 'Reports & Searches', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      backgroundColor: '#070b14',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 16px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
      color: '#ffffff'
    }}>
      {/* Brand Header like PortsAI */}
      <div 
        onClick={() => setActiveTab('dashboard')} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '32px',
          paddingLeft: '8px',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #0066FF 0%, #0044CC 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          boxShadow: '0 4px 12px rgba(0, 102, 255, 0.4)'
        }}>
          <Globe2 size={20} />
        </div>
        <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
          Ports<span style={{ color: '#0066FF' }}>AI</span>
        </div>
      </div>

      {/* Nav List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%',
        flex: 1,
        overflowY: 'auto'
      }}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id || (item.id === 'opportunities' && activeTab === 'opportunities') || (item.id === 'transactions' && activeTab === 'transactions');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id === 'export_opp' || item.id === 'price_intel' || item.id === 'reports' ? 'opportunities' : item.id)}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? '#0066FF' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 12px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
            >
              <IconComponent size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div style={{
        borderTop: '1px solid #1e293b',
        paddingTop: '16px',
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: '#0f172a'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#0066FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '13px'
          }}>
            AV
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Alexander Vance
            </div>
            <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>
              Verified MSME
            </div>
          </div>
        </div>

        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <LogOut size={14} /> Log out
        </button>
      </div>
    </aside>
  );
}
