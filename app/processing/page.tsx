'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import AppHeader from '@/components/app/AppHeader';
import { Alert, Button, Spinner } from '@/components/ui/primitives';
import { analysisApi } from '@/lib/api';
import { takePendingAnalysis } from '@/lib/pending-analysis';

/**
 * Step labels describe what the prototype actually does.
 *
 * The image step only appears when images were attached, and HS-code prediction
 * is never claimed because it is not implemented — a progress screen that
 * narrates work the system is not doing is just a lie with a spinner on it.
 */
function buildSteps(hasImages: boolean): string[] {
  return [
    'Reading your submission',
    ...(hasImages ? ['Looking at your images'] : []),
    'Extracting product terms',
    'Matching against the trade dataset',
    'Grouping matching markets',
    'Ranking markets by demand',
    'Preparing your report'
  ];
}

const STEP_MS = 620;

export default function ProcessingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState<string[]>(() => buildSteps(false));
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    // React 18+ mounts effects twice in dev; the pending form is consumed on the
    // first pass, so guard against firing a second, empty submission.
    if (started.current) return;
    started.current = true;

    const form = takePendingAnalysis();
    if (!form) {
      router.replace('/analyze');
      return;
    }

    const stepLabels = buildSteps(form.getAll('images').length > 0);
    setSteps(stepLabels);

    const requestPromise = analysisApi.create(form);

    // Advance the visible steps on a timer, independent of the request.
    const timer = setInterval(() => {
      setStep((s) => Math.min(s + 1, stepLabels.length - 1));
    }, STEP_MS);

    // Navigate only once both the request has resolved and the animation has had
    // time to play — whichever finishes last.
    const minDuration = new Promise((r) => setTimeout(r, stepLabels.length * STEP_MS));

    Promise.all([requestPromise, minDuration])
      .then(([result]) => {
        clearInterval(timer);
        setStep(stepLabels.length);
        router.replace(`/results/${result.id}`);
      })
      .catch((err) => {
        clearInterval(timer);
        setError(err?.message ?? 'The analysis could not be completed.');
      });

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="page-shell">
      <AppHeader />

      <main className="app-main app-main--narrow">
        <div className="stack stack-lg" style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className="stack stack-xs" style={{ textAlign: 'center' }}>
            <h1 className="page-title">
              {error ? 'Analysis failed' : 'Analyzing your product'}
            </h1>
            <p className="page-subtitle" style={{ margin: '0 auto' }}>
              {error
                ? 'Nothing was saved. You can adjust your description and try again.'
                : 'This takes a few seconds.'}
            </p>
          </div>

          {error ? (
            <div className="stack stack-md">
              <Alert>{error}</Alert>
              <Button onClick={() => router.push('/analyze')} size="lg" block>
                Back to your product
              </Button>
            </div>
          ) : (
            <div className="card stack stack-xs" aria-live="polite">
              {steps.map((label, i) => {
                const done = i < step;
                const active = i === step;

                return (
                  <div
                    key={label}
                    className={`step-row ${
                      done ? 'step-row--done' : active ? 'step-row--active' : 'step-row--pending'
                    }`}
                  >
                    <span
                      className="step-icon"
                      style={{
                        background: done ? '#0066ff' : active ? '#ffffff' : '#f1f5f9',
                        border: active ? '1px solid #bfdbfe' : 'none'
                      }}
                    >
                      {done ? (
                        <Check size={14} color="#fff" strokeWidth={3} />
                      ) : active ? (
                        <Spinner size={14} />
                      ) : null}
                    </span>
                    <span className="step-label">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
