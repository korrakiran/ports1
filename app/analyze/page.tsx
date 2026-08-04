'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Sparkles, X } from 'lucide-react';
import AppHeader from '@/components/app/AppHeader';
import ImageDropzone, { type PreviewFile } from '@/components/analyze/ImageDropzone';
import { Alert, Button, Field, PrototypeNotice, Spinner } from '@/components/ui/primitives';
import { useRequireAuth } from '@/lib/auth-context';
import { setPendingAnalysis } from '@/lib/pending-analysis';

const MIN_DESCRIPTION = 10;

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

  return (
    <div className="page-shell">
      <AppHeader />

      <main className="app-main app-main--narrow">
        <form onSubmit={handleSubmit} className="stack stack-lg" noValidate>
          <div className="stack stack-xs">
            <h1 className="page-title">Analyze your product</h1>
            <p className="page-subtitle">
              Tell us what you make. PortsAI matches it against its trade dataset and shows you
              which markets carry demand for that kind of product, and what to prepare.
            </p>
          </div>

          <PrototypeNotice text="Replace with production trade data. Your images are read by a vision model and combined with your description to match against a fixed demo dataset — the resulting markets are illustrative, not live trade statistics." />

          <div className="card stack stack-md">
            <Field
              label="Product description"
              htmlFor="description"
              hint="Plain language works best — what it is and what it is made of. For example: handmade leather wallet, vegetable tanned."
              error={errors.description}
            >
              <textarea
                id="description"
                className="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handmade leather wallet, vegetable tanned, hand stitched…"
                aria-invalid={Boolean(errors.description)}
                required
              />
            </Field>

            <Field
              label="Product images"
              hint="Read by a vision model to identify your product. The clearest photo helps most."
              optional
            >
              <ImageDropzone files={images} onChange={setImages} />
            </Field>

            <Field
              label="Product page URL"
              htmlFor="productUrl"
              hint="If your product is listed online, the link adds a little extra context."
              error={errors.productUrl}
              optional
            >
              <input
                id="productUrl"
                type="url"
                className="input"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://example.com/products/leather-wallet"
                aria-invalid={Boolean(errors.productUrl)}
              />
            </Field>

            <Field label="Product catalogue (PDF)" optional>
              {catalogue ? (
                <div className="row row-between card" style={{ padding: '10px 14px' }}>
                  <span className="row row-sm" style={{ fontSize: 13.5, fontWeight: 600 }}>
                    <FileText size={15} color="#0066ff" />
                    {catalogue.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCatalogue(null)}
                    aria-label="Remove catalogue"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="dropzone" style={{ padding: '18px' }}>
                  <FileText size={20} color="#0066ff" />
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>Attach a PDF catalogue</span>
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

          {errors.submit && <Alert>{errors.submit}</Alert>}

          <Button type="submit" size="lg">
            <Sparkles size={17} /> Analyze Product
          </Button>
        </form>
      </main>
    </div>
  );
}
