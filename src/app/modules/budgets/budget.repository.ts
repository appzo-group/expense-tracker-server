import { Types } from 'mongoose';

import { ICreateBudget, IUpdateBudget } from './budget.interface';
import { BudgetModel } from './budget.model';

export const createBudget = (userId: string, input: ICreateBudget) =>
  BudgetModel.create({ userId: new Types.ObjectId(userId), ...input });

export const findBudgetsByUser = (userId: string) =>
  BudgetModel.find({ userId: new Types.ObjectId(userId) }).sort({ category: 1 });

export const findBudgetById = (userId: string, id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return BudgetModel.findOne({ _id: id, userId: new Types.ObjectId(userId) });
};

export const updateBudget = (userId: string, id: string, input: IUpdateBudget) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return BudgetModel.findOneAndUpdate(
    { _id: id, userId: new Types.ObjectId(userId) },
    input,
    { new: true },
  );
};

export const deleteBudget = (userId: string, id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return BudgetModel.findOneAndUpdate(
    { _id: id, userId: new Types.ObjectId(userId) },
    { deletedAt: new Date() },
  );
};

export const deleteAllBudgetsForUser = (userId: string) =>
  BudgetModel.updateMany({ userId: new Types.ObjectId(userId) }, { deletedAt: new Date() });
