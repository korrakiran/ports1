'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  UploadCloud,
  Sparkles,
  Compass,
  Globe2,
  Package,
  FileCheck,
  Bot,
  ShieldCheck,
  Search,
  CheckCircle2,
  Users,
  Building,
  TrendingUp,
  Plus,
  X
} from 'lucide-react';
import WorldHeroMap from '../WorldHeroMap';

const HOW_IT_WORKS = [
  {
    icon: UploadCloud,
    title: 'Upload your product',
    desc: 'Add a photo, a short description, or a spec sheet. That’s all we need to get started — no lengthy forms.'
  },
  {
    icon: Sparkles,
    title: 'AI understands your product',
    desc: 'We identify what your product is, how it’s classified, and what similar products typically need to enter a new market.'
  },
  {
    icon: Compass,
    title: 'Get recommendations and export guidance',
    desc: 'Receive a ranked list of markets worth pursuing, along with the certifications, documents, and next steps to get there.'
  }
];

const RECEIVE_ITEMS = [
  {
    icon: Globe2,
    title: 'Recommended markets',
    desc: 'Country-level suggestions based on your product’s category, characteristics, and where similar products tend to find demand.'
  },
  {
    icon: Package,
    title: 'Product understanding',
    desc: 'A clear breakdown of what you’ve built — how it’s classified, and how it compares to products already sold abroad.'
  },
  {
    icon: FileCheck,
    title: 'Export readiness guidance',
    desc: 'The certifications, documentation, and compliance steps you’ll typically need before you can ship to a given market.'
  },
  {
    icon: Bot,
    title: 'AI assistant',
    desc: 'Ask follow-up questions about your product, a target market, or the export process, and get answers grounded in your analysis.'
  }
];

const MSME_POINTS = [
  { icon: Search, text: 'Limited access to international market research or trade consultants' },
  { icon: Compass, text: 'Uncertainty about which countries actually want their product' },
  { icon: FileCheck, text: 'Scattered, confusing certification and compliance requirements' }
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'Transparent',
    desc: 'We show you what informed a recommendation and where the analysis has limits — not a score with no explanation behind it.'
  },
  {
    icon: Search,
    title: 'Explainable',
    desc: 'Every market suggestion comes with reasoning in plain language, so you understand why, not just what.'
  },
  {
    icon: CheckCircle2,
    title: 'Practical',
    desc: 'Guidance is meant to be acted on — concrete next steps, not another report you have to interpret yourself.'
  }
];

const FAQS = [
  {
    q: 'How does PortsAI find export markets for my product?',
    a: 'We analyze what you upload — a photo, description, or spec sheet — to understand your product, then match its category and characteristics against known demand patterns across markets. You get a ranked, explained shortlist, not a black-box score.'
  },
  {
    q: 'Is PortsAI fully built yet?',
    a: 'We’re in early access. Product analysis and market recommendations are live today. Features like in-app document generation and end-to-end logistics support are still being built and will roll out over time.'
  },
  {
    q: 'What data do you need from me?',
    a: 'A photo or description of your product and the country you’re exporting from is enough to start. More detail — spec sheets, existing certifications — helps us give sharper recommendations.'
  },
  {
    q: 'Which markets do you cover?',
    a: 'We evaluate markets globally and prioritize the ones with the best fit for your specific product, rather than working off a fixed list of countries.'
  },
  {
    q: 'Do you handle logistics, customs, or payments?',
    a: 'Not yet. PortsAI currently focuses on market and product intelligence — telling you where to sell and what it takes to get there. Logistics and fulfillment support is on our roadmap.'
  },
  {
    q: 'What does it cost?',
    a: 'We’re still finalizing pricing. Sign up to get access, and we’ll be upfront about any changes before they affect you.'
  }
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid #e2e8f0' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '22px 4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit'
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#090d16' }}>{item.q}</span>
        <span style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          color: '#0066FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isOpen ? <X size={14} /> : <Plus size={14} />}
        </span>
      </button>
      {isOpen && (
        <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.7, paddingBottom: '22px', paddingRight: '40px' }}>
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function LandingPage({ onSignUp, onLogin }) {
  const [openFaq, setOpenFaq] = useState(0);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#090d16' }}>

      {/* NAVBAR */}
      <header style={{
        height: '76px',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f1f5f9',
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: '#090d16' }}>
            Ports<span style={{ color: '#0066FF' }}>AI</span>
          </span>
        </div>

        <nav className="desktop-only" style={{ gap: '32px', fontSize: '14.5px', fontWeight: 600, color: '#475569' }}>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }} style={{ textDecoration: 'none', color: '#475569' }}>How it works</a>
          <a href="#what-you-receive" onClick={(e) => { e.preventDefault(); scrollTo('what-you-receive'); }} style={{ textDecoration: 'none', color: '#475569' }}>What you get</a>
          <a href="#principles" onClick={(e) => { e.preventDefault(); scrollTo('principles'); }} style={{ textDecoration: 'none', color: '#475569' }}>Principles</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }} style={{ textDecoration: 'none', color: '#475569' }}>FAQ</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onLogin} className="btn btn-secondary">Log in</button>
          <button onClick={onSignUp} className="btn btn-primary">Analyze My Product</button>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" style={{ padding: '80px 48px 100px', maxWidth: '1380px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '480px 1fr',
          gap: '56px',
          alignItems: 'center'
        }}>
        <div>
          <span className="badge badge-blue">Early access</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.035em', marginTop: '20px' }}>
            Find the export markets ready for your product.
          </h1>
          <p style={{ fontSize: '16.5px', color: '#475569', lineHeight: 1.7, marginTop: '20px', maxWidth: '440px' }}>
            Upload your product and PortsAI tells you which markets are worth pursuing, why, and what it takes to get there — certifications, documentation, and next steps included.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginTop: '32px', flexWrap: 'wrap' }} className="hero-banner-buttons">
            <button onClick={onSignUp} className="btn btn-primary" style={{ padding: '13px 24px', fontSize: '15px' }}>
              Analyze My Product <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="btn btn-outline" style={{ padding: '13px 24px', fontSize: '15px' }}>
              See How It Works
            </button>
          </div>

          <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '14px' }}>
            Takes about two minutes. No sales calls required.
          </p>
        </div>

        <div style={{
          position: 'relative',
          backgroundColor: '#f3f6fb',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #e9f0f8'
        }}>
          <WorldHeroMap />
        </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '90px 48px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 56px' }}>
            <span className="badge badge-blue">How it works</span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '16px' }}>
              From product to export plan in three steps
            </h2>
          </div>

          <div className="grid-3" style={{ gap: '28px' }}>
            {HOW_IT_WORKS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '32px 28px',
                  boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px'
                  }}>
                    <Icon size={22} color="#0066FF" />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0066FF', marginBottom: '6px' }}>STEP {idx + 1}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL RECEIVE */}
      <section id="what-you-receive" style={{ padding: '90px 48px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 56px' }}>
            <span className="badge badge-blue">What you'll receive</span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '16px' }}>
              A clear, complete picture of your export path
            </h2>
          </div>

          <div className="grid-4" style={{ gap: '20px' }}>
            {RECEIVE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '26px 22px',
                  backgroundColor: '#ffffff'
                }}>
                  <Icon size={22} color="#0066FF" style={{ marginBottom: '14px' }} />
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800, marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BUILT FOR INDIAN MSMEs */}
      <section id="msme" style={{ padding: '90px 48px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
          <div>
            <span className="badge badge-blue">Built for Indian MSMEs</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '16px', lineHeight: 1.25 }}>
              Export expertise that isn't locked behind a consultant's fee
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, marginTop: '18px' }}>
              India has thousands of manufacturers making products that are ready for international buyers. What most of them lack isn't quality — it's access to the market research, compliance knowledge, and guidance that larger exporters take for granted. PortsAI puts that in reach directly, without an expensive intermediary.
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '32px'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '20px' }}>
              Common challenges we address
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {MSME_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.text} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '9px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={16} color="#0066FF" />
                    </div>
                    <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.6, paddingTop: '6px' }}>{point.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* OUR PRINCIPLES */}
      <section id="principles" style={{ padding: '90px 48px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 56px' }}>
            <span className="badge badge-blue">Our principles</span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '16px' }}>
              How we approach every recommendation
            </h2>
          </div>

          <div className="grid-3" style={{ gap: '28px' }}>
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} style={{ textAlign: 'center', padding: '8px 12px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px'
                  }}>
                    <Icon size={24} color="#0066FF" />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '10px' }}>{p.title}</h3>
                  <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '90px 48px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="badge badge-blue">FAQ</span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '16px' }}>
              Common questions
            </h2>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0' }}>
            {FAQS.map((item, idx) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openFaq === idx}
                onToggle={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '90px 48px', backgroundColor: '#070b14', textAlign: 'center' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
            Ready to see where your product fits?
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', marginTop: '14px', lineHeight: 1.7 }}>
            Upload your product and get your first market analysis in minutes.
          </p>
          <button onClick={onSignUp} className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '15px', marginTop: '28px' }}>
            Analyze My Product <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '36px 48px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Ports<span style={{ color: '#0066FF' }}>AI</span>
        </span>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>&copy; {new Date().getFullYear()} PortsAI. All rights reserved.</span>
      </footer>
    </div>
  );
}
