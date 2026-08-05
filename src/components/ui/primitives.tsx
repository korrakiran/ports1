'use client';

import React from 'react';
import { Database } from 'lucide-react';
import { DATA_SOURCE, type DemandLevel } from '@shared/types';

/**
 * Small shared primitives for the app screens.
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
/* Field                                                               */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Spinner                                                             */
/* ------------------------------------------------------------------ */

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 9)) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Alert                                                               */
/* ------------------------------------------------------------------ */

export function Alert({
  variant = 'error',
  children
}: {
  variant?: 'error' | 'info' | 'success';
  children: React.ReactNode;
}) {
  return <div className={`alert alert-${variant}`}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Data notice                                                         */
/* ------------------------------------------------------------------ */

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

const DEMAND_STYLE: Record<DemandLevel, { bg: string; fg: string; border: string }> = {
  'Very High': { bg: '#eff6ff', fg: '#1d4ed8', border: '#bfdbfe' },
  High: { bg: '#f0f9ff', fg: '#0284c7', border: '#bae6fd' },
  Moderate: { bg: '#ecfdf5', fg: '#059669', border: '#a7f3d0' },
  Low: { bg: '#fffbeb', fg: '#d97706', border: '#fde68a' },
  Niche: { bg: '#f5f3ff', fg: '#7c3aed', border: '#ddd6fe' }
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

/** Clean, high-contrast demand color palette. */
export function demandFill(level: DemandLevel): string {
  return (
    {
      'Very High': '#1d4ed8', // Royal Blue
      High: '#0284c7',      // Ocean Blue
      Moderate: '#059669',  // Emerald Mint
      Low: '#d97706',       // Amber Gold
      Niche: '#7c3aed'      // Violet Indigo
    } as Record<DemandLevel, string>
  )[level] ?? '#1d4ed8';
}
