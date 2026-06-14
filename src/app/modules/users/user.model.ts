import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';


const userSchema = new Schema<IUser, UserModel>({
  name: { type: String, required: true, trim: true },
  mail: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  currency: { type: String, default: 'USD' },
  notifications: { budgetAlerts: { type: Boolean, default: true } },
  passwordResetToken: { type: String, default: null, select: false },
  passwordResetExpires: { type: Date, default: null, select: false },
  deletedAt: { type: Date, default: null },

},
  { timestamps: true, versionKey: false });
userSchema.index({ mail: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } },
);

export const User = model<IUser, UserModel>("User", userSchema);