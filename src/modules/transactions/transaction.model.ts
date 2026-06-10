import { Schema, model, Document, Types } from 'mongoose';

import { TRANSACTION_TYPES, TransactionType } from '../../shared/constants';
import { softDeletePlugin } from '../../shared/utils/softDelete.plugin';

export interface TransactionDocument extends Document {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true },
    note: { type: String, trim: true },
    date: { type: Date, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.userId;
        return ret;
      },
    },
  },
);

// Compound indexes for list/filter/analytics performance.
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, category: 1 });

transactionSchema.plugin(softDeletePlugin);

export const TransactionModel = model<TransactionDocument>(
  'Transaction',
  transactionSchema,
);
