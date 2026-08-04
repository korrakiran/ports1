'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Eye, Package } from 'lucide-react';
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

  return (
    <div className="page-shell">
      <AppHeader />

      <main className="app-main stack stack-xl">
        {/* --- Header --- */}
        <div className="stack stack-md">
          <Link
            href="/analyze"
            className="row row-sm"
            style={{ fontSize: 13.5, color: '#64748b', textDecoration: 'none', fontWeight: 600 }}
          >
            <ArrowLeft size={15} /> Analyze another product
          </Link>

          <div className="stack stack-xs">
            <h1 className="page-title">{summary.headline}</h1>
            <p className="page-subtitle">{analysis.input.description}</p>
          </div>

          <PrototypeNotice />
        </div>

        {/* --- Unmatched: say so plainly, recommend nothing --- */}
        {understanding.isUnmatched || recommendations.length === 0 ? (
          <div className="card stack stack-md">
            {summary.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7 }}>
                {p}
              </p>
            ))}
            <Button onClick={() => router.push('/analyze')}>Try a different description</Button>
          </div>
        ) : (
          <>
            {/* --- What the vision model saw --- */}
            {analysis.vision && (
              <section className="card stack stack-sm">
                <div className="row row-sm">
                  <Eye size={17} color="#0066ff" />
                  <h2 className="section-title">What we saw in your images</h2>
                </div>
                <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7 }}>
                  {analysis.vision.description}
                </p>
                <div className="row row-wrap" style={{ gap: 6 }}>
                  {analysis.vision.terms.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="muted">Read by {analysis.vision.model}.</p>
              </section>
            )}

            {analysis.visionError && (
              <Alert variant="info">
                Your images could not be analyzed ({analysis.visionError}). These markets were
                matched from your written description alone.
              </Alert>
            )}

            {/* --- Product understanding --- */}
            <section className="card stack stack-sm">
              <div className="row row-sm">
                <Package size={17} color="#0066ff" />
                <h2 className="section-title">How your product was understood</h2>
              </div>
              <div className="row row-wrap" style={{ gap: 8 }}>
                <span className="chip" style={{ fontWeight: 700 }}>
                  Category: {understanding.category}
                </span>
                {understanding.closestProducts.map((p) => (
                  <span key={p} className="chip">
                    {p}
                  </span>
                ))}
              </div>
              <p className="muted">
                Matched on: {understanding.matchedKeywords.join(', ')}
              </p>
            </section>

            {/* --- Heat map --- */}
            <section className="stack stack-md">
              <h2 className="section-title">Where demand appears</h2>
              <MarketHeatMap recommendations={recommendations} />
            </section>

            {/* --- Market cards --- */}
            <section className="stack stack-md">
              <h2 className="section-title">Recommended markets</h2>
              <div className="market-grid">
                {recommendations.map((m, i) => (
                  <MarketCard key={m.countryIso} market={m} rank={i + 1} />
                ))}
              </div>
            </section>

            {/* --- Summary --- */}
            <section className="card stack stack-sm">
              <h2 className="section-title">Summary</h2>
              {summary.paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7 }}>
                  {p}
                </p>
              ))}
            </section>

            {/* --- Next steps --- */}
            <section className="card stack stack-sm">
              <h2 className="section-title">Suggested next steps</h2>
              <div>
                {summary.nextSteps.map((step) => (
                  <div key={step} className="next-step">
                    <CheckCircle2 size={17} color="#0066ff" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </section>

            <AnalysisChat analysisId={analysis.id} />
          </>
        )}
      </main>
    </div>
  );
}
