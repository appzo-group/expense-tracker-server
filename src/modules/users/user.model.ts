import { Schema, model, Document } from 'mongoose';

import { AppConstants } from '../../shared/constants/app';
import { softDeletePlugin } from '../../shared/utils/softDelete.plugin';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  currency: string;
  notifications: { budgetAlerts: boolean };
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    // Uniqueness is enforced by a partial index below (only among non-deleted
    // users) so an email can be reused after a soft-deleted account.
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    // Never returned by default; queries that need it use `.select('+password')`.
    password: { type: String, required: true, select: false },
    currency: { type: String, default: AppConstants.defaultCurrency },
    notifications: {
      budgetAlerts: { type: Boolean, default: true },
    },
    passwordResetToken: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  },
);

userSchema.plugin(softDeletePlugin);

// Email is unique only among active (non-deleted) users.
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);

export const UserModel = model<UserDocument>('User', userSchema);
