import { Schema, model } from 'mongoose';

import { BUDGET_PERIODS } from '../../../enums/budget';
import { softDeletePlugin } from '../../../shared/softDelete.plugin';
import { IBudget } from './budget.interface';

const budgetSchema = new Schema<IBudget>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true, trim: true },
    limit: { type: Number, required: true, min: 0.01 },
    period: { type: String, enum: BUDGET_PERIODS, default: 'monthly' },
    startDate: { type: Date, required: true },
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

budgetSchema.index({ userId: 1, category: 1 });

budgetSchema.plugin(softDeletePlugin);

export const BudgetModel = model<IBudget>('Budget', budgetSchema);
