import type { DemandLevel } from '@shared/types';

/**
 * Classifies demand for one HS4 product within one importing country.
 *
 * Both inputs are computed from global_imports_hs4.csv:
 *   rank     — position of this HS4 among every HS4 the country imports, by
 *              trade value, 1 = largest.
 *   sharePct — tradeValue / country's total imports * 100.
 *
 * A product qualifies for a level if it satisfies *either* the rank or the
 * share condition, so a large market's long tail is not unfairly demoted and a
 * small market's concentrated imports still register.
 *
 * Levels are never stored or hardcoded — they are derived on every read.
 */
export function classifyDemand(rank: number, sharePct: number): DemandLevel {
  if (rank <= 10 || sharePct >= 5) return 'Very High';
  if (rank <= 30 || sharePct >= 2) return 'High';
  if (rank <= 75 || sharePct >= 0.5) return 'Moderate';
  if (rank <= 150 || sharePct >= 0.1) return 'Low';
  return 'Niche';
}

/** Ordering weight, strongest first. Used for sorting only. */
export const DEMAND_RANK: Record<DemandLevel, number> = {
  'Very High': 5,
  High: 4,
  Moderate: 3,
  Low: 2,
  Niche: 1
};

/** Compact USD formatting for trade values, e.g. "$79.8 billion". */
export function formatTradeValue(usd: number): string {
  if (!Number.isFinite(usd) || usd <= 0) return '$0';
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(1)} trillion`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)} billion`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)} million`;
  if (usd >= 1e3) return `$${(usd / 1e3).toFixed(1)} thousand`;
  return `$${Math.round(usd)}`;
}

/** Share formatting that never rounds a real value away to "0%". */
export function formatShare(pct: number): string {
  if (pct >= 1) return `${pct.toFixed(1)}%`;
  if (pct >= 0.01) return `${pct.toFixed(2)}%`;
  if (pct > 0) return '<0.01%';
  return '0%';
}
