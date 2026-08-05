'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Check,
  ImagePlus,
  Plus,
  Eye,
  Package,
  Globe2,
  FileCheck,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import WorldHeroMap from '../WorldHeroMap';
import WorldSVGMap from '../WorldSVGMap';
import { useAuth } from '@/lib/auth-context';

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/**
 * The five pipeline steps. Numbered because the process genuinely is ordered —
 * the markers encode sequence, they are not decoration.
 */
const PIPELINE = [
  {
    id: 'upload',
    num: '001',
    title: 'Upload your product',
    desc: 'A photo and a line of description is enough. No forms to fill in.',
    icon: ImagePlus
  },
  {
    id: 'vision',
    num: '002',
    title: 'AI reads the image',
    desc: 'A vision model identifies what the product is and what it is made of.',
    icon: Eye
  },
  {
    id: 'understand',
    num: '003',
    title: 'Product understood',
    desc: 'You see exactly what was detected before anything is matched.',
    icon: Package
  },
  {
    id: 'markets',
    num: '004',
    title: 'Markets matched',
    desc: 'Every recommended market shows the entry it matched on.',
    icon: Globe2
  },
  {
    id: 'readiness',
    num: '005',
    title: 'Export readiness',
    desc: 'The certifications and documents each market expects, and what to do next.',
    icon: FileCheck
  }
];

const PRINCIPLES = [
  {
    title: 'Transparent',
    body: 'Every market we suggest shows the dataset entry it came from. When the analysis has limits, we say so on the page rather than hiding it behind a score.'
  },
  {
    title: 'Explainable',
    body: 'Recommendations arrive with reasoning in plain language. You should understand why a market is on your list, not just that it is.'
  },
  {
    title: 'Practical',
    body: 'Guidance is written to be acted on — the next concrete step, not another report you have to interpret before you can use it.'
  }
];

const FAQS = [
  {
    q: 'How does PortsAI find export markets for my product?',
    a: 'You upload a photo and a short description. A vision model reads the image to identify the product and its material, and that is combined with your description to match an HS4 trade category. We then rank every country that imported that category in 2024 by value, and show you the largest markets with their rank, import share and demand level.'
  },
  {
    q: 'Is PortsAI fully built yet?',
    a: 'We are in early access, but the trade data is real. Recommendations are based on 2024 international trade data from the Observatory of Economic Complexity (OEC), powered by the CEPII BACI trade database derived from official UN Comtrade customs data — 226 countries and territories and more than 232,000 HS4-level import records. Product analysis, market matching and export guidance all work today.'
  },
  {
    q: 'Where do the demand figures come from?',
    a: 'Every figure is computed from the 2024 OEC / CEPII BACI dataset, derived from official UN Comtrade customs records. For each market we show the actual import value for your product category, its rank among everything that country imports, and its share of total imports. The demand level is derived from that rank and share — it is calculated, not assigned. We do not hold tariff or certification data, so we do not quote any.'
  },
  {
    q: 'What do you need from me?',
    a: 'A photo of your product and a line describing it. A product URL or catalogue helps sharpen the match, but neither is required.'
  },
  {
    q: 'Do you handle logistics, customs or payments?',
    a: 'Not yet. PortsAI currently covers market and product intelligence — where to sell and what it takes to get there. Logistics and buyer connections are on the roadmap, not in the product.'
  },
  {
    q: 'What does it cost?',
    a: 'Pricing is not finalised. Early access is free, and we will be upfront about any change before it affects you.'
  }
];

/* ------------------------------------------------------------------ */
/* Motion — 12px rise, plays once                                      */
/* ------------------------------------------------------------------ */

function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target); // once
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

function Reveal({ children, style }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="ld-reveal" style={style}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product surfaces — real UI, qualitative labels only                 */
/* ------------------------------------------------------------------ */

/**
 * Demand ramp for the example markets.
 *
 * A single navy hue stepped by value — not four different colours. The ordering
 * still reads, but the page keeps one accent. These are qualitative labels;
 * no number is ever attached to them.
 */
const DEMAND = {
  'Very High': 'var(--ld-map-4)',
  High: 'var(--ld-map-3)',
  Moderate: 'var(--ld-map-2)',
  Low: 'var(--ld-map-1)'
};

const EXAMPLE_MARKETS = [
  { country: 'Germany', demand: 'Very High', type: 'Premium Market' },
  { country: 'United States', demand: 'High', type: 'Premium Market' },
  { country: 'United Arab Emirates', demand: 'High', type: 'Re-export Hub' },
  { country: 'Japan', demand: 'Moderate', type: 'Premium Market' },
  { country: 'Australia', demand: 'Low', type: 'Volume Market' }
];

function StageUpload() {
  return (
    <>
      <div className="ld-drop">
        <ImagePlus size={22} color="var(--ld-faint)" />
        <span style={{ fontSize: 14.5, color: 'var(--ld-ink)' }}>Drag a product photo here</span>
        <span className="ld-small">JPG, PNG or WebP</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className="ld-chip">wallet-front.jpg</span>
        <span className="ld-chip">wallet-detail.jpg</span>
      </div>
      <p className="ld-small">A photo and one line of description is the whole input.</p>
    </>
  );
}

function StageVision() {
  return (
    <>
      <div className="ld-surface">
        <div className="ld-surface-head">
          <span className="ld-label">What we saw in your images</span>
          <span className="ld-chip ld-chip--mono">vision</span>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 20, letterSpacing: '-0.02em', color: 'var(--ld-ink)' }}>
            Leather wallet.
          </span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['leather', 'wallet', 'accessory', 'handmade', 'fashion'].map((t) => (
              <span key={t} className="ld-chip">{t}</span>
            ))}
          </div>
          <span className="ld-mono-note">read by llama-3.2-90b-vision</span>
        </div>
      </div>
      <p className="ld-small">
        The model returns what it can see. Nothing is inferred beyond the image.
      </p>
    </>
  );
}

function StageUnderstand() {
  return (
    <>
      <div className="ld-surface">
        <div className="ld-surface-head">
          <span className="ld-label">How your product was understood</span>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="ld-chip">Category · Fashion</span>
            <span className="ld-chip">Handmade Leather Wallet</span>
          </div>
          <div style={{ borderTop: '1px solid var(--ld-rule-soft)', paddingTop: 12 }}>
            <span className="ld-label">Matched on</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {['leather', 'wallet', 'handmade'].map((t) => (
                <span key={t} className="ld-chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="ld-small">
        You see the interpretation before the recommendation, so you can correct it.
      </p>
    </>
  );
}

function StageMarkets() {
  return (
    <>
      <div className="ld-surface">
        <div className="ld-surface-head">
          <span className="ld-label">Recommended markets</span>
          <span className="ld-chip ld-chip--mono">12 matched</span>
        </div>
        <div>
          {EXAMPLE_MARKETS.map((m) => (
            <div key={m.country} className="ld-market-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <span className="ld-dot" style={{ background: DEMAND[m.demand] }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, color: 'var(--ld-ink)', letterSpacing: '-0.01em' }}>
                    {m.country}
                  </div>
                  <div className="ld-mono-note" style={{ marginTop: 2 }}>
                    matched on Handmade Leather Wallet
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, color: DEMAND[m.demand] }}>{m.demand} demand</div>
                <div className="ld-small" style={{ fontSize: 12 }}>{m.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="ld-small">
        Every row carries its receipt. A market appears only because an entry matched.
      </p>
    </>
  );
}

function StageReadiness() {
  return (
    <>
      <div className="ld-surface">
        <div className="ld-surface-head">
          <span className="ld-label">Export readiness · Germany</span>
        </div>
        <div style={{ padding: '4px 16px 12px' }}>
          {[
            'Confirm your HS classification with a customs broker before quoting.',
            'Prepare a specification sheet — materials, dimensions, packaging.',
            'Check destination certification early; testing is the longest lead item.',
            'Register for an Importer Exporter Code (IEC) if you do not hold one.',
            'Ask two or three freight forwarders for indicative routing.'
          ].map((t) => (
            <div key={t} className="ld-check">
              <Check size={15} color="var(--ld-faint)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ color: 'var(--ld-body-c)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="ld-small">
        Guidance is practical and general. Anything we cannot verify, we say we cannot verify.
      </p>
    </>
  );
}

const STAGES = {
  upload: StageUpload,
  vision: StageVision,
  understand: StageUnderstand,
  markets: StageMarkets,
  readiness: StageReadiness
};

/* ------------------------------------------------------------------ */
/* Profile menu                                                        */
/* ------------------------------------------------------------------ */

/** "Kiran Korra" -> "KK"; "Kiran" -> "K". Falls back to the email's first letter. */
function initialsFrom(name, email) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return (email?.[0] ?? '?').toUpperCase();
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const router = useRouter();

  // Close on outside click or Escape — a menu that traps the user is a bug.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const go = (href) => {
    setOpen(false);
    router.push(href);
  };

  const firstName = (user.name ?? '').trim().split(/\s+/)[0] || 'Account';

  return (
    <div className="ld-profile-wrap" ref={wrapRef}>
      <button
        className="ld-profile"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="ld-avatar" aria-hidden="true">
          {initialsFrom(user.name, user.email)}
        </span>
        <span className="ld-profile-name">{firstName}</span>
        <ChevronDown size={14} className="ld-profile-chev" />
      </button>

      {open && (
        <div className="ld-menu" role="menu">
          <div className="ld-menu-head">
            <span className="ld-label">Signed in as</span>
            <div className="ld-menu-name">{user.name}</div>
            <div className="ld-menu-email" title={user.email}>{user.email}</div>
          </div>

          <div className="ld-menu-divider" />

          <button className="ld-menu-item" role="menuitem" onClick={() => go('/analyze')}>
            Analyze Product
          </button>
          <button className="ld-menu-item" role="menuitem" onClick={() => go('/account')}>
            My Analyses
          </button>
          {/* Settings has no screen yet — shown, but honestly marked rather than
              linking somewhere that does not exist. */}
          <span className="ld-menu-item" role="menuitem" aria-disabled="true">
            Settings <span className="ld-menu-soon">soon</span>
          </span>

          <div className="ld-menu-divider" />

          <button
            className="ld-menu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="ld-faq-item">
      <button className="ld-faq-q" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <Plus size={16} className="ld-faq-sign" />
      </button>
      {isOpen && <p className="ld-faq-a">{item.a}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage({ onSignUp, onLogin }) {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRefs = useRef([]);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Advance the sticky rail as the right-hand panels pass through the viewport.
  useEffect(() => {
    const panels = panelRefs.current.filter(Boolean);
    if (panels.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = panels.indexOf(e.target);
            if (i !== -1) setActiveStep(i);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="ld">
      {/* ================= NAV ================= */}
      <header className="ld-nav">
        <div className="ld-nav-inner">
          <button
            className="ld-wordmark"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Ports<span>AI</span>
          </button>

          <nav className="ld-nav-links">
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How it works</a>
            <a href="#inside" onClick={(e) => { e.preventDefault(); scrollTo('inside'); }}>What you get</a>
            <a href="#principles" onClick={(e) => { e.preventDefault(); scrollTo('principles'); }}>Principles</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
          </nav>

          <div className="ld-nav-actions">
            {/* While the session check is in flight, render neither state — a
                "Log in" button that flips to a profile chip reads as a glitch. */}
            {loading ? (
              <div className="ld-nav-placeholder" style={{ width: 140, height: 38 }} aria-hidden="true" />
            ) : user ? (
              <>
                <button className="ld-btn ld-btn--primary ld-btn--sm ld-desktop-only" onClick={onSignUp}>
                  Analyze My Product
                </button>
                <ProfileMenu user={user} onLogout={logout} />
              </>
            ) : (
              <>
                <button className="ld-btn ld-btn--ghost ld-btn--sm" onClick={onLogin}>Log in</button>
                <button className="ld-btn ld-btn--primary ld-btn--sm ld-desktop-only" onClick={onSignUp}>
                  Analyze My Product
                </button>
              </>
            )}

            {/* 3-LINE HAMBURGER MENU BUTTON (MOBILE ONLY) */}
            <button
              className="ld-mobile-toggle-box"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} color="#090d16" />
            </button>
          </div>
        </div>
      </header>

      {/* FULL SCREEN MOBILE OVERLAY MENU (Mounted on document.body via createPortal) */}
      {mounted && mobileMenuOpen && createPortal(
        <div
          className="mobile-fullscreen-menu"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#ffffff',
            zIndex: 99999999,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 24px 32px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          {/* Header with Logo and Close Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingBottom: '16px',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            <button
              className="ld-wordmark"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Ports<span>AI</span>
            </button>

            <button
              className="ld-mobile-toggle-box"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
              style={{ display: 'flex' }}
            >
              <X size={22} color="#090d16" />
            </button>
          </div>

          {/* Centered Clean Links per portsai.in */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              padding: '32px 0'
            }}
          >
            <a
              href="#hero"
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#090d16',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </a>
            <a
              href="#how-it-works"
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#090d16',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo('how-it-works');
              }}
            >
              How it works
            </a>
            <a
              href="#inside"
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#090d16',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo('inside');
              }}
            >
              What you get
            </a>
            <a
              href="#principles"
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#090d16',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo('principles');
              }}
            >
              Principles
            </a>
            <a
              href="#faq"
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#090d16',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo('faq');
              }}
            >
              FAQ
            </a>
            {!user && (
              <button
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#475569',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogin();
                }}
              >
                Log in
              </button>
            )}
          </div>

          {/* Primary Mobile Action CTA */}
          <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
            <button
              className="ld-btn ld-btn--primary"
              style={{
                width: '100%',
                height: '48px',
                fontSize: '15px',
                borderRadius: '10px',
                justifyContent: 'center'
              }}
              onClick={() => {
                setMobileMenuOpen(false);
                onSignUp();
              }}
            >
              Analyze My Product <ArrowRight size={16} />
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* ================= HERO — 7/5, globe bleeds ================= */}
      <section id="hero" className="ld-hero">
        <div className="ld-shell">
          <div className="ld-hero-grid">
            <div className="ld-hero-copy">
              <span className="ld-label">001 &nbsp;/&nbsp; Early access</span>

              <h1 className="ld-display-xl">
                Find the export markets ready for your product.
              </h1>

              <p className="ld-lead">
                Upload a photo. PortsAI reads your product, matches it against trade data, and
                shows you which markets are worth pursuing — and what each one asks for.
              </p>

              <div className="ld-hero-ctas">
                <button className="ld-btn ld-btn--primary" onClick={onSignUp}>
                  Analyze My Product <ArrowRight size={16} />
                </button>
                <button
                  className="ld-btn ld-btn--ghost"
                  onClick={() => scrollTo('how-it-works')}
                >
                  See how it works
                </button>
              </div>

              <span className="ld-mono-note">
                two minutes · no sales calls · built for Indian MSMEs
              </span>
            </div>

            <div className="ld-hero-viz">
              <WorldHeroMap />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PIPELINE — sticky rail, advancing stage ================= */}
      <section id="how-it-works" className="ld-section ld-section--rule">
        <div className="ld-shell">
          <div className="ld-pipe-grid">
            <div className="ld-pipe-rail">
              <span className="ld-label">How it works</span>
              <h2 className="ld-title">
                From a photograph to a shortlist you can act on.
              </h2>
              <p className="ld-copy" style={{ fontSize: 15 }}>
                Five steps, in order. Each one shows its working, so nothing arrives without
                an explanation attached.
              </p>

              <div className="ld-steps">
                {PIPELINE.map((step, i) => (
                  <button
                    key={step.id}
                    className="ld-step"
                    aria-current={activeStep === i}
                    onClick={() =>
                      panelRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  >
                    <span className="ld-step-num">{step.num}</span>
                    <span>
                      <span className="ld-step-title">{step.title}</span>
                      {activeStep === i && <span className="ld-step-desc">{step.desc}</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ld-5)' }}>
              {PIPELINE.map((step, i) => {
                const Stage = STAGES[step.id];
                return (
                  <div
                    key={step.id}
                    ref={(el) => (panelRefs.current[i] = el)}
                    className="ld-stage"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <step.icon size={16} color="var(--ld-faint)" />
                      <span className="ld-label">{step.num}</span>
                      <span className="ld-label">{step.title}</span>
                    </div>
                    <Stage />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT PREVIEW ================= */}
      <section id="inside" className="ld-section ld-section--tint">
        <div className="ld-shell">
          <Reveal>
            <span className="ld-label">002 &nbsp;/&nbsp; Inside the product</span>
            <h2 className="ld-display" style={{ marginTop: 16, maxWidth: '18ch' }}>
              One analysis, everything it found.
            </h2>
            <p className="ld-copy" style={{ marginTop: 16 }}>
              This is the actual result surface — the interpretation, the markets, and the map,
              on one page.
            </p>
          </Reveal>

          <Reveal style={{ marginTop: 48 }}>
            <div
              className="ld-surface"
              style={{ borderRadius: 'var(--ld-r-surface)', overflow: 'hidden' }}
            >
              <div className="ld-surface-head" style={{ background: 'var(--ld-surface)' }}>
                <span className="ld-label">Analysis · Handmade leather wallet</span>
                <span className="ld-chip ld-chip--mono">example</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 380 }}>
                <aside
                  style={{
                    borderRight: '1px solid var(--ld-rule-soft)',
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                    background: 'var(--ld-surface)'
                  }}
                >
                  <div>
                    <span className="ld-label">Detected</span>
                    <p style={{ fontSize: 15, color: 'var(--ld-ink)', marginTop: 6, letterSpacing: '-0.015em' }}>
                      Leather wallet
                    </p>
                  </div>
                  <div>
                    <span className="ld-label">Materials</span>
                    <p style={{ fontSize: 14, color: 'var(--ld-body-c)', marginTop: 6 }}>leather · handmade</p>
                  </div>
                  <div>
                    <span className="ld-label">Category</span>
                    <p style={{ fontSize: 14, color: 'var(--ld-body-c)', marginTop: 6 }}>Fashion</p>
                  </div>
                  <div>
                    <span className="ld-label">Match</span>
                    <p style={{ fontSize: 14, color: 'var(--ld-navy-ink)', marginTop: 6 }}>Strong</p>
                  </div>
                </aside>

                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, background: '#fff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {EXAMPLE_MARKETS.slice(0, 3).map((m) => (
                      <div
                        key={m.country}
                        style={{
                          border: '1px solid var(--ld-rule)',
                          borderRadius: 'var(--ld-r-card)',
                          padding: 14
                        }}
                      >
                        <div style={{ fontSize: 14.5, color: 'var(--ld-ink)', letterSpacing: '-0.01em' }}>
                          {m.country}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                          <span className="ld-dot" style={{ background: DEMAND[m.demand] }} />
                          <span style={{ fontSize: 12.5, color: DEMAND[m.demand] }}>{m.demand}</span>
                        </div>
                        <div className="ld-small" style={{ fontSize: 12, marginTop: 4 }}>{m.type}</div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      border: '1px solid var(--ld-rule)',
                      borderRadius: 'var(--ld-r-card)',
                      padding: 12,
                      flex: 1,
                      minHeight: 180,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <style>{`
                      .ld-mini-map path { fill: var(--ld-map-0); stroke: var(--ld-surface); stroke-width: 0.5; }
                      .ld-mini-map path#de, .ld-mini-map path#us { fill: var(--ld-map-4); }
                      .ld-mini-map path#ae, .ld-mini-map path#jp { fill: var(--ld-map-3); }
                      .ld-mini-map path#au { fill: var(--ld-map-1); }
                    `}</style>
                    <WorldSVGMap className="ld-mini-map" style={{ width: '100%', height: 'auto' }} />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal style={{ marginTop: 16 }}>
            <p className="ld-mono-note">
              example output · demand shown as qualitative labels, never invented figures
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= PRINCIPLES ================= */}
      <section id="principles" className="ld-section">
        <div className="ld-shell">
          <Reveal>
            <span className="ld-label">Principles</span>
            <h2 className="ld-display" style={{ marginTop: 16, maxWidth: '20ch' }}>
              An export consultant should show its working.
            </h2>
          </Reveal>

          <Reveal style={{ marginTop: 56 }}>
            <div className="ld-cols-3">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="ld-col">
                  <h3 className="ld-subtitle">{p.title}</h3>
                  <p className="ld-copy" style={{ fontSize: 15, marginTop: 10 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="ld-section ld-section--tint">
        <div className="ld-shell">
          <Reveal>
            <span className="ld-label">Questions</span>
            <h2 className="ld-title" style={{ marginTop: 16, maxWidth: '22ch' }}>
              Answered plainly, including what is not built yet.
            </h2>
          </Reveal>

          <Reveal style={{ marginTop: 48 }}>
            <div className="ld-cols-2">
              {[FAQS.slice(0, 3), FAQS.slice(3)].map((group, gi) => (
                <div key={gi}>
                  {group.map((item, i) => {
                    const index = gi * 3 + i;
                    return (
                      <FaqItem
                        key={item.q}
                        item={item}
                        isOpen={openFaq === index}
                        onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="ld-footer">
        <div className="ld-shell">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 32,
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: '46ch' }}>
              <span style={{ fontSize: 19, fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--ld-ink)' }}>
                Ports<span style={{ color: 'var(--ld-navy)' }}>AI</span>
              </span>
              <p className="ld-small">
                Export market intelligence for Indian MSMEs. Recommendations are built on
                2024 OEC / CEPII BACI trade data, derived from official UN Comtrade customs
                records.
              </p>
            </div>

            <button className="ld-btn ld-btn--ghost" onClick={onSignUp}>
              Analyze My Product <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
