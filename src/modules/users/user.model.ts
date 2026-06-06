import { Schema, model, Document } from 'mongoose';

import { AppConstants } from '../../shared/constants/app';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  currency: string;
  notifications: { budgetAlerts: boolean };
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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

export const UserModel = model<UserDocument>('User', userSchema);
