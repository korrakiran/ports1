import mongoose, { Schema, type Document, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    /**
     * `select: false` keeps the hash out of every query result by default, so it
     * cannot be leaked by a handler that forgets to project it away.
     */
    passwordHash: {
      type: String,
      required: false,
      select: false
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(
  this: UserDocument,
  candidate: string
): Promise<boolean> {
  if (!this.passwordHash) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.passwordHash);
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ??
  mongoose.model<UserDocument>('User', userSchema);
