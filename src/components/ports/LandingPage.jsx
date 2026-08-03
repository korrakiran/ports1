'use client';

import React, { useState } from 'react';
import { 
  Globe2, 
  Search, 
  ChevronRight, 
  Check, 
  ArrowRight, 
  Sparkles, 
  LayoutDashboard, 
  LineChart, 
  Users, 
  TrendingUp, 
  DollarSign, 
  BookOpen, 
  Settings, 
  LogOut,
  Download,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Send,
  X,
  FileCheck,
  UploadCloud,
  Ship,
  Clock,
  Plus,
  Compass,
  Layers,
  CheckCircle2,
  Lock,
  Building,
  Package,
  Boxes,
  HelpCircle,
  Paperclip,
  Trash2,
  FileText,
  Calculator,
  RefreshCw,
  Coins,
  Bot,
  Zap,
  CheckCheck,
  Award,
  Globe,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  MOCK_MARKETS, 
  MOCK_OPPORTUNITIES, 
  MOCK_TRANSACTIONS, 
  MOCK_NETWORK, 
  DEMAND_TREND_CHART,
  TARGET_MARKETS_12,
  CURRENT_USER
} from '../../mockData';
import WorldHeroMap from '../WorldHeroMap';
import Interactive3DGlobe from '../Interactive3DGlobe';
import BorderBeam from '../ui/BorderBeam';
import NumberTicker from '../ui/NumberTicker';
import { AuditReportModal, CustomsDocModal } from '../ReportAndDocsModal';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function LandingPage({ onSignUp, onLogin }) {
  // Navigation tab for integrated workspace
  const [activeTab, setActiveTab] = useState('import_opp');

  // Multi-Currency State
  const [currency, setCurrency] = useState('USD');
  const CURRENCIES = {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    INR: { symbol: '₹', rate: 83.5 },
    AED: { symbol: 'AED ', rate: 3.67 }
  };

  const formatCurrency = (amountUsd) => {
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    const val = amountUsd * curr.rate;
    if (val >= 1000000) return `${curr.symbol}${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${curr.symbol}${(val / 1000).toFixed(1)}k`;
    return `${curr.symbol}${val.toFixed(2)}`;
  };

  // Hero View Mode: 3D Interactive WebGL Globe vs Vector Map
  const [mapMode, setMapMode] = useState('globe');

  // 4-Step Wizard State matching reference screens 3, 4, 5, 6
  const [wizardStep, setWizardStep] = useState(1);
  const [productName, setProductName] = useState('Wireless Earbuds');
  const [hsCode, setHsCode] = useState('8518.30');
  const [productCategory, setProductCategory] = useState('Electronics');
  const [importPurpose, setImportPurpose] = useState('resale');
  const [description, setDescription] = useState('High quality wireless earbuds with active noise cancellation');
  const [selectedProcess, setSelectedProcess] = useState('direct');
  const [selectedCountries, setSelectedCountries] = useState(['cn', 'de', 'us']);
  const [countrySearch, setCountrySearch] = useState('');

  // Step 1: Multi-file Upload State
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'earbuds_spec_sheet_v2.pdf', size: '1.4 MB', type: 'PDF Spec' },
    { name: 'cad_casing_model.step', size: '4.8 MB', type: 'CAD Model' }
  ]);

  // Step 2: Live Landed Cost Calculator State
  const [basePrice, setBasePrice] = useState(24.50);
  const [containerFreight, setContainerFreight] = useState(2850);
  const [tariffPct, setTariffPct] = useState(2.1);
  const [insurancePct, setInsurancePct] = useState(0.35);

  // Modals & Chat Drawer State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [selectedOppForModal, setSelectedOppForModal] = useState(null);
  const [activeChatProfile, setActiveChatProfile] = useState(null);
  const [quotePrice, setQuotePrice] = useState('$24.50 / unit');
  const [quoteQuantity, setQuoteQuantity] = useState('5,000 units');
  const [quoteNotes, setQuoteNotes] = useState('Includes CIF Hamburg packaging & CE compliance certs.');

  // Live listings state
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [selectedTrx, setSelectedTrx] = useState(MOCK_TRANSACTIONS[0]);
  
  // AI Trade Assistant & Chat State
  const [messages, setMessages] = useState([
    { sender: 'them', text: 'Hello! What is your FOB pricing for wireless earbuds bulk order?', time: '10:14 AM' },
    { sender: 'me', text: 'Hi! For 5,000+ units we offer $24.50/unit with CE & RoHS compliance.', time: '10:16 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [aiTip, setAiTip] = useState('AI Suggestion: Offer 3% volume discount on 10k units to seal contract faster.');

  // Filtering states
  const [oppSearch, setOppSearch] = useState('');
  const [oppDest, setOppDest] = useState('All');
  const [marketSearch, setMarketSearch] = useState('');

  const toggleCountry = (id) => {
    if (selectedCountries.includes(id)) {
      setSelectedCountries(selectedCountries.filter(c => c !== id));
    } else {
      setSelectedCountries([...selectedCountries, id]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles([
        ...uploadedFiles, 
        { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, type: 'Document' }
      ]);
    }
  };

  const removeFile = (idx) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([...messages, { sender: 'me', text: inputMsg, time: 'Just now' }]);
    setInputMsg('');
  };

  const handleCreateProposal = (e) => {
    e.preventDefault();
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    const newTrx = {
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      product: `${productName} (Bulk Order)`,
      partner: `${selectedOppForModal?.importerName || 'EuroTech Audio GmBH'} (${selectedOppForModal?.destination || 'Germany'})`,
      value: `$${(parseInt(quotePrice.replace(/\D/g, '')) || 25) * (parseInt(quoteQuantity.replace(/\D/g, '')) || 5000)}`,
      status: 'Contract Signing',
      step: 1,
      totalSteps: 5,
      eta: 'Sep 15, 2026',
      paymentStatus: 'Escrow Locked (100%)',
      hsCode: hsCode,
      carrier: 'Maersk Line Vessel #MSK-9921',
      docsReady: 1,
      docsTotal: 5
    };
    setTransactions([newTrx, ...transactions]);
    setSelectedTrx(newTrx);
    setSelectedOppForModal(null);
    setActiveTab('transactions');
  };

  const advanceMilestone = () => {
    if (selectedTrx.step < selectedTrx.totalSteps) {
      const nextStep = selectedTrx.step + 1;
      const updated = {
        ...selectedTrx,
        step: nextStep,
        status: nextStep === 2 ? 'Escrow Funded (30%)' : nextStep === 3 ? 'Maritime In Transit' : nextStep === 4 ? 'Customs Cleared' : 'Released & Settled',
        paymentStatus: nextStep >= 4 ? 'Escrow Settled (100%)' : 'Escrow Secured'
      };
      setSelectedTrx(updated);
      setTransactions(transactions.map(t => t.id === updated.id ? updated : t));
    }
  };

  const filteredTargetMarkets = TARGET_MARKETS_12.filter(m => 
    m.country.toLowerCase().includes(countrySearch.toLowerCase()) || 
    m.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Calculated Landed Cost Breakdown
  const dutyCostPerUnit = (basePrice * (tariffPct / 100));
  const freightPerUnit = (containerFreight / 10000);
  const insuranceCostPerUnit = (basePrice * (insurancePct / 100));
  const totalLandedCost = basePrice + dutyCostPerUnit + freightPerUnit + insuranceCostPerUnit;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fbfcfd', color: '#090d16', display: 'flex', flexDirection: 'column' }}>
      
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: '#070b14',
        color: '#94a3b8',
        padding: '8px 24px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        borderBottom: '1px solid #1e293b'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontWeight: 600 }}>
          <Sparkles size={13} color="#0066FF" /> PortsAI 3.0 Released:
        </span>
        <span>Real-time HS Code Tariff Radar & Automated Escrow Settlement Engine is now live.</span>
        <a href="#workspace" style={{ color: '#0066FF', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          Explore Demo &rarr;
        </a>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP NAVBAR (Matching MeridianTrade Screenshot) */}
      {/* ========================================================================= */}
      <header style={{
        height: '72px',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f1f5f9',
        backgroundColor: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.03em' }}>
            Meridian<span style={{ color: '#0066FF' }}>Trade</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '28px', fontSize: '14.5px', fontWeight: 500, color: '#475569' }}>
          <a href="#hero" style={{ textDecoration: 'none', color: '#090d16', fontWeight: 600 }}>Home</a>
          <a href="#workspace" onClick={() => setActiveTab('intelligence')} style={{ textDecoration: 'none', color: '#475569' }}>Market intelligence</a>
          <a href="#workspace" onClick={() => setActiveTab('import_opp')} style={{ textDecoration: 'none', color: '#475569' }}>Import</a>
          <a href="#workspace" onClick={() => setActiveTab('export_opp')} style={{ textDecoration: 'none', color: '#475569' }}>Export</a>
          <a href="#how-it-works" style={{ textDecoration: 'none', color: '#475569' }}>About</a>
        </nav>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onLogin}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              color: '#090d16',
              cursor: 'pointer'
            }}
          >
            Log in
          </button>
          <button 
            onClick={onSignUp}
            style={{
              padding: '8px 22px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0066FF',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 102, 255, 0.25)'
            }}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (Exact Match with Screenshot 2026-08-03 210354.png) */}
      {/* ========================================================================= */}
      <section id="hero" style={{
        padding: '48px 48px 60px',
        maxWidth: '1380px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '460px 1fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <h1 style={{ fontSize: '46px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.035em', color: '#090d16' }}>
            Export your product<br />
            worldwide.
          </h1>

          <p style={{ fontSize: '15px', color: '#475569', maxWidth: '420px', lineHeight: 1.6, fontWeight: 400, marginTop: '16px' }}>
            Click a photo of your product and tell us where you're based. We score every market for it, price the opportunity, and handle certification and registration.
          </p>

          <div style={{ fontSize: '13px', fontWeight: 700, color: '#090d16', marginTop: '24px', marginBottom: '12px' }}>
            Please log in to continue
          </div>

          {/* Social Sign-In Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '340px' }}>
            {/* Google Button */}
            <button
              onClick={onLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                height: '46px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#090d16',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>

            {/* Microsoft Button */}
            <button
              onClick={onLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                height: '46px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#090d16',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '10px' }}>
            This keeps your products, markets and filings connected.
          </div>

          {/* 3 Stats Cards matching Screenshot bottom-left */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '36px',
            maxWidth: '360px'
          }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 1px 4px rgba(15,23,42,0.02)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.03em' }}>
                <NumberTicker value={195} />
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>markets scored</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 1px 4px rgba(15,23,42,0.02)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.03em' }}>
                <NumberTicker value={18} suffix="k" />
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>verified buyers</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 1px 4px rgba(15,23,42,0.02)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.03em' }}>
                <NumberTicker value={4} prefix="2." suffix="M" />
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>trade records</div>
            </div>
          </div>
        </div>

        {/* Right Column: World Map matching Screenshot 2026-08-03 210354.png */}
        <div style={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#f3f6fb',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #e9f0f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0, 102, 255, 0.02)'
        }}>
          <WorldHeroMap />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE GLOBAL TRADE TICKER */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: '#070b14',
        color: '#ffffff',
        padding: '12px 0',
        overflow: 'hidden',
        borderTop: '1px solid #1e293b',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '48px',
          whiteSpace: 'nowrap',
          fontSize: '13px',
          fontWeight: 500,
          animation: 'floatSlow 20s linear infinite',
          paddingLeft: '56px'
        }}>
          <span>🚢 <strong>Shanghai &rarr; Hamburg:</strong> $2,850 / TEU <span style={{ color: '#10b981' }}>+2.1%</span></span>
          <span>⚡ <strong>HS 8518.30 (Earbuds):</strong> Global Demand Index: <strong>94.2 (High)</strong></span>
          <span>🇦🇪 <strong>Dubai Jebel Ali Port:</strong> Inbound Clearance: <strong>1.4 Days</strong></span>
          <span>🇺🇸 <strong>US West Coast Route:</strong> $3,420 / FEU <span style={{ color: '#10b981' }}>-1.8%</span></span>
          <span>🇩🇪 <strong>EU CE Compliance:</strong> 100% Pre-Validated Templates Active</span>
          <span>🌿 <strong>Solar Inverters (CleanTech):</strong> Demand Up <strong>+34.8% YoY</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTEGRATED WORKSPACE APP (Exact 4 Wizard Screens + Enterprise Modules) */}
      {/* ========================================================================= */}
      <section id="workspace" style={{
        padding: '50px 56px 90px 56px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '8px', fontSize: '12px', padding: '4px 14px', fontWeight: 700 }}>
              Live Interactive Trade Workspace
            </span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.03em' }}>
              Full PortsAI Trade Execution Engine
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', marginTop: '4px' }}>
              Select navigation items on the left or walk through the 4-step import opportunity wizard below.
            </p>
          </div>

          {/* Master Workspace Card Container */}
          <div style={{
            position: 'relative',
            display: 'flex',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            minHeight: '740px'
          }}>
            <BorderBeam size={280} duration={12} borderWidth={2} colorFrom="#0066FF" colorTo="#38bdf8" />
            {/* PortsAI Dark Navy Sidebar (#070b14 matching img.webp) */}
            <aside style={{
              width: '235px',
              backgroundColor: '#070b14',
              color: '#ffffff',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              flexShrink: 0
            }}>
              {/* Brand Logo inside sidebar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', paddingLeft: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
                  Ports<span style={{ color: '#0066FF' }}>AI</span>
                </span>
              </div>

              {/* Navigation Items */}
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'intelligence', label: 'Market Intelligence', icon: Globe2 },
                { id: 'import_opp', label: 'Import Opportunity', icon: Sparkles },
                { id: 'export_opp', label: 'Export Opportunity', icon: TrendingUp },
                { id: 'transactions', label: 'HS Code Explorer', icon: Search },
                { id: 'analytics', label: 'Trade Analytics', icon: LineChart },
                { id: 'network', label: 'Buyers & Suppliers', icon: Users },
                { id: 'price_intel', label: 'Price Intelligence', icon: DollarSign },
                { id: 'reports', label: 'Saved Searches', icon: BookOpen },
                { id: 'reports_full', label: 'Reports', icon: FileCheck }
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#0066FF' : 'transparent',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconComponent size={17} />
                    <span>{item.label}</span>
                  </div>
                );
              })}

              {/* Bottom Sidebar Settings & Logout */}
              <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div 
                  onClick={() => setActiveTab('settings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: activeTab === 'settings' ? '#ffffff' : '#94a3b8',
                    backgroundColor: activeTab === 'settings' ? '#0066FF' : 'transparent',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </div>
                <div 
                  onClick={onLogin}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: '#64748b',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            </aside>

            {/* Dynamic Workspace Work Area */}
            <div style={{ flex: 1, padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#ffffff', overflowY: 'auto' }}>
              
              {/* ========================================================================= */}
              {/* TAB 1: 4-STEP IMPORT OPPORTUNITY WIZARD (Matching Screens 3, 4, 5, 6) */}
              {/* ========================================================================= */}
              {activeTab === 'import_opp' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  
                  {/* Breadcrumb matching Screens 3, 4, 5, 6 */}
                  <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Import Opportunity</span>
                    <span style={{ color: '#94a3b8' }}>&gt;</span>
                    <span style={{ color: '#090d16', fontWeight: 600 }}>
                      {wizardStep === 1 && 'Product Details'}
                      {wizardStep === 2 && 'Process'}
                      {wizardStep === 3 && 'Market Selection'}
                      {wizardStep === 4 && 'Results'}
                    </span>
                  </div>

                  {/* 4-Step Stepper Progress Header matching Screens 3, 4, 5, 6 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '20px'
                  }}>
                    {[
                      { step: 1, title: 'Product Details' },
                      { step: 2, title: 'Process' },
                      { step: 3, title: 'Market Selection' },
                      { step: 4, title: 'Results' }
                    ].map((item, idx) => {
                      const isActive = wizardStep === item.step;
                      const isDone = wizardStep > item.step;

                      return (
                        <React.Fragment key={item.step}>
                          <div 
                            onClick={() => setWizardStep(item.step)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                          >
                            <div style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: isActive ? '#0066FF' : isDone ? '#090d16' : '#f1f5f9',
                              color: isActive || isDone ? '#ffffff' : '#64748b',
                              border: isActive || isDone ? 'none' : '1px solid #cbd5e1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 700
                            }}>
                              {isDone ? <Check size={14} /> : item.step}
                            </div>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: isActive ? 700 : isDone ? 600 : 500,
                              color: isActive ? '#0066FF' : isDone ? '#090d16' : '#64748b'
                            }}>
                              {item.title}
                            </span>
                          </div>
                          {idx < 3 && (
                            <div style={{ flex: 1, height: '1px', backgroundColor: isDone ? '#0066FF' : '#e2e8f0', margin: '0 16px' }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* ------------------------------------------------------------- */}
                  {/* SCREEN 3: STEP 1 - PRODUCT DETAILS + MULTI-FILE UPLOAD */}
                  {/* ------------------------------------------------------------- */}
                  {wizardStep === 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '40px', alignItems: 'start' }}>
                      {/* Left Form */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090d16' }}>Product Details</h3>
                        
                        {/* Product Name & HS Code Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Product Name</label>
                            <input 
                              type="text" 
                              value={productName} 
                              onChange={(e) => setProductName(e.target.value)}
                              style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>HS Code</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input 
                                type="text" 
                                value={hsCode} 
                                onChange={(e) => setHsCode(e.target.value)}
                                style={{ flex: 1, height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                              />
                              <button className="btn btn-secondary" style={{ padding: '0 14px', height: '42px', fontSize: '13px', fontWeight: 600 }}>Search</button>
                            </div>
                          </div>
                        </div>

                        {/* Product Category */}
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Product Category</label>
                          <input 
                            type="text" 
                            value={productCategory} 
                            onChange={(e) => setProductCategory(e.target.value)}
                            style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                          />
                        </div>

                        {/* Purpose Radio Group */}
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>Purpose</label>
                          <div style={{ display: 'flex', gap: '28px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#090d16' }}>
                              <input 
                                type="radio" 
                                name="purpose" 
                                checked={importPurpose === 'resale'} 
                                onChange={() => setImportPurpose('resale')} 
                                style={{ accentColor: '#0066FF', width: '16px', height: '16px' }}
                              /> 
                              Import for Resale
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#090d16' }}>
                              <input 
                                type="radio" 
                                name="purpose" 
                                checked={importPurpose === 'manufacturing'} 
                                onChange={() => setImportPurpose('manufacturing')} 
                                style={{ accentColor: '#0066FF', width: '16px', height: '16px' }}
                              /> 
                              Import for Manufacturing
                            </label>
                          </div>
                        </div>

                        {/* Additional Description */}
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                            Additional Description (Optional)
                          </label>
                          <input 
                            type="text" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                          />
                        </div>

                        {/* Multi-File Upload Section */}
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                            Specification Sheets & CAD Models (Optional)
                          </label>
                          
                          <label style={{
                            border: '1.5px dashed #cbd5e1',
                            borderRadius: '10px',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.15s ease'
                          }}>
                            <UploadCloud size={22} color="#0066FF" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#090d16', marginTop: '4px' }}>
                              Click or drag files here to upload
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              PDF specs, CAD .step, Lab test reports (Max 25MB)
                            </span>
                            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                          </label>

                          {/* File Chips */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                            {uploadedFiles.map((file, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', fontSize: '12.5px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <FileText size={14} color="#0066FF" />
                                  <span style={{ fontWeight: 600, color: '#090d16' }}>{file.name}</span>
                                  <span style={{ color: '#64748b', fontSize: '11px' }}>({file.size})</span>
                                </div>
                                <button onClick={() => removeFile(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Next Button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                          <button 
                            onClick={() => setWizardStep(2)} 
                            className="btn btn-primary" 
                            style={{ padding: '10px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }}
                          >
                            Next
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Clean White Product Preview Card matching Screen 3 in img.webp */}
                      <div style={{
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        padding: '36px 28px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
                      }}>
                        <div style={{
                          width: '210px',
                          height: '210px',
                          borderRadius: '16px',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '18px',
                          border: '1px solid #edf2f7'
                        }}>
                          {/* Crisp Clean AirPod Product Visual */}
                          <svg width="130" height="130" viewBox="0 0 100 100" fill="none">
                            <rect x="25" y="30" width="50" height="55" rx="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
                            <path d="M25,48 L75,48" stroke="#e2e8f0" strokeWidth="1.5" />
                            <circle cx="50" cy="62" r="2.5" fill="#94a3b8" />
                            {/* Left earbud */}
                            <path d="M36,15 C30,15 28,22 34,26 L38,40 L42,40 L40,24 C44,20 42,15 36,15 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                            {/* Right earbud */}
                            <path d="M64,15 C70,15 72,22 66,26 L62,40 L58,40 L60,24 C56,20 58,15 64,15 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#090d16' }}>{productName}</h4>
                        <span style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>HS Code: {hsCode}</span>
                        
                        <div style={{ marginTop: '16px', width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '14px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Attached Attachments:</span>
                          <strong style={{ color: '#0066FF' }}>{uploadedFiles.length} files</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------------------- */}
                  {/* SCREEN 4: STEP 2 - PROCESS + LANDED COST CALCULATOR */}
                  {/* ------------------------------------------------------------- */}
                  {wizardStep === 2 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '36px', alignItems: 'start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#090d16' }}>Select Import Process</h3>
                          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                            Choose the process that best describes your import requirement.
                          </p>
                        </div>

                        {/* Process Cards Grid matching Screen 4 in img.webp */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {[
                            { id: 'direct', title: 'Direct Import', desc: 'Import directly from international suppliers.', icon: Ship },
                            { id: 'indent', title: 'Indent / Procurement', desc: 'Import goods based on an indent or purchase order.', icon: FileCheck },
                            { id: 'third_party', title: 'Third Party Import', desc: 'Import through a third party or intermediary.', icon: Users },
                            { id: 'manufacturing', title: 'Import for Manufacturing', desc: 'Import raw materials or components for manufacturing.', icon: Building },
                            { id: 'project', title: 'Project Import', desc: 'Import goods for a specific project or contract.', icon: Boxes }
                          ].map((proc) => {
                            const IconComp = proc.icon;
                            const isSelected = selectedProcess === proc.id;
                            return (
                              <div 
                                key={proc.id} 
                                onClick={() => setSelectedProcess(proc.id)}
                                style={{
                                  padding: '16px 20px',
                                  borderRadius: '12px',
                                  border: '1.5px solid',
                                  borderColor: isSelected ? '#0066FF' : '#e2e8f0',
                                  backgroundColor: isSelected ? '#f4f8ff' : '#ffffff',
                                  boxShadow: isSelected ? '0 4px 14px rgba(0, 102, 255, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    backgroundColor: isSelected ? '#0066FF' : '#f1f5f9',
                                    color: isSelected ? '#ffffff' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    <IconComp size={18} />
                                  </div>
                                  <div>
                                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#090d16' }}>{proc.title}</h4>
                                    <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>{proc.desc}</p>
                                  </div>
                                </div>
                                <input 
                                  type="radio" 
                                  checked={isSelected} 
                                  onChange={() => setSelectedProcess(proc.id)}
                                  style={{ accentColor: '#0066FF', width: '16px', height: '16px' }}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Navigation Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                          <button onClick={() => setWizardStep(1)} className="btn btn-secondary" style={{ padding: '10px 24px' }}>Back</button>
                          <button onClick={() => setWizardStep(3)} className="btn btn-primary" style={{ padding: '10px 28px' }}>Next</button>
                        </div>
                      </div>

                      {/* Right Column: Cargo Ship Illustration (Screen 4 in img.webp) + Calculator */}
                      <div style={{
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        {/* Header with Illustration / Calculator view toggle */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 18px',
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: '#f8fafc'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Ship size={17} color="#0066FF" />
                            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#090d16' }}>Global Freight Route</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#0066FF', fontWeight: 600, backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                            Live AIS Active
                          </span>
                        </div>

                        {/* Beautiful Cargo Ship & Globe Graphic Illustration matching Screen 4 in img.webp */}
                        <div style={{
                          padding: '24px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f9fbfe',
                          borderBottom: '1px solid #f1f5f9'
                        }}>
                          <svg width="260" height="150" viewBox="0 0 260 150" fill="none">
                            <defs>
                              <linearGradient id="shipHull" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#1e3a8a" />
                                <stop offset="50%" stopColor="#2563eb" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                              </linearGradient>
                              <radialGradient id="globeSunburst" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#eff6ff" stopOpacity="0" />
                              </radialGradient>
                            </defs>

                            {/* Globe & Sunburst in background */}
                            <circle cx="170" cy="65" r="55" fill="url(#globeSunburst)" />
                            <circle cx="170" cy="65" r="48" fill="#e0f2fe" stroke="#93c5fd" strokeWidth="1.5" />
                            <ellipse cx="170" cy="65" rx="48" ry="18" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="170" y1="17" x2="170" y2="113" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" />

                            {/* Water Waves */}
                            <path d="M10,135 Q35,130 60,135 T110,135 T160,135 T210,135 T250,135" stroke="#60a5fa" strokeWidth="2.5" fill="none" />
                            <path d="M20,142 Q55,138 90,142 T160,142 T230,142" stroke="#93c5fd" strokeWidth="1.5" fill="none" />

                            {/* Cargo Ship Hull */}
                            <polygon points="40,110 210,110 190,135 60,135" fill="url(#shipHull)" />
                            {/* Bow & Stern detailing */}
                            <polygon points="40,110 25,92 60,92 60,110" fill="#1e293b" />
                            <polygon points="175,90 200,90 205,110 175,110" fill="#334155" />
                            {/* Bridge Cabin */}
                            <rect x="180" y="72" width="22" height="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" rx="2" />
                            <rect x="185" y="75" width="12" height="6" fill="#38bdf8" />
                            <rect x="195" y="62" width="4" height="10" fill="#ef4444" />

                            {/* Stacked 3D Containers on Deck */}
                            {/* Layer 1 (Bottom) */}
                            <rect x="68" y="96" width="28" height="14" fill="#0284c7" rx="1.5" stroke="#0369a1" />
                            <rect x="100" y="96" width="28" height="14" fill="#ea580c" rx="1.5" stroke="#c2410c" />
                            <rect x="132" y="96" width="28" height="14" fill="#16a34a" rx="1.5" stroke="#15803d" />

                            {/* Layer 2 (Top) */}
                            <rect x="84" y="82" width="28" height="14" fill="#f59e0b" rx="1.5" stroke="#d97706" />
                            <rect x="116" y="82" width="28" height="14" fill="#2563eb" rx="1.5" stroke="#1d4ed8" />
                          </svg>
                        </div>

                        {/* Landed Cost Breakdown */}
                        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Customs Duty:</span>
                            <strong style={{ color: '#090d16' }}>{formatCurrency(dutyCostPerUnit)} / unit</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Ocean Freight Unitized:</span>
                            <strong style={{ color: '#090d16' }}>{formatCurrency(freightPerUnit)} / unit</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Marine Insurance:</span>
                            <strong style={{ color: '#090d16' }}>{formatCurrency(insuranceCostPerUnit)} / unit</strong>
                          </div>
                          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 800, color: '#0066FF' }}>
                            <span>Total Landed Cost:</span>
                            <span>{formatCurrency(totalLandedCost)} / unit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------------------- */}
                  {/* SCREEN 5: STEP 3 - SELECT TARGET MARKETS */}
                  {/* ------------------------------------------------------------- */}
                  {wizardStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#090d16' }}>Select Target Markets</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                          Choose one or more countries you want to import from.
                        </p>
                      </div>

                      {/* Search Bar */}
                      <div style={{ position: 'relative', maxWidth: '380px' }}>
                        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                          type="text" 
                          placeholder="Search countries..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 14px 0 38px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      {/* 12 Country Cards Grid (4 columns x 3 rows matching Screen 5) */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '16px'
                      }}>
                        {filteredTargetMarkets.map((m) => {
                          const isChecked = selectedCountries.includes(m.id);
                          return (
                            <div 
                              key={m.id}
                              onClick={() => toggleCountry(m.id)}
                              style={{
                                padding: '14px 18px',
                                borderRadius: '10px',
                                border: '1.5px solid',
                                borderColor: isChecked ? '#0066FF' : '#e2e8f0',
                                backgroundColor: isChecked ? '#f4f8ff' : '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '22px' }}>{m.flag}</span>
                                <div>
                                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#090d16' }}>{m.country}</div>
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>{m.risk} • {m.fta}</div>
                                </div>
                              </div>
                              <input 
                                type="checkbox" 
                                checked={isChecked} 
                                onChange={() => toggleCountry(m.id)}
                                style={{ accentColor: '#0066FF', width: '16px', height: '16px', cursor: 'pointer' }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Navigation Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                        <button onClick={() => setWizardStep(2)} className="btn btn-secondary" style={{ padding: '10px 24px' }}>Back</button>
                        <button onClick={() => setWizardStep(4)} className="btn btn-primary" style={{ padding: '10px 28px' }}>Next</button>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------------------- */}
                  {/* SCREEN 6: STEP 4 - RESULTS TABLE */}
                  {/* ------------------------------------------------------------- */}
                  {wizardStep === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#090d16' }}>
                            Top Import Opportunities for {productName} (HS: {hsCode})
                          </h3>
                          <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                            Based on market demand, supplier availability, and import feasibility
                          </p>
                        </div>

                        <button 
                          onClick={() => setIsAuditModalOpen(true)}
                          className="btn btn-secondary" 
                          style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 600 }}
                        >
                          <Download size={15} /> Download Report
                        </button>
                      </div>

                      {/* Pristine Modern Table matching Screen 6 in img.webp */}
                      <div style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table className="ports-table">
                          <thead>
                            <tr>
                              <th>Country</th>
                              <th>Demand Score</th>
                              <th>Import Value</th>
                              <th>Growth (YoY)</th>
                              <th>Supplier Availability</th>
                              <th>Ease of Import</th>
                              <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { country: 'Germany', flag: '🇩🇪', demand: 'High', demandLevel: 'high', valueNum: 128600000, growth: '+18.6%', supplier: 'High', ease: 'Easy' },
                              { country: 'United States', flag: '🇺🇸', demand: 'High', demandLevel: 'high', valueNum: 312400000, growth: '+15.2%', supplier: 'High', ease: 'Moderate' },
                              { country: 'Japan', flag: '🇯🇵', demand: 'Medium', demandLevel: 'medium', valueNum: 85300000, growth: '+9.7%', supplier: 'Medium', ease: 'Easy' },
                              { country: 'Singapore', flag: '🇸🇬', demand: 'Medium', demandLevel: 'medium', valueNum: 42100000, growth: '+12.3%', supplier: 'High', ease: 'Easy' },
                              { country: 'UAE', flag: '🇦🇪', demand: 'Medium', demandLevel: 'medium', valueNum: 38700000, growth: '+10.1%', supplier: 'High', ease: 'Easy' }
                            ].map((row, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{ fontSize: '20px' }}>{row.flag}</span>
                                  <span>{row.country}</span>
                                </td>
                                <td>
                                  <span className={`badge ${row.demandLevel === 'high' ? 'badge-emerald' : 'badge-amber'}`}>
                                    {row.demand}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 600 }}>{formatCurrency(row.valueNum)}</td>
                                <td style={{ color: '#10b981', fontWeight: 700 }}>{row.growth}</td>
                                <td>
                                  <span style={{ color: row.supplier === 'High' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                                    {row.supplier}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ color: row.ease === 'Easy' ? '#10b981' : '#3b82f6', fontWeight: 600 }}>
                                    {row.ease}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <button 
                                    onClick={() => setSelectedOppForModal({
                                      title: `${productName} Bulk Supply Contract`,
                                      destination: row.country,
                                      flag: row.flag,
                                      importerName: `${row.country} Verified Importers Ltd.`,
                                      targetPrice: '$24.50 / unit',
                                      hsCode: hsCode
                                    })}
                                    className="btn btn-primary" 
                                    style={{ padding: '6px 16px', fontSize: '12.5px', borderRadius: '6px', fontWeight: 700 }}
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                        <button onClick={() => setWizardStep(3)} className="btn btn-secondary" style={{ padding: '10px 24px' }}>Back</button>
                        <button onClick={() => { setActiveTab('transactions'); }} className="btn btn-primary" style={{ padding: '10px 28px' }}>
                          View Active Orders Pipeline
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: DASHBOARD VIEW */}
              {/* ========================================================================= */}
              {activeTab === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '22px', fontWeight: 800 }}>Trade Executive Dashboard</h3>
                      <p style={{ fontSize: '13.5px', color: '#64748b' }}>Welcome back, Alexander • Vance Agro & Tech MSME</p>
                    </div>
                    <span className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '12px' }}>
                      <ShieldCheck size={14} /> Gold Verified MSME
                    </span>
                  </div>

                  {/* 4 KPI Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Active Trade Deals</div>
                      <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px' }}>14 Listings</div>
                      <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>+3 new this month</div>
                    </div>

                    <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Pipeline Escrow Value</div>
                      <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px' }}>{formatCurrency(1480000)}</div>
                      <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>+18.4% YoY</div>
                    </div>

                    <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Unread Buyer RFQs</div>
                      <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px' }}>8 Inquiries</div>
                      <div style={{ fontSize: '12px', color: '#0066FF', marginTop: '4px', fontWeight: 600 }}>4 High Intent</div>
                    </div>

                    <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Target Market Match</div>
                      <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '6px' }}>94% Accuracy</div>
                      <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>AI Optimized</div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div style={{ padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Global Demand Trend by Category</h4>
                    <div style={{ width: '100%', height: '240px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DEMAND_TREND_CHART}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip />
                          <Area type="monotone" dataKey="Electronics" stroke="#0066FF" fill="#eff6ff" />
                          <Area type="monotone" dataKey="CleanTech" stroke="#10b981" fill="#ecfdf5" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: MARKET INTELLIGENCE */}
              {/* ========================================================================= */}
              {activeTab === 'intelligence' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Market Intelligence Radar</h3>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>Real-time customs demand analytics and tariff compliance</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        placeholder="Filter country..." 
                        value={marketSearch}
                        onChange={(e) => setMarketSearch(e.target.value)}
                        style={{ height: '38px', padding: '0 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                    {MOCK_MARKETS.filter(m => m.country.toLowerCase().includes(marketSearch.toLowerCase())).map((m) => (
                      <div key={m.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '26px' }}>{m.flag}</span>
                            <span style={{ fontSize: '16px', fontWeight: 700 }}>{m.country}</span>
                          </div>
                          <span className="badge badge-emerald">{m.demandLevel} Demand</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          Market Size: <strong>{m.marketSize}</strong> • YoY Growth: <strong style={{ color: '#10b981' }}>{m.yoyGrowth}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Avg Shipping: <strong>{m.avgShippingDays} days</strong> • Tariff: <strong>{m.tariffRate}</strong>
                        </div>
                        <button onClick={() => { setActiveTab('import_opp'); setWizardStep(1); setProductName(m.topImports[0]); }} className="btn btn-secondary" style={{ width: '100%', fontSize: '12.5px', marginTop: 'auto' }}>
                          Analyze {m.topImports[0]}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: EXPORT OPPORTUNITY FINDER */}
              {/* ========================================================================= */}
              {activeTab === 'export_opp' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Export Opportunity Finder</h3>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>Live demand contracts verified with letter of credit backing</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        placeholder="Search product / HS..." 
                        value={oppSearch} 
                        onChange={(e) => setOppSearch(e.target.value)} 
                        style={{ padding: '0 12px', height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} 
                      />
                      <select 
                        value={oppDest} 
                        onChange={(e) => setOppDest(e.target.value)} 
                        style={{ padding: '0 12px', height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      >
                        <option value="All">All Destinations</option>
                        <option value="Germany">Germany</option>
                        <option value="UAE">UAE</option>
                        <option value="United States">USA</option>
                        <option value="Australia">Australia</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {opportunities.filter(o => 
                      (oppDest === 'All' || o.destination === oppDest) &&
                      (o.title.toLowerCase().includes(oppSearch.toLowerCase()) || o.hsCode.includes(oppSearch))
                    ).map((opp) => (
                      <div key={opp.id} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '32px' }}>{opp.flag}</span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ fontSize: '15.5px', fontWeight: 700 }}>{opp.title}</h4>
                              <span className="badge badge-blue">HS {opp.hsCode}</span>
                            </div>
                            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                              Buyer: <strong>{opp.importerName}</strong> • Volume: <strong>{opp.volumeRequired}</strong> • Target: <strong>{opp.targetPrice}</strong>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedOppForModal(opp)} 
                          className="btn btn-primary" 
                          style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 700 }}
                        >
                          Express Interest
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: ORDERS & TRANSACTIONS PIPELINE (With 3 Enterprise Modules) */}
              {/* ========================================================================= */}
              {activeTab === 'transactions' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '28px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Active Orders Pipeline ({transactions.length})</h3>
                    {transactions.map((trx) => (
                      <div 
                        key={trx.id} 
                        onClick={() => setSelectedTrx(trx)} 
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1.5px solid',
                          borderColor: selectedTrx.id === trx.id ? '#0066FF' : '#e2e8f0',
                          backgroundColor: selectedTrx.id === trx.id ? '#f4f8ff' : '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#0066FF' }}>
                          <span>{trx.id}</span>
                          <span className="badge badge-amber">{trx.status}</span>
                        </div>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginTop: '4px' }}>{trx.product}</h4>
                        <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                          Value: <strong>{trx.value}</strong> • Partner: {trx.partner}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details Pane with AIS Tracking, Escrow Simulator & Docs */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Order Milestone Tracker #{selectedTrx.id}</h3>
                      <span className="badge badge-emerald">{selectedTrx.paymentStatus}</span>
                    </div>

                    {/* AIS Maritime Vessel Tracking Box */}
                    <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Ship size={20} color="#0284c7" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1' }}>AIS Vessel: {selectedTrx.carrier}</div>
                          <div style={{ fontSize: '11.5px', color: '#0284c7' }}>ETA: {selectedTrx.eta} • Destination Port: Hamburg / Jebel Ali</div>
                        </div>
                      </div>
                      <span className="badge badge-blue" style={{ fontSize: '11px' }}>Live GPS</span>
                    </div>

                    <div style={{ fontSize: '13.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>Product: <strong>{selectedTrx.product}</strong></div>
                      <div>Consignee Partner: <strong>{selectedTrx.partner}</strong></div>
                      <div>HS Code: <strong>{selectedTrx.hsCode}</strong></div>
                    </div>

                    {/* Escrow Smart Contract Milestone Step Simulator */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                        <span>Escrow Settlement Milestones</span>
                        <span>Step {selectedTrx.step} of {selectedTrx.totalSteps}</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${(selectedTrx.step / selectedTrx.totalSteps) * 100}%`, height: '100%', backgroundColor: '#0066FF', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
                      <div style={{ fontWeight: selectedTrx.step >= 1 ? 700 : 400, color: selectedTrx.step >= 1 ? '#0066FF' : '#94a3b8' }}>Contract</div>
                      <div style={{ fontWeight: selectedTrx.step >= 2 ? 700 : 400, color: selectedTrx.step >= 2 ? '#0066FF' : '#94a3b8' }}>Escrow (30%)</div>
                      <div style={{ fontWeight: selectedTrx.step >= 3 ? 700 : 400, color: selectedTrx.step >= 3 ? '#0066FF' : '#94a3b8' }}>Maritime B/L</div>
                      <div style={{ fontWeight: selectedTrx.step >= 4 ? 700 : 400, color: selectedTrx.step >= 4 ? '#0066FF' : '#94a3b8' }}>Customs Clear</div>
                      <div style={{ fontWeight: selectedTrx.step >= 5 ? 700 : 400, color: selectedTrx.step >= 5 ? '#0066FF' : '#94a3b8' }}>Settled (100%)</div>
                    </div>

                    {/* Advance Milestone Button */}
                    <button 
                      onClick={advanceMilestone}
                      className="btn btn-secondary" 
                      style={{ fontSize: '12.5px', marginTop: '4px', alignSelf: 'flex-start' }}
                    >
                      <RefreshCw size={14} /> Simulate Next Escrow Milestone
                    </button>

                    {/* Customs Documentation Generator Links */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedDocModal({ type: 'Bill of Lading (B/L)', trx: selectedTrx })} className="btn btn-secondary" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
                        <FileText size={13} /> Bill of Lading
                      </button>
                      <button onClick={() => setSelectedDocModal({ type: 'Certificate of Origin (COO)', trx: selectedTrx })} className="btn btn-secondary" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
                        <FileText size={13} /> Certificate of Origin
                      </button>
                      <button onClick={() => setSelectedDocModal({ type: 'Commercial Invoice & Packing List', trx: selectedTrx })} className="btn btn-secondary" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
                        <FileText size={13} /> Commercial Invoice
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: BUYERS & SUPPLIERS NETWORK */}
              {/* ========================================================================= */}
              {activeTab === 'network' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Verified Global Network</h3>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>Direct verified counterparties with audited escrow histories</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {MOCK_NETWORK.map((net) => (
                      <div key={net.id} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '30px' }}>{net.flag}</span>
                          <div>
                            <h4 style={{ fontSize: '15.5px', fontWeight: 700 }}>{net.name}</h4>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{net.type} • {net.country}</span>
                          </div>
                        </div>

                        <div style={{ fontSize: '12.5px', color: '#475569' }}>
                          Trust Rating: <strong>⭐ {net.trustRating} / 5.0</strong> ({net.completedDeals} deals)
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {net.certifications.map((c, i) => (
                            <span key={i} className="badge badge-gray" style={{ fontSize: '11px' }}>{c}</span>
                          ))}
                        </div>

                        <button 
                          onClick={() => setActiveChatProfile(net)} 
                          className="btn btn-primary" 
                          style={{ padding: '8px 14px', fontSize: '12.5px', marginTop: 'auto', fontWeight: 700 }}
                        >
                          Direct Message
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 7: PRICE INTELLIGENCE */}
              {/* ========================================================================= */}
              {activeTab === 'price_intel' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Landed Cost & Price Intelligence</h3>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>Real-time FOB, freight rates, insurance, and duty breakdown</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Global Avg FOB Price</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>$24.50 / unit</div>
                      <div style={{ fontSize: '11.5px', color: '#10b981', marginTop: '2px' }}>-4.2% vs last quarter</div>
                    </div>

                    <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Ocean 40ft Container Index</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>$2,850 / TEU</div>
                      <div style={{ fontSize: '11.5px', color: '#0066FF', marginTop: '2px' }}>Asia -&gt; Europe Route</div>
                    </div>

                    <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Standard Duty / VAT</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>2.1% (DE / EU)</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>HS: 8518.30 Verified</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 8: SAVED SEARCHES & REPORTS */}
              {/* ========================================================================= */}
              {(activeTab === 'reports' || activeTab === 'reports_full') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Saved Searches & Intelligence Reports</h3>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>Exportable PDFs, customs data logs, and compliance filings</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { title: 'Global Wireless Earbuds HS 8518.30 Feasibility Report', date: 'Generated Aug 03, 2026', size: '2.4 MB PDF' },
                      { title: 'EU Tariff & CE Compliance Manual for Electronics', date: 'Generated Jul 28, 2026', size: '1.8 MB PDF' },
                      { title: 'UAE CleanTech & Inverter Demand Summary', date: 'Generated Jul 20, 2026', size: '3.1 MB PDF' }
                    ].map((rep, idx) => (
                      <div key={idx} style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '14.5px', fontWeight: 700 }}>{rep.title}</h4>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{rep.date} • {rep.size}</div>
                        </div>
                        <button onClick={() => setIsAuditModalOpen(true)} className="btn btn-secondary" style={{ fontSize: '12.5px' }}>
                          <Download size={14} /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 9: SETTINGS */}
              {/* ========================================================================= */}
              {activeTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Organization Settings</h3>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>Manage company credentials, Supabase sync, and trade limits</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Organization Name</label>
                      <input type="text" defaultValue={CURRENT_USER.company} style={{ width: '100%', height: '40px', padding: '0 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Verified Trade Limit</label>
                      <input type="text" defaultValue={CURRENT_USER.tradeLimit} readOnly style={{ width: '100%', height: '40px', padding: '0 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc' }} />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Supabase Cloud Connection</label>
                      <div style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f0fdf4', color: '#166534', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} /> Connected to https://rcsmwgpfizmrevqziayf.supabase.co
                      </div>
                    </div>

                    <button className="btn btn-primary" style={{ padding: '10px 24px', width: 'fit-content', marginTop: '10px' }}>
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS 3-STEP BENTO SECTION */}
      {/* ========================================================================= */}
      <section id="how-it-works" style={{ padding: '70px 56px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '8px', fontSize: '12px', padding: '4px 14px' }}>
            Seamless Workflow
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#090d16', letterSpacing: '-0.03em' }}>
            Built for Global Importers & Exporters
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            End-to-end intelligence from initial product discovery to landed cost calculations and multi-milestone escrow.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
          {/* Card 1 */}
          <div style={{
            padding: '32px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#0066FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090d16' }}>Intelligent Market Radar</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
              Query over 195 active customs databases in real time to locate high-margin product demand corridors with zero guesswork.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            padding: '32px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#0066FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090d16' }}>Landed Cost & Duty Engine</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
              Automatically aggregate CIF freight rates, regional tariffs, CE/RoHS compliance, and marine insurance down to the unit level.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            padding: '32px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#0066FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#090d16' }}>Secured Escrow Fulfillment</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
              Execute deals through letter-of-credit backed escrow with AIS satellite vessel tracking and instant customs document generation.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MODALS & SLIDE-IN AI CHAT DRAWER */}
      {/* ========================================================================= */}
      {/* Audit Report Modal */}
      <AuditReportModal 
        isOpen={isAuditModalOpen} 
        onClose={() => setIsAuditModalOpen(false)} 
        productName={productName} 
        hsCode={hsCode} 
        currency={currency} 
        exchangeRate={CURRENCIES[currency]?.rate || 1.0} 
      />

      {/* Customs Documentation Modal */}
      {selectedDocModal && (
        <CustomsDocModal 
          isOpen={true} 
          onClose={() => setSelectedDocModal(null)} 
          trx={selectedDocModal.trx} 
          docType={selectedDocModal.type} 
        />
      )}

      {/* RFQ Deal Proposal Modal */}
      {selectedOppForModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{selectedOppForModal.flag}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#090d16' }}>Submit Deal Proposal / RFQ</h3>
              </div>
              <button onClick={() => setSelectedOppForModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Opportunity Target</label>
                <input type="text" value={selectedOppForModal.title} readOnly style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#f8fafc' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Proposed FOB Price</label>
                  <input type="text" value={quotePrice} onChange={(e) => setQuotePrice(e.target.value)} style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Target Quantity</label>
                  <input type="text" value={quoteQuantity} onChange={(e) => setQuoteQuantity(e.target.value)} style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Proposal Notes / Compliance</label>
                <input type="text" value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', marginTop: '6px' }}>
                <button type="button" onClick={() => setSelectedOppForModal(null)} className="btn btn-secondary" style={{ padding: '9px 18px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '9px 22px', fontWeight: 700 }}>
                  <Send size={15} /> Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-In AI Trade Assistant & Chat Drawer */}
      {activeChatProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #e2e8f0',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '18px 20px', backgroundColor: '#070b14', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '26px' }}>{activeChatProfile.flag}</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{activeChatProfile.name}</div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{activeChatProfile.country} • Verified Counterparty</div>
              </div>
            </div>
            <button onClick={() => setActiveChatProfile(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* AI Negotiation Copilot Tip Banner */}
          <div style={{ padding: '10px 16px', backgroundColor: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#0369a1' }}>
            <Bot size={16} color="#0066FF" />
            <span>{aiTip}</span>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#f8fafc' }}>
            {messages.map((m, i) => (
              <div 
                key={i} 
                style={{
                  alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  backgroundColor: m.sender === 'me' ? '#0066FF' : '#ffffff',
                  color: m.sender === 'me' ? '#ffffff' : '#090d16',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: m.sender === 'me' ? 'none' : '1px solid #e2e8f0',
                  fontSize: '13.5px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                <div>{m.text}</div>
                <div style={{ fontSize: '10.5px', textAlign: 'right', marginTop: '4px', opacity: 0.75 }}>{m.time}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '14px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Type message or ask AI to draft..." 
              value={inputMsg} 
              onChange={(e) => setInputMsg(e.target.value)} 
              style={{ flex: 1, height: '42px', padding: '0 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }} 
            />
            <button type="submit" className="btn btn-primary" style={{ width: '42px', height: '42px', padding: 0, borderRadius: '8px' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. FOOTER */}
      {/* ========================================================================= */}
      <footer id="about" style={{ padding: '64px 56px 40px 56px', backgroundColor: '#070b14', color: '#ffffff', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.04em' }}>
                  Ports<span style={{ color: '#0066FF' }}>AI</span>
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '340px', lineHeight: 1.6 }}>
                The next-generation global trade operating system connecting verified importers, exporters, and customs data worldwide.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#94a3b8' }}>
                <a href="#workspace" style={{ color: 'inherit', textDecoration: 'none' }}>Market Radar</a>
                <a href="#workspace" style={{ color: 'inherit', textDecoration: 'none' }}>Landed Cost Engine</a>
                <a href="#workspace" style={{ color: 'inherit', textDecoration: 'none' }}>Escrow Tracking</a>
                <a href="#workspace" style={{ color: 'inherit', textDecoration: 'none' }}>HS Code Explorer</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>Resources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#94a3b8' }}>
                <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</a>
                <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>Customs API</a>
                <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>Security & Escrow</a>
                <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>Status</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                All Systems Operational
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
                Supabase Cloud Sync: Connected
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
            <span>&copy; 2026 PortsAI Global Inc. All rights reserved.</span>
            <span>Empowering Cross-Border Trade & MSMEs</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
