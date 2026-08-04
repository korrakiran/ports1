'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, Mail } from 'lucide-react';
import AppHeader from '@/components/app/AppHeader';
import { Alert, Button, Spinner } from '@/components/ui/primitives';
import { authApi, type AnalysisListItem } from '@/lib/api';
import { useRequireAuth } from '@/lib/auth-context';

/** Profile plus previous analyses. */
export default function AccountPage() {
  const { user, loading } = useRequireAuth();
  const [analyses, setAnalyses] = useState<AnalysisListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    authApi
      .profile()
      .then((p) => !cancelled && setAnalyses(p.analyses))
      .catch((e) => !cancelled && setError(e?.message ?? 'Could not load your analyses.'));

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="page-shell">
        <AppHeader />
        <main className="app-main row" style={{ justifyContent: 'center' }}>
          <Spinner size={26} />
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <AppHeader />

      <main className="app-main app-main--narrow stack stack-2xl">
        <div className="stack stack-sm">
          <h1 className="page-title">{user.name}</h1>
          <p className="row row-sm muted">
            <Mail size={14} /> {user.email}
          </p>
          <p className="row row-sm muted">
            <Clock size={14} /> Joined{' '}
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <section className="stack stack-lg">
          <div className="row row-between">
            <h2 className="section-title">Previous analyses</h2>
            <Link href="/analyze">
              <Button variant="secondary">New analysis</Button>
            </Link>
          </div>

          {error && <Alert>{error}</Alert>}

          {!analyses ? (
            <Spinner />
          ) : analyses.length === 0 ? (
            <div className="card card--roomy stack stack-md" style={{ textAlign: 'center' }}>
              <p className="prose" style={{ margin: '0 auto' }}>
                You have not analyzed a product yet.
              </p>
              <Link href="/analyze">
                <Button>Analyze your first product</Button>
              </Link>
            </div>
          ) : (
            <div className="stack stack-sm">
              {analyses.map((a) => (
                <Link
                  key={a.id}
                  href={`/results/${a.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article className="card card--interactive analysis-row">
                    <div className="analysis-row-main">
                      <h3 className="analysis-title">
                        {a.description.length > 90
                          ? `${a.description.slice(0, 90)}…`
                          : a.description}
                      </h3>
                      <div className="analysis-meta">
                        <span className="analysis-fact">
                          <span className="eyebrow">Category</span>
                          <span className="analysis-value">{a.category ?? 'No match'}</span>
                        </span>
                        <span className="analysis-fact">
                          <span className="eyebrow">Markets</span>
                          <span className="analysis-value">
                            {a.marketCount === 0 ? 'None' : a.marketCount}
                          </span>
                        </span>
                        <span className="analysis-fact">
                          <span className="eyebrow">Analyzed</span>
                          <span className="analysis-value">
                            {new Date(a.createdAt).toLocaleDateString(undefined, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="analysis-chevron" />
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
