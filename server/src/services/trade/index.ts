import type { TradeRepository } from './TradeRepository.js';
import { CsvTradeRepository } from './CsvTradeRepository.js';

/**
 * The one place that decides where trade data comes from.
 *
 * Currently global_imports_hs4.csv (OEC / CEPII BACI, 2024). To move to a live
 * trade API, implement `TradeRepository` against it and return it here —
 * nothing else in the codebase names a concrete implementation.
 *
 * There is no fallback dataset. If the CSV cannot be read the request fails
 * loudly rather than silently serving something else.
 */
let instance: TradeRepository | undefined;

export function getTradeRepository(): TradeRepository {
  instance ??= new CsvTradeRepository();
  return instance;
}

export type { TradeRepository, Hs4Match } from './TradeRepository.js';
