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
import { Alert, Button, PrototypeNotice, Spinner } from '@/components/ui/primitives';
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
  const featured = recommendations.slice(0, 3);
  const remaining = recommendations.slice(3);

  /* ---- Unmatched: one quiet column, nothing to compose around ---- */
  if (understanding.isUnmatched || recommendations.length === 0) {
    return (
      <div className="page-shell">
        <AppHeader />
        <main className="app-main app-main--narrow stack stack-lg">
          <Link href="/analyze" className="row row-sm muted" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Analyze another product
          </Link>
          <h1 className="page-title">{summary.headline}</h1>
          <PrototypeNotice />
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
        {/* ================= 1. HERO SUMMARY — asymmetric ================= */}
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
                  <PrototypeNotice />
                </div>
              </div>

              {/* Facts rail — what was understood, as discrete rows */}
              <div className="result-facts">
                <div className="result-fact">
                  <span className="eyebrow">Category</span>
                  <div className="result-fact-value">{understanding.category}</div>
                </div>
                <div className="result-fact">
                  <span className="eyebrow">Closest catalogue entry</span>
                  <div className="result-fact-value">
                    {understanding.closestProducts[0] ?? '—'}
                  </div>
                  <div className="muted" style={{ marginTop: 4 }}>
                    The demo-catalogue product yours matched most closely. Every market
                    below comes from this entry — if it looks wrong, reword your
                    description and run it again.
                  </div>
                </div>
                <div className="result-fact">
                  <span className="eyebrow">Markets matched</span>
                  <div className="result-fact-value">{recommendations.length}</div>
                </div>
                {analysis.vision && (
                  <div className="result-fact">
                    <span className="row row-sm">
                      <Eye size={12} color="var(--text-light)" />
                      <span className="eyebrow">Read from images</span>
                    </span>
                    <div className="result-fact-value">{analysis.vision.description}</div>
                    <div className="row row-wrap" style={{ gap: 5, marginTop: 8 }}>
                      {analysis.vision.terms.slice(0, 5).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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

        {/* ================= 2. MAP — full-bleed hero ================= */}
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
              <span className="muted">
                Ranked by how closely the dataset entry matched your product
              </span>
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

        {/* ================= 4. REMAINING MARKETS — compact ================= */}
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

        {/* ================= 5. EXPORT READINESS — timeline + detail ================= */}
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
