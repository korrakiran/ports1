'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, FileText, Link2, Sparkles, X } from 'lucide-react';
import AppHeader from '@/components/app/AppHeader';
import ImageDropzone, { type PreviewFile } from '@/components/analyze/ImageDropzone';
import { Alert, Button, DataNotice, Field, Spinner } from '@/components/ui/primitives';
import { useRequireAuth } from '@/lib/auth-context';
import { setPendingAnalysis } from '@/lib/pending-analysis';

const MIN_DESCRIPTION = 10;

/**
 * A single readiness row in the right-hand panel.
 *
 * This panel reflects what the user has actually attached — it does not claim
 * any detection. Nothing is known about the product until the analysis runs on
 * the processing screen.
 */
function ReadyItem({
  on,
  label,
  value
}: {
  on: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className={`ready-item ${on ? '' : 'ready-item--off'}`}>
      <span className={`ready-mark ${on ? 'ready-mark--on' : ''}`}>
        {on && <Check size={11} color="#fff" strokeWidth={3} />}
      </span>
      <span style={{ minWidth: 0 }}>
        <span className="ready-label">{label}</span>
        <span className="ready-value" style={{ display: 'block' }}>
          {value}
        </span>
      </span>
    </div>
  );
}

export default function AnalyzePage() {
  const { user, loading } = useRequireAuth();
  const router = useRouter();

  const [images, setImages] = useState<PreviewFile[]>([]);
  const [description, setDescription] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [catalogue, setCatalogue] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (loading) {
    return (
      <div className="page-shell">
        <AppHeader />
        <main className="app-main row" style={{ justifyContent: 'center' }}>
          <Spinner size={26} />
        </main>
      </div>
    );
  }
  if (!user) return null; // useRequireAuth is redirecting

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (description.trim().length < MIN_DESCRIPTION) {
      next.description = 'Describe your product in at least a few words.';
    }
    if (productUrl.trim()) {
      try {
        new URL(productUrl.trim());
      } catch {
        next.productUrl = 'Enter a full URL, including https://';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const form = new FormData();
    form.append('description', description.trim());
    if (productUrl.trim()) form.append('productUrl', productUrl.trim());
    images.forEach((img) => form.append('images', img.file, img.file.name));
    if (catalogue) form.append('catalogue', catalogue, catalogue.name);

    setPendingAnalysis(form);
    router.push('/processing');
  }

  const hasDescription = description.trim().length >= MIN_DESCRIPTION;
  const ready = hasDescription;

  return (
    <div className="page-shell">
      <AppHeader />

      <form onSubmit={handleSubmit} className="page-flow" noValidate>
        {/* ---- Title band ---- */}
        <div className="band band--plain">
          <div className="band-inner band-inner--tight">
            <div className="row row-between row-wrap" style={{ gap: 16, alignItems: 'flex-end' }}>
              <div className="stack stack-xs">
                <span className="eyebrow">New analysis</span>
                <h1 className="page-title">Analyze your product</h1>
              </div>
              <p className="muted" style={{ maxWidth: '46ch' }}>
                Matched against the trade dataset to show which markets carry demand for this
                kind of product, and what each one asks for.
              </p>
            </div>
          </div>
        </div>

        {/* ---- Workspace ---- */}
        <div className="band band--tint band--last">
          <div className="band-inner">
            <div className="workspace">
              {/* Left: the work itself */}
              <div className="stack stack-lg">
                <section className="card stack stack-md">
                  <div className="section-head" style={{ marginBottom: 0 }}>
                    <div className="section-head-titles">
                      <span className="eyebrow">01</span>
                      <h2 className="section-title">Product images</h2>
                    </div>
                    <span className="muted">Optional</span>
                  </div>
                  <ImageDropzone files={images} onChange={setImages} />
                  <p className="field-hint" style={{ marginTop: 0 }}>
                    Read by a vision model to identify your product. The clearest photo helps most.
                  </p>
                </section>

                <section className="card stack stack-md">
                  <div className="section-head" style={{ marginBottom: 0 }}>
                    <div className="section-head-titles">
                      <span className="eyebrow">02</span>
                      <h2 className="section-title">Describe it</h2>
                    </div>
                    <span className="muted">Required</span>
                  </div>
                  <div>
                    <textarea
                      id="description"
                      className="textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Handmade leather wallet, vegetable tanned, hand stitched…"
                      aria-invalid={Boolean(errors.description)}
                      aria-label="Product description"
                      required
                    />
                    {errors.description ? (
                      <p className="field-error">{errors.description}</p>
                    ) : (
                      <p className="field-hint">
                        Plain language works best — what it is and what it is made of.
                      </p>
                    )}
                  </div>
                </section>

                {/* URL + PDF grouped as one "extra context" unit */}
                <section className="card card--flush">
                  <div className="field-group" style={{ border: 'none' }}>
                    <div className="field-group-row">
                      <div className="section-head" style={{ marginBottom: 0, paddingBottom: 0, border: 'none' }}>
                        <div className="section-head-titles">
                          <span className="eyebrow">03</span>
                          <h2 className="section-title">Extra context</h2>
                        </div>
                        <span className="muted">Optional</span>
                      </div>
                    </div>

                    <div className="field-group-row">
                      <Field
                        label="Product page URL"
                        htmlFor="productUrl"
                        error={errors.productUrl}
                      >
                        <div className="row row-sm">
                          <Link2 size={15} color="var(--text-light)" style={{ flexShrink: 0 }} />
                          <input
                            id="productUrl"
                            type="url"
                            className="input"
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            placeholder="https://example.com/products/leather-wallet"
                            aria-invalid={Boolean(errors.productUrl)}
                          />
                        </div>
                      </Field>
                    </div>

                    <div className="field-group-row">
                      <Field label="Product catalogue (PDF)">
                        {catalogue ? (
                          <div
                            className="row row-between"
                            style={{
                              padding: '10px 12px',
                              border: '1px solid var(--border-soft)',
                              borderRadius: 10
                            }}
                          >
                            <span className="row row-sm" style={{ fontSize: 13.5, minWidth: 0 }}>
                              <FileText size={15} color="var(--text-light)" />
                              {catalogue.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCatalogue(null)}
                              aria-label="Remove catalogue"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-light)'
                              }}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ) : (
                          <label className="dropzone dropzone--compact">
                            <FileText size={18} color="var(--text-light)" />
                            <span className="dropzone-hint">Attach a PDF catalogue</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              hidden
                              onChange={(e) => setCatalogue(e.target.files?.[0] ?? null)}
                            />
                          </label>
                        )}
                      </Field>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right: readiness, sticky */}
              <aside className="workspace-aside stack stack-md">
                <div className="card stack stack-md">
                  <div className="section-head" style={{ marginBottom: 0 }}>
                    <div className="section-head-titles">
                      <h2 className="section-title">Ready to analyze</h2>
                    </div>
                    <span className={`chip chip--mono`}>{ready ? 'ready' : 'waiting'}</span>
                  </div>

                  <div className="result-facts">
                    <ReadyItem
                      on={hasDescription}
                      label="Description"
                      value={
                        hasDescription
                          ? `${description.trim().length} characters`
                          : 'Required — a few words is enough'
                      }
                    />
                    <ReadyItem
                      on={images.length > 0}
                      label="Images"
                      value={
                        images.length > 0
                          ? `${images.length} attached`
                          : 'None attached — optional'
                      }
                    />
                    <ReadyItem
                      on={Boolean(productUrl.trim())}
                      label="Product URL"
                      value={productUrl.trim() ? 'Provided' : 'None — optional'}
                    />
                    <ReadyItem
                      on={Boolean(catalogue)}
                      label="Catalogue"
                      value={catalogue ? catalogue.name : 'None — optional'}
                    />
                  </div>

                  {errors.submit && <Alert>{errors.submit}</Alert>}

                  <Button type="submit" size="lg" block>
                    <Sparkles size={16} /> Analyze Product
                  </Button>
                  <p className="muted" style={{ textAlign: 'center' }}>
                    Takes about two minutes.
                  </p>
                </div>

                <DataNotice />
              </aside>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
