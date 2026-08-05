import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import type { AnalysisResult } from '@shared/types';
import { Analysis } from '../models/Analysis.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { HttpError, asyncHandler } from '../middleware/errors.js';
import { answerQuestion, runAnalysis } from '../services/analysis/index.js';
import { getTradeRepository } from '../services/trade/index.js';

const router = Router();

/**
 * Uploads are held in memory and never written to disk. Image bytes are passed
 * to the vision model for description, then discarded — only the filenames are
 * persisted with the analysis.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 12 }
});

const analyseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, 'Please describe your product in at least a few words.')
    .max(5000),
  productUrl: z
    .union([z.string().trim().url('Please enter a valid URL.'), z.literal('')])
    .optional()
});

/* POST /api/analysis */
router.post(
  '/',
  requireAuth,
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'catalogue', maxCount: 1 }
  ]),
  asyncHandler(async (req, res) => {
    const { description, productUrl } = analyseSchema.parse(req.body);

    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const imageNames = (files?.images ?? []).map((f) => f.originalname);
    const catalogueName = files?.catalogue?.[0]?.originalname;

    const result = await runAnalysis({
      description,
      productUrl: productUrl || undefined,
      imageNames,
      catalogueName,
      images: (files?.images ?? []).map((f) => ({ buffer: f.buffer, mimetype: f.mimetype }))
    });

    const saved = await Analysis.create({
      userId: req.userId,
      description,
      productUrl: productUrl || undefined,
      imageNames,
      catalogueName,
      result
    });

    // The stored id is what the results page routes on.
    res.status(201).json({ ...result, id: String(saved._id) });
  })
);

/* GET /api/analysis — the signed-in user's previous analyses */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const analyses = await Analysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(
      analyses.map((a) => ({
        id: String(a._id),
        description: a.description,
        createdAt: a.createdAt.toISOString(),
        category: a.result?.understanding?.matchedProducts?.[0]?.hs4 ?? null,
        // Saved before the OEC dataset was integrated — no trade figures behind it.
        legacy: !Array.isArray(a.result?.understanding?.matchedProducts),
        marketCount: a.result?.recommendations?.length ?? 0
      }))
    );
  })
);

/* GET /api/analysis/:id */
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const found = await Analysis.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!found) throw new HttpError(404, 'Analysis not found.');
    res.json({ ...found.result, id: String(found._id) });
  })
);

/* POST /api/analysis/:id/chat */
router.post(
  '/:id/chat',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { message } = z
      .object({ message: z.string().trim().min(1, 'Please enter a question.').max(1000) })
      .parse(req.body);

    const found = await Analysis.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!found) throw new HttpError(404, 'Analysis not found.');

    const analysis: AnalysisResult = { ...found.result, id: String(found._id) };
    res.json(answerQuestion(message, analysis));
  })
);

/* GET /api/analysis/meta/dataset — provenance, surfaced in the UI */
router.get('/meta/dataset', (_req, res) => {
  res.json({ notice: getTradeRepository().dataNotice() });
});

/* GET /api/analysis/meta/country/:iso3 — a country's largest 2024 imports,
   ranked by trade value with demand computed per product. */
router.get(
  '/meta/country/:iso3',
  requireAuth,
  asyncHandler(async (req, res) => {
    const repo = getTradeRepository();
    const iso3 = String(req.params.iso3);
    const country = await repo.country(iso3);
    if (!country) throw new HttpError(404, 'Country not found in the trade dataset.');

    const limit = Math.min(Number(req.query.limit) || 25, 100);
    res.json({ country, imports: await repo.topImportsForCountry(iso3, limit) });
  })
);

export default router;
