/**
 * Boundary for image understanding, mirroring `TradeRepository`.
 *
 * Swapping vision models means writing one class and changing the factory in
 * `./index.ts` — no route or matcher changes.
 */
export interface VisionResult {
  /** One-line description of the product as the model sees it. */
  description: string;
  /** Short noun phrases: materials, product type, notable features. */
  terms: string[];
}

export interface VisionProvider {
  /** Human-readable model identifier, surfaced in the UI for transparency. */
  readonly modelName: string;

  /**
   * Describes a product from one or more images.
   * Implementations must throw on failure; callers decide how to degrade.
   */
  describeProduct(images: { buffer: Buffer; mimetype: string }[]): Promise<VisionResult>;
}
