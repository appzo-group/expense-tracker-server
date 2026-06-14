import { Schema, model } from 'mongoose';

import { TRANSACTION_TYPES } from '../../../enums/transaction';
import { softDeletePlugin } from '../../../shared/softDelete.plugin';
import { ITransaction } from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: TRANSACTION_TYPES, required: true, index: true },
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

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, category: 1 });

transactionSchema.plugin(softDeletePlugin);

export const TransactionModel = model<ITransaction>('Transaction', transactionSchema);
