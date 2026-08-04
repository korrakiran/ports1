'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Mail } from 'lucide-react';
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

      <main className="app-main app-main--narrow stack stack-lg">
        <div className="stack stack-xs">
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

        <section className="stack stack-md">
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
            <div className="card stack stack-sm">
              <p style={{ fontSize: 14.5, color: '#475569' }}>
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
                  <article className="card card--interactive row row-between">
                    <div className="stack stack-xs">
                      <span style={{ fontSize: 14.5, fontWeight: 700, color: '#090d16' }}>
                        {a.description.length > 70
                          ? `${a.description.slice(0, 70)}…`
                          : a.description}
                      </span>
                      <span className="muted">
                        {a.category ?? 'No dataset match'} ·{' '}
                        {a.marketCount === 0
                          ? 'no markets matched'
                          : `${a.marketCount} market${a.marketCount === 1 ? '' : 's'}`}{' '}
                        · {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
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
