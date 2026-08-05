import { env } from '../../config/env.js';
import type { VisionProvider } from './VisionProvider.js';
import { NvidiaVisionProvider } from './NvidiaVisionProvider.js';

/**
 * The one place that decides which vision model is used.
 *
 * Returns `null` when no API key is configured, so the app runs — and analyses
 * still work from the written description — without vision credentials.
 */
let instance: VisionProvider | null | undefined;

export function getVisionProvider(): VisionProvider | null {
  if (instance === undefined) {
    instance = env.NVIDIA_API_KEY
      ? new NvidiaVisionProvider(env.NVIDIA_API_KEY, env.NVIDIA_VISION_MODEL)
      : null;

    if (!instance) {
      console.warn('[vision] NVIDIA_API_KEY not set — image analysis disabled.');
    }
  }
  return instance;
}

export type { VisionProvider, VisionResult } from './VisionProvider.js';
