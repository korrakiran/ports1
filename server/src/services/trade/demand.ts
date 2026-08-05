import type { DemandLevel } from '@shared/types';

/**
 * Classifies export demand tier for a product market based on its global position
 * and trade volume for that product category.
 *
 *   globalRank            — Position among all global importers for this product (1 = top importer)
 *   globalProductSharePct — Percentage share of global world imports for this product
 *   tradeValue            — Total USD import value for this product category
 */
export function classifyDemand(
  globalRank: number,
  globalProductSharePct: number,
  tradeValue: number
): DemandLevel {
  if (globalRank <= 3 || globalProductSharePct >= 10 || tradeValue >= 150_000_000) return 'Very High';
  if (globalRank <= 8 || globalProductSharePct >= 4 || tradeValue >= 75_000_000) return 'High';
  if (globalRank <= 15 || globalProductSharePct >= 1.5 || tradeValue >= 25_000_000) return 'Moderate';
  if (globalRank <= 30 || globalProductSharePct >= 0.5 || tradeValue >= 5_000_000) return 'Low';
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
