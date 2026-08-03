'use client';

import React from 'react';
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

export default function AppDashboardLayout({ activeTab, setActiveTab, onGoToLanding, user, onSignOut }) {
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Dark Navigation Sidebar */}
      <MinimalSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <TopHeader 
          activeTab={activeTab} 
          onOpenNewDealModal={() => setActiveTab('import_opp')} 
          user={user}
          onSignOut={onSignOut}
        />

        {/* Active Screen View */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
