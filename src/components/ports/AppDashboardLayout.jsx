'use client';

import React, { useState } from 'react';
import MinimalSidebar from '../MinimalSidebar';
import TopHeader from '../TopHeader';
import DashboardView from '../DashboardView';
import MarketIntelligenceView from '../MarketIntelligenceView';
import OpportunitiesView from '../OpportunitiesView';
import TransactionsView from '../TransactionsView';
import NetworkView from '../NetworkView';
import AnalyticsView from '../AnalyticsView';
import SettingsView from '../SettingsView';
import { PriceIntelligenceView, ReportsView } from '../AdditionalViews';
import { LayoutDashboard, Globe2, Sparkles, Users, Settings } from 'lucide-react';

export default function AppDashboardLayout({ activeTab, setActiveTab, onGoToLanding, user, onSignOut }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveTab} onExpressInterest={() => setActiveTab('import_opp')} />;
      case 'intelligence':
        return <MarketIntelligenceView onExpressInterest={() => setActiveTab('import_opp')} />;
      case 'import_opp':
      case 'opportunities':
        return <OpportunitiesView onExpressInterest={() => setActiveTab('import_opp')} />;
      case 'export_opp':
        return <OpportunitiesView onExpressInterest={() => setActiveTab('import_opp')} />;
      case 'transactions':
        return <TransactionsView />;
      case 'network':
        return <NetworkView onOpenChat={() => {}} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'price_intel':
        return <PriceIntelligenceView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView user={user} />;
      default:
        return <OpportunitiesView onExpressInterest={() => setActiveTab('import_opp')} />;
    }
  };

  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Intel', icon: Globe2 },
    { id: 'opportunities', label: 'Deals', icon: Sparkles },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Dark Navigation Sidebar (Desktop & Mobile Drawer) */}
      <MinimalSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <TopHeader 
          activeTab={activeTab} 
          onOpenNewDealModal={() => setActiveTab('import_opp')} 
          user={user}
          onSignOut={onSignOut}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Active Screen View */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        {mobileNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'opportunities' && (activeTab === 'import_opp' || activeTab === 'export_opp'));
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id === 'opportunities' ? 'import_opp' : item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
