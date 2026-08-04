import type { TradeRepository } from './TradeRepository.js';
import { JsonTradeRepository } from './JsonTradeRepository.js';

/**
 * The one place that decides where trade data comes from.
 *
 * To move off the prototype dataset, implement `TradeRepository` against the real
 * source and return it here. Nothing else in the codebase refers to
 * `JsonTradeRepository` by name.
 */
let instance: TradeRepository | undefined;

export function getTradeRepository(): TradeRepository {
  instance ??= new JsonTradeRepository();
  return instance;
}

export type { TradeRepository };
