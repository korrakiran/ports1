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
  'Very High': { bg: '#eff6ff', fg: '#0052cc', border: '#bfdbfe' },
  High: { bg: '#eff6ff', fg: '#0066ff', border: '#bfdbfe' },
  Moderate: { bg: '#f0f7ff', fg: '#2563eb', border: '#dbeafe' },
  Low: { bg: '#f8fafc', fg: '#3b82f6', border: '#e2e8f0' },
  Niche: { bg: '#f8fafc', fg: '#64748b', border: '#e2e8f0' }
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

/** Bold, high-contrast fill colors per demand level for the heat map. */
export function demandFill(level: DemandLevel): string {
  return (
    {
      'Very High': '#0052CC',
      High: '#0066FF',
      Moderate: '#3b82f6',
      Low: '#60a5fa',
      Niche: '#93c5fd'
    } as Record<DemandLevel, string>
  )[level] ?? '#3b82f6';
}
