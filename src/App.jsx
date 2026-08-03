import React, { useState } from 'react';
import MinimalSidebar from './components/MinimalSidebar';
import TopHeader from './components/TopHeader';
import DashboardView from './components/DashboardView';
import MarketIntelligenceView from './components/MarketIntelligenceView';
import OpportunitiesView from './components/OpportunitiesView';
import TransactionsView from './components/TransactionsView';
import NetworkView from './components/NetworkView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import { ExpressInterestModal, SlideInChat } from './components/Modals';
import { LayoutDashboard, Globe2, Sparkles, Users, Settings } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOppForModal, setSelectedOppForModal] = useState(null);
  const [activeChatProfile, setActiveChatProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Intel', icon: Globe2 },
    { id: 'opportunities', label: 'Deals', icon: Sparkles },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* 1. Minimal Sidebar (Desktop sticky & Mobile drawer) */}
      <MinimalSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* 2. Top Header Navigation */}
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
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* 3. Dynamic Page View */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        {mobileNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
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

      {/* Modals & Floating Slide-in Drawers */}
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
