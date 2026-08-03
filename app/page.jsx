'use client';

import React, { useState } from 'react';
import MinimalSidebar from '@/components/MinimalSidebar';
import TopHeader from '@/components/TopHeader';
import DashboardView from '@/components/DashboardView';
import MarketIntelligenceView from '@/components/MarketIntelligenceView';
import OpportunitiesView from '@/components/OpportunitiesView';
import TransactionsView from '@/components/TransactionsView';
import NetworkView from '@/components/NetworkView';
import AnalyticsView from '@/components/AnalyticsView';
import SettingsView from '@/components/SettingsView';
import { ExpressInterestModal, SlideInChat } from '@/components/Modals';

export default function MainPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOppForModal, setSelectedOppForModal] = useState(null);
  const [activeChatProfile, setActiveChatProfile] = useState(null);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            onNavigate={setActiveTab} 
            onExpressInterest={(opp) => setSelectedOppForModal(opp)} 
          />
        );
      case 'intelligence':
        return (
          <MarketIntelligenceView 
            onExpressInterest={(opp) => setSelectedOppForModal(opp)} 
          />
        );
      case 'opportunities':
        return (
          <OpportunitiesView 
            onExpressInterest={(opp) => setSelectedOppForModal(opp)} 
          />
        );
      case 'transactions':
        return <TransactionsView />;
      case 'network':
        return (
          <NetworkView 
            onOpenChat={(profile) => setActiveChatProfile(profile)} 
          />
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={setActiveTab} onExpressInterest={(opp) => setSelectedOppForModal(opp)} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* Minimal Sidebar (Icon-only 5-7 options) */}
      <MinimalSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Navigation */}
        <TopHeader 
          activeTab={activeTab} 
          onOpenNewDealModal={() => setSelectedOppForModal({
            title: "New Custom Export Listing",
            importerName: "Global Trade Network",
            targetPrice: "Market FOB",
            volumeRequired: "Flexible",
            destination: "Global",
            flag: "🌐"
          })} 
        />

        {/* Dynamic Page View */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Floating Drawers */}
      {selectedOppForModal && (
        <ExpressInterestModal 
          opportunity={selectedOppForModal} 
          onClose={() => setSelectedOppForModal(null)} 
        />
      )}

      {activeChatProfile && (
        <SlideInChat 
          profile={activeChatProfile} 
          onClose={() => setActiveChatProfile(null)} 
        />
      )}
    </div>
  );
}
