'use client';

import React from 'react';
import { Database } from 'lucide-react';
import { DATA_SOURCE, type DemandLevel } from '@shared/types';

/**
 * Small shared primitives for the app screens.
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
/* Data provenance                                                     */
/* ------------------------------------------------------------------ */

/**
 * Rendered wherever dataset-derived figures are shown. Provenance should never
 * be more than one glance away from the numbers it describes.
 */
export function DataNotice({ text }: { text?: string }) {
  return (
    <div className="data-notice">
      <Database size={15} style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{text ?? DATA_SOURCE.notice}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Qualitative badges                                                  */
/* ------------------------------------------------------------------ */

/**
 * Colour per demand level — one navy ramp, strongest darkest.
 * The level itself is computed server-side from rank and import share.
 */
const DEMAND_STYLE: Record<DemandLevel, { bg: string; fg: string; border: string }> = {
  'Very High': { bg: '#eef4ff', fg: '#0a3f96', border: '#c7d9ff' },
  High: { bg: '#eff6ff', fg: '#0066ff', border: '#bfdbfe' },
  Moderate: { bg: '#f4f7fc', fg: '#4a7cc4', border: '#dbe4f2' },
  Low: { bg: '#f7f9fb', fg: '#7d8ba1', border: '#e6ebf2' },
  Niche: { bg: '#f8fafc', fg: '#94a3b8', border: '#eef2f7' }
};

export function DemandBadge({ level }: { level: DemandLevel }) {
  const s = DEMAND_STYLE[level] ?? DEMAND_STYLE.Moderate;
  return (
    <span
      className="demand-badge"
      style={{ background: s.bg, color: s.fg, borderColor: s.border }}
    >
      <span className="demand-dot" style={{ background: s.fg }} />
      {level} demand
    </span>
  );
}

/** Fill colour for a demand level, shared by the badge and the heat map. */
export function demandFill(level: DemandLevel): string {
  return (
    {
      'Very High': '#0a3f96',
      High: '#2f6fd0',
      Moderate: '#7aa2e0',
      Low: '#b9cdf0',
      Niche: '#dbe4f2'
    } as Record<DemandLevel, string>
  )[level];
}
