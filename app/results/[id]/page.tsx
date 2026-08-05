'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Eye, Globe, Package, X } from 'lucide-react';
import type { AnalysisResult, MarketRecommendation } from '@shared/types';
import AppHeader from '@/components/app/AppHeader';
import MarketCard from '@/components/results/MarketCard';
import MarketHeatMap from '@/components/results/MarketHeatMap';
import AnalysisChat from '@/components/results/AnalysisChat';
import { Alert, Button, DataNotice, DemandBadge, Spinner } from '@/components/ui/primitives';
import { formatShare, formatTradeValue } from '@/lib/format';
import { analysisApi } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth-context';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRemaining, setShowRemaining] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<{ market: MarketRecommendation; rank: number } | null>(null);

  useEffect(() => {
    if (!user || !id) return;
    let cancelled = false;

    analysisApi
      .get(id)
      .then((r) => !cancelled && setAnalysis(r))
      .catch((e) => !cancelled && setError(e?.message ?? 'Could not load this analysis.'));

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  if (authLoading || (!analysis && !error)) {
    return (
      <div className="page-shell">
        <AppHeader />
        <main className="app-main row" style={{ justifyContent: 'center' }}>
          <Spinner size={26} />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <AppHeader />
        <main className="app-main app-main--narrow stack stack-md">
          <Alert>{error}</Alert>
          <Button onClick={() => router.push('/analyze')}>Analyze a product</Button>
        </main>
      </div>
    );
  }

  if (!analysis) return null;

  const { understanding, recommendations, summary } = analysis;

  const isLegacy =
    !Array.isArray(understanding?.matchedProducts) ||
    recommendations.some((r) => typeof r?.tradeValue !== 'number');

  if (isLegacy) {
    return (
      <div className="page-shell">
        <AppHeader />
        <main className="app-main app-main--narrow stack stack-lg">
          <Link href="/analyze" className="row row-sm muted" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Analyze another product
          </Link>
          <h1 className="page-title">This analysis needs re-running</h1>
          <DataNotice />
          <div className="card stack stack-md">
            <p className="prose">
              It was saved before PortsAI moved onto 2024 OEC trade data, so it has no import
              values, rankings or shares behind it. Rather than show you figures we can no longer
              stand behind, we would rather you ran it again.
            </p>
            <p className="prose">
              Your original description was:{' '}
              <strong>{analysis.input?.description ?? 'not recorded'}</strong>
            </p>
            <Button onClick={() => router.push('/analyze')}>Run this analysis again</Button>
          </div>
        </main>
      </div>
    );
  }

  const featured = recommendations.slice(0, 3);
  const remaining = recommendations.slice(3);

  /* ---- Unmatched ---- */
  if (understanding.isUnmatched || recommendations.length === 0) {
    return (
      <div className="page-shell">
        <AppHeader />
        <main className="app-main app-main--narrow stack stack-lg">
          <Link href="/analyze" className="row row-sm muted" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Analyze another product
          </Link>
          <h1 className="page-title">{summary.headline}</h1>
          <DataNotice />
          <div className="card stack stack-md">
            {summary.paragraphs.map((p, i) => (
              <p key={i} className="prose">
                {p}
              </p>
            ))}
            <Button onClick={() => router.push('/analyze')}>Try a different description</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <AppHeader />

      <div className="page-flow">
        {/* ================= 1. HERO SUMMARY ================= */}
        <section className="band band--plain">
          <div className="band-inner">
            <Link
              href="/analyze"
              className="row row-sm muted"
              style={{ textDecoration: 'none', marginBottom: 20 }}
            >
              <ArrowLeft size={15} /> Analyze another product
            </Link>

            <div className="result-hero">
              <div className="stack stack-md">
                <span className="eyebrow">Analysis</span>
                <h1 className="page-title">{summary.headline}</h1>
                <p className="page-subtitle">{analysis.input.description}</p>
                <div style={{ maxWidth: '52ch' }}>
                  <DataNotice />
                </div>
              </div>

              {/* Facts rail — Clean, professional editorial layout */}
              <div className="result-facts">
                {/* 1. READ FROM IMAGES — FIRST */}
                {analysis.vision && (
                  <div className="result-fact">
                    <span className="row row-sm">
                      <Eye size={12} color="var(--text-light)" />
                      <span className="eyebrow">Read from images</span>
                    </span>
                    <div className="result-fact-value" style={{ fontSize: 16, fontWeight: 700 }}>
                      {analysis.vision.description}
                    </div>
                    <div className="row row-wrap" style={{ gap: 5, marginTop: 8 }}>
                      {analysis.vision.terms.slice(0, 6).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. HS4 CATEGORY */}
                <div className="result-fact">
                  <span className="eyebrow">HS4 category</span>
                  <div className="result-fact-value">
                    {understanding.matchedProducts[0]?.hs4 ?? '—'}
                  </div>
                  <div className="muted" style={{ marginTop: 4 }}>
                    The trade category your description resolved to. Every market below is
                    ranked by its 2024 imports of this category — if it looks wrong, reword
                    your description and run it again.
                  </div>
                </div>

                {/* 3. LARGEST MARKET */}
                <div className="result-fact">
                  <span className="eyebrow">Largest market</span>
                  <div className="result-fact-value">
                    {recommendations[0].country} · {formatTradeValue(recommendations[0].tradeValue)}
                  </div>
                  <div className="muted" style={{ marginTop: 4 }}>
                    #1 Global Market Importer · {formatShare(recommendations[0].sharePct)} of country imports.
                  </div>
                </div>

                {/* 4. ALSO CONSIDERED */}
                {understanding.matchedProducts.length > 1 && (
                  <div className="result-fact">
                    <span className="eyebrow">Also considered</span>
                    <div className="row row-wrap" style={{ gap: 5, marginTop: 8 }}>
                      {understanding.matchedProducts.slice(1, 4).map((p) => (
                        <span key={p.hs4Id} className="chip">
                          {p.hs4}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. MATCHED ON */}
                <div className="result-fact">
                  <span className="row row-sm">
                    <Package size={12} color="var(--text-light)" />
                    <span className="eyebrow">Matched on</span>
                  </span>
                  <div className="row row-wrap" style={{ gap: 5, marginTop: 8 }}>
                    {understanding.matchedKeywords.slice(0, 6).map((k) => (
                      <span key={k} className="chip">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {analysis.visionError && (
              <div style={{ marginTop: 20 }}>
                <Alert variant="info">
                  Your images could not be analyzed ({analysis.visionError}). These markets were
                  matched from your written description alone.
                </Alert>
              </div>
            )}
          </div>
        </section>

        {/* ================= 2. MAP ================= */}
        <section className="map-hero">
          <div className="band-inner band-inner--tight" style={{ paddingBottom: 0 }}>
            <div
              className="section-head"
              style={{ marginBottom: 0, border: 'none', paddingBottom: 0 }}
            >
              <div className="section-head-titles">
                <span className="eyebrow">Coverage</span>
                <h2 className="section-title">Where demand appears</h2>
              </div>
              <span className="muted">Click or hover a country for detail</span>
            </div>
          </div>
          <div className="map-hero-canvas">
            <MarketHeatMap
              recommendations={recommendations}
              onSelect={(m) => {
                const idx = recommendations.findIndex((r) => r.countryIso === m.countryIso);
                setSelectedMarket({ market: m, rank: idx >= 0 ? idx + 1 : 1 });
              }}
            />
          </div>
        </section>

        {/* ================= 3. FEATURED TOP MARKETS ================= */}
        <section className="band band--plain">
          <div className="band-inner">
            <div className="section-head">
              <div className="section-head-titles">
                <span className="eyebrow">Start here</span>
                <h2 className="section-title">Strongest matches</h2>
              </div>
              <span className="muted">Click any card for country trade breakdown</span>
            </div>

            <div className="featured-grid">
              {featured.map((m, i) => (
                <MarketCard
                  key={m.countryIso}
                  market={m}
                  rank={i + 1}
                  variant={i === 0 ? 'featured' : 'default'}
                  onClick={() => setSelectedMarket({ market: m, rank: i + 1 })}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. REMAINING MARKETS — EXPANDABLE ================= */}
        {remaining.length > 0 && (
          <section className="band band--tint">
            <div className="band-inner">
              <div
                className="section-head"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: showRemaining ? '1px solid var(--border-soft)' : 'none',
                  paddingBottom: showRemaining ? '16px' : '0',
                  marginBottom: showRemaining ? '20px' : '0'
                }}
                onClick={() => setShowRemaining((prev) => !prev)}
              >
                <div className="section-head-titles">
                  <span className="eyebrow">Also matched</span>
                  <h2 className="section-title">
                    {remaining.length} further {remaining.length === 1 ? 'market' : 'markets'}
                  </h2>
                </div>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRemaining((prev) => !prev);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span>{showRemaining ? 'Collapse markets' : `Show all ${remaining.length} markets`}</span>
                  {showRemaining ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {showRemaining && (
                <div className="market-grid fade-up">
                  {remaining.map((m, i) => (
                    <MarketCard
                      key={m.countryIso}
                      market={m}
                      rank={i + 4}
                      variant="compact"
                      onClick={() => setSelectedMarket({ market: m, rank: i + 4 })}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= 5. EXPORT READINESS ================= */}
        <section className="band band--plain">
          <div className="band-inner">
            <div className="result-hero">
              <div>
                <div className="section-head">
                  <div className="section-head-titles">
                    <span className="eyebrow">Next</span>
                    <h2 className="section-title">Export readiness</h2>
                  </div>
                </div>

                <div className="timeline">
                  {summary.nextSteps.map((step, i) => (
                    <div
                      key={step}
                      className={`timeline-item ${i === 0 ? 'timeline-item--first' : ''}`}
                    >
                      <p className="timeline-step">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stack stack-md">
                <span className="eyebrow">In detail</span>
                {summary.paragraphs.map((p, i) => (
                  <p key={i} className="prose" style={{ fontSize: 13.5 }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. ASSISTANT ================= */}
        <section className="band band--tint band--last">
          <div className="band-inner">
            <AnalysisChat analysisId={analysis.id} />
          </div>
        </section>
      </div>

      {/* ================= COUNTRY DETAIL MODAL ================= */}
      {selectedMarket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedMarket(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              overflow: 'hidden',
              animation: 'fadeUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) both'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={18} color="#0066FF" />
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#090d16', margin: 0 }}>
                    {selectedMarket.market.country}
                  </h3>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  {selectedMarket.market.region} · #{selectedMarket.rank} Global Importer
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMarket(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Statistics */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                  Market Demand Level
                </span>
                <DemandBadge level={selectedMarket.market.demand} />
              </div>

              {/* Metric Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Annual Trade Value
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0066FF', marginTop: '4px' }}>
                    {formatTradeValue(selectedMarket.market.tradeValue)}
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Global Market Rank
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#090d16', marginTop: '4px' }}>
                    #{selectedMarket.rank} Importer
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Share of Country Imports
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#090d16', marginTop: '4px' }}>
                    {formatShare(selectedMarket.market.sharePct)}
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Total Economy Imports
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#090d16', marginTop: '4px' }}>
                    {formatTradeValue(selectedMarket.market.totalImports)}
                  </div>
                </div>
              </div>

              {/* Trade Category Context */}
              <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: 'rgba(0, 102, 255, 0.05)', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0066FF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Product Category
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#090d16', marginTop: '2px' }}>
                  {selectedMarket.market.hs4}
                </div>
                <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                  {selectedMarket.market.country} represents active import demand for this product category based on official UN Comtrade and CEPII BACI customs data.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-soft)',
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: '#f8fafc'
              }}
            >
              <Button onClick={() => setSelectedMarket(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
