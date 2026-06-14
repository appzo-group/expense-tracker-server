import { Types } from 'mongoose';

import { ICreateBudget, IUpdateBudget } from './budget.interface';
import { BudgetModel } from './budget.model';

/** All Mongoose access for the budgets collection. */
export const budgetRepository = {
  create(userId: string, input: ICreateBudget) {
    return BudgetModel.create({
      userId: new Types.ObjectId(userId),
      ...input,
    });
  },

  findByUser(userId: string) {
    return BudgetModel.find({ userId: new Types.ObjectId(userId) }).sort({ category: 1 });
  },

  findById(userId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return BudgetModel.findOne({ _id: id, userId: new Types.ObjectId(userId) });
  },

  update(userId: string, id: string, input: IUpdateBudget) {
    if (!Types.ObjectId.isValid(id)) return null;
    return BudgetModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      input,
      { new: true },
    );
  },

  /** Soft-delete: marks the budget as deleted rather than removing it. */
  delete(userId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return BudgetModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      { deletedAt: new Date() },
    );
  },

  /** Soft-delete every budget for a user (account deletion). */
  deleteAllForUser(userId: string) {
    return BudgetModel.updateMany(
      { userId: new Types.ObjectId(userId) },
      { deletedAt: new Date() },
    );
  },
};
