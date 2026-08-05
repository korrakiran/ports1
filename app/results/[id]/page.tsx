'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Package } from 'lucide-react';
import type { AnalysisResult } from '@shared/types';
import AppHeader from '@/components/app/AppHeader';
import MarketCard from '@/components/results/MarketCard';
import MarketHeatMap from '@/components/results/MarketHeatMap';
import AnalysisChat from '@/components/results/AnalysisChat';
import { Alert, Button, DataNotice, Spinner } from '@/components/ui/primitives';
import { formatShare, formatTradeValue } from '@/lib/format';
import { analysisApi } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth-context';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
                    #{recommendations[0].rank} of{' '}
                    {recommendations[0].productCount.toLocaleString()} categories it imports,{' '}
                    {formatShare(recommendations[0].sharePct)} of total imports.
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
              <span className="muted">Hover a country for detail</span>
            </div>
          </div>
          <div className="map-hero-canvas">
            <MarketHeatMap recommendations={recommendations} />
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
              <span className="muted">Ranked by 2024 import value</span>
            </div>

            <div className="featured-grid">
              {featured.map((m, i) => (
                <MarketCard
                  key={m.countryIso}
                  market={m}
                  rank={i + 1}
                  variant={i === 0 ? 'featured' : 'default'}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. REMAINING MARKETS ================= */}
        {remaining.length > 0 && (
          <section className="band band--tint">
            <div className="band-inner">
              <div className="section-head">
                <div className="section-head-titles">
                  <span className="eyebrow">Also matched</span>
                  <h2 className="section-title">
                    {remaining.length} further {remaining.length === 1 ? 'market' : 'markets'}
                  </h2>
                </div>
              </div>

              <div className="market-grid">
                {remaining.map((m, i) => (
                  <MarketCard key={m.countryIso} market={m} rank={i + 4} variant="compact" />
                ))}
              </div>
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
    </div>
  );
}
