'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { DemandLevel, MarketType } from '@shared/types';

/**
 * Small shared primitives for the prototype app screens.
 *
 * They exist so pages compose UI instead of repeating markup and inline styles —
 * every visual token comes from globals.css.
 */

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'md' | 'lg';
  block?: boolean;
  loading?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  loading,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Spinner size={15} />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Spinner                                                             */
/* ------------------------------------------------------------------ */

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size, display: 'inline-block' }}
      role="status"
      aria-label="Loading"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Form field                                                          */
/* ------------------------------------------------------------------ */

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, error, optional, children }: FieldProps) {
  return (
    <div>
      <label className="field-label" htmlFor={htmlFor}>
        {label}
        {optional && <span style={{ color: '#94a3b8', fontWeight: 500 }}> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="field-error">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Alert                                                               */
/* ------------------------------------------------------------------ */

export function Alert({
  variant = 'error',
  children
}: {
  variant?: 'error' | 'info';
  children: React.ReactNode;
}) {
  return (
    <div className={`alert alert-${variant}`} role={variant === 'error' ? 'alert' : undefined}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Prototype disclaimer                                                */
/* ------------------------------------------------------------------ */

/**
 * Rendered anywhere dataset-derived results are shown. The provenance of this
 * data should never be more than one glance away from the data itself.
 */
export function PrototypeNotice({ text }: { text?: string }) {
  return (
    <div className="disclaimer-bar">
      <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>
        <strong>Prototype demo dataset.</strong>{' '}
        {text ??
          'Replace with production trade data. These markets come from a fixed demo file built for this prototype — they are illustrative, not live trade statistics, and should not be used for commercial decisions.'}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Qualitative badges                                                  */
/* ------------------------------------------------------------------ */

/** Colour per demand level. Categorical, and never paired with a number. */
const DEMAND_STYLE: Record<DemandLevel, { bg: string; fg: string; border: string }> = {
  'Very High': { bg: '#eef4ff', fg: '#0040a8', border: '#c7d9ff' },
  High: { bg: '#eff6ff', fg: '#0066ff', border: '#bfdbfe' },
  Medium: { bg: '#f1f5f9', fg: '#475569', border: '#e2e8f0' },
  Growing: { bg: '#ecfdf5', fg: '#047857', border: '#a7f3d0' },
  Emerging: { bg: '#fffbeb', fg: '#b45309', border: '#fde68a' }
};

export function DemandBadge({ level }: { level: DemandLevel }) {
  const s = DEMAND_STYLE[level] ?? DEMAND_STYLE.Medium;
  return (
    <span
      className="badge"
      style={{ background: s.bg, color: s.fg, border: `1px solid ${s.border}` }}
    >
      {level} demand
    </span>
  );
}

export function MarketTypeChip({ type }: { type: MarketType }) {
  return <span className="chip">{type}</span>;
}

/** Fill colour for a demand level, shared by the badge and the heat map. */
export function demandFill(level: DemandLevel): string {
  return (
    {
      'Very High': '#0040a8',
      High: '#0066ff',
      Medium: '#7aa7f0',
      Growing: '#10b981',
      Emerging: '#f59e0b'
    } as Record<DemandLevel, string>
  )[level];
}
