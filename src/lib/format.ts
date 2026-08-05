/**
 * Display formatting for trade figures.
 *
 * Mirrors the server-side helpers in server/src/services/trade/demand.ts so the
 * same value reads identically wherever it appears. These format numbers that
 * were computed from global_imports_hs4.csv — they never invent one.
 */

/** Compact USD, e.g. "$79.8 billion". */
export function formatTradeValue(usd: number): string {
  if (!Number.isFinite(usd) || usd <= 0) return '$0';
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(1)} trillion`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)} billion`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)} million`;
  if (usd >= 1e3) return `$${(usd / 1e3).toFixed(1)} thousand`;
  return `$${Math.round(usd)}`;
}

/** Share of total imports, never rounding a real value away to "0%". */
export function formatShare(pct: number): string {
  if (pct >= 1) return `${pct.toFixed(1)}%`;
  if (pct >= 0.01) return `${pct.toFixed(2)}%`;
  if (pct > 0) return '<0.01%';
  return '0%';
}
