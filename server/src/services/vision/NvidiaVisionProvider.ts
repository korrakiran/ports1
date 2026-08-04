import sharp from 'sharp';
import type { VisionProvider, VisionResult } from './VisionProvider.js';

const INVOKE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

/**
 * NVIDIA NIM inline images must stay under ~180,000 bytes once base64-encoded.
 * Anything larger requires their separate asset-upload flow, so images are
 * downscaled until they fit rather than failing on a normal phone photo.
 */
const MAX_B64_BYTES = 170_000;
const RESIZE_STEPS = [1024, 768, 512, 384];

/** A hung upstream call must not hold the analysis request open indefinitely. */
const REQUEST_TIMEOUT_MS = 25_000;

/**
 * The prompt must not name any example product.
 *
 * An earlier version illustrated the format with "leather wallet", and the model
 * echoed that phrase back for unrelated images — a photo of a glass vase returned
 * "Leather wallet". Concrete examples inside a vision prompt get copied whenever
 * the model is unsure, so the format is described abstractly instead.
 */
const PROMPT = `You are identifying a physical product for an export-market search.

Reply with exactly two lines and nothing else:
DESCRIPTION: <one plain sentence naming the product and its main material>
TERMS: <5-10 comma-separated lowercase keywords covering product type, material and category>

Describe only what is actually visible in the image.
Use plain commercial nouns of the kind a product catalogue would use.
Do not guess a brand, and do not invent details you cannot see.
If the image does not show a physical product, reply exactly: DESCRIPTION: not a product`;

export class NvidiaVisionProvider implements VisionProvider {
  readonly modelName: string;

  constructor(
    private apiKey: string,
    model = 'meta/llama-3.2-90b-vision-instruct'
  ) {
    this.modelName = model;
  }

  /** Downscales/recompresses until the base64 payload fits the inline limit. */
  private async toInlineBase64(buffer: Buffer): Promise<string | null> {
    for (const width of RESIZE_STEPS) {
      let resized: Buffer;
      try {
        resized = await sharp(buffer)
          .rotate() // honour EXIF orientation
          .resize({ width, withoutEnlargement: true })
          .jpeg({ quality: 78 })
          .toBuffer();
      } catch (err) {
        // sharp in this build decodes AVIF but not HEIC, so an iPhone photo in
        // its default format lands here. Say which format failed rather than
        // surfacing libvips' internal message.
        const detail = err instanceof Error ? err.message : String(err);
        throw new Error(
          /heif|heic/i.test(detail)
            ? 'HEIC images are not supported. Please upload a JPEG or PNG.'
            : `Image could not be read: ${detail.slice(0, 160)}`
        );
      }

      const b64 = resized.toString('base64');
      if (b64.length <= MAX_B64_BYTES) return b64;
    }
    return null;
  }

  async describeProduct(images: { buffer: Buffer; mimetype: string }[]): Promise<VisionResult> {
    if (images.length === 0) throw new Error('No images supplied.');

    // One image keeps latency and token use sane; the first is the product shot
    // in practice.
    const b64 = await this.toInlineBase64(images[0].buffer);
    if (!b64) throw new Error('Image could not be compressed small enough to send.');

    let res: Response;
    try {
      res = await fetch(INVOKE_URL, {
        method: 'POST',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'user',
              // OpenAI-style content parts. The `<img src="data:…">` inline form
              // that some NIM docs show is silently ignored by this endpoint —
              // the model answers from the prompt text alone and hallucinates a
              // product. Verified: with the inline form a red and a blue image
              // both returned "Blue"; with this form they return "Red" and "Blue".
              content: [
                { type: 'text', text: PROMPT },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${b64}` } }
              ]
            }
          ],
          max_tokens: 256,
          temperature: 0.2,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: false
        })
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'TimeoutError') {
        throw new Error(`Vision model did not respond within ${REQUEST_TIMEOUT_MS / 1000}s.`);
      }
      throw err;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Vision API returned ${res.status}: ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? '';
    if (!content) throw new Error('Vision API returned an empty response.');

    return parseVisionReply(content);
  }
}

/**
 * Parses the model's reply.
 *
 * The model frequently ignores the "two lines" instruction and returns both
 * fields on a single line ("Leather wallet. TERMS: leather, wallet, ..."), so the
 * description capture must stop at `TERMS:` as well as at a newline — otherwise
 * the keyword list ends up displayed as part of the product description.
 */
export function parseVisionReply(content: string): VisionResult {
  const descMatch = content.match(/DESCRIPTION:\s*([\s\S]*?)(?:\n|\s*TERMS:|$)/i);
  const termsMatch = content.match(/TERMS:\s*([^\n]+)/i);

  const description =
    descMatch?.[1]?.trim().replace(/\s+/g, ' ') ||
    content.trim().split('\n')[0].replace(/\s+/g, ' ').slice(0, 300);

  const terms = [
    ...new Set(
      (termsMatch?.[1] ?? '')
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/\.$/, ''))
        .filter((t) => t.length > 1 && t.length < 40)
    )
  ];

  return { description, terms };
}
