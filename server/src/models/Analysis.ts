import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { AnalysisResult } from '@shared/types';

/**
 * A user's previous analyses.
 *
 * Kept in its own collection keyed by `userId` rather than embedded in the user
 * document, so a user's history can grow without bumping into the BSON document
 * size limit and can be paged independently.
 *
 * The stored `result` is a snapshot of figures computed from
 * global_imports_hs4.csv at the time the analysis ran, so a past analysis stays
 * reproducible even after the dataset is refreshed.
 */
export interface AnalysisDocument extends Document {
  userId: mongoose.Types.ObjectId;
  description: string;
  productUrl?: string;
  imageNames: string[];
  catalogueName?: string;
  result: AnalysisResult;
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<AnalysisDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    description: { type: String, required: true, maxlength: 5000 },
    productUrl: { type: String },
    imageNames: { type: [String], default: [] },
    catalogueName: { type: String },
    /** Denormalised snapshot: results must stay reproducible even after the
     *  underlying dataset is replaced with real trade data. */
    result: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

export const Analysis: Model<AnalysisDocument> =
  (mongoose.models.Analysis as Model<AnalysisDocument>) ??
  mongoose.model<AnalysisDocument>('Analysis', analysisSchema);
