import { randomUUID } from 'node:crypto';
import type { AnalysisResult, ProductInput, VisionAnalysis } from '@shared/types';
import { getTradeRepository } from '../trade/index.js';
import { getVisionProvider } from '../vision/index.js';
import { matchProduct } from './matcher.js';
import { buildSummary } from './summary.js';

export interface AnalysisInput extends ProductInput {
  /** Raw image bytes, used for vision only — never persisted. */
  images?: { buffer: Buffer; mimetype: string }[];
}

/**
 * Runs a full product analysis: read the images, match against the trade
 * repository, and assemble the result the UI renders.
 *
 * Both external dependencies (trade data, vision) sit behind interfaces, so
 * swapping either one does not touch this file.
 */
export async function runAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
  const repo = getTradeRepository();
  const vision = getVisionProvider();

  let visionResult: VisionAnalysis | null = null;
  let visionError: string | null = null;

  if (vision && input.images?.length) {
    try {
      const { description, terms } = await vision.describeProduct(input.images);
      visionResult = { description, terms, model: vision.modelName };
    } catch (err) {
      // A vision failure must never fail the whole analysis — the written
      // description alone is still a valid basis for matching.
      visionError = err instanceof Error ? err.message : 'Image analysis failed.';
      console.warn('[vision] falling back to description-only matching:', visionError);
    }
  }

  const { understanding, recommendations } = await matchProduct(
    input,
    repo,
    visionResult?.terms ?? []
  );

  const summary = buildSummary(
    [input.description, visionResult?.description].filter(Boolean).join(' — '),
    understanding,
    recommendations
  );

  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    input: {
      description: input.description,
      productUrl: input.productUrl,
      imageNames: input.imageNames,
      catalogueName: input.catalogueName
    },
    understanding,
    recommendations,
    summary,
    vision: visionResult,
    visionError,
    disclaimer: repo.disclaimer()
  };
}

export { answerQuestion } from './chat.js';
