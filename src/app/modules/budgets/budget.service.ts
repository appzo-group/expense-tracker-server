import { BudgetPeriod } from '../../../enums/budget';
import ApiError from '../../errors/ApiErrors';
import { getSpentForCategoryFromDB, IDateRange } from '../transactions';
import { ICreateBudget, IPublicBudget, IUpdateBudget } from './budget.interface';
import { createBudget, findBudgetsByUser, updateBudget, deleteBudget, deleteAllBudgetsForUser, findBudgetById } from './budget.repository';

export const withSpent = async (userId: string, doc: any): Promise<IPublicBudget> => {
  const range = periodRange(doc.period);
  const spent = await getSpentForCategoryFromDB(userId, doc.category, range);
  return { ...doc.toJSON(), spent };
};

export const createBudgetToDB = async (userId: string, input: ICreateBudget): Promise<IPublicBudget> => {
  const doc = await createBudget(userId, input);
  return withSpent(userId, doc);
};

export const updateBudgetToDB = async (userId: string, id: string, input: IUpdateBudget): Promise<IPublicBudget> => {
  const doc = await updateBudget(userId, id, input);
  if (!doc) throw new ApiError(404, 'Budget not found');
  return withSpent(userId, doc);
};

export const deleteBudgetFromDB = async (userId: string, id: string): Promise<void> => {
  const doc = await deleteBudget(userId, id);
  if (!doc) throw new ApiError(404, 'Budget not found');
};

export const deleteAllForUser = async (userId: string): Promise<void> => {
  await deleteAllBudgetsForUser(userId);
};

export const getAllBudgetsFromDB = async (userId: string): Promise<IPublicBudget[]> => {
  const docs = await findBudgetsByUser(userId);
  return Promise.all(docs.map((doc) => withSpent(userId, doc)));
};
export const getBudgetsFromDB = async (userId: string, id: string): Promise<any> => {
  const budget = await findBudgetById(userId, id);
  return budget;
};

function periodRange(period: BudgetPeriod): IDateRange {
  const now = new Date();

  if (period === 'yearly') {
    return { from: new Date(now.getFullYear(), 0, 1), to: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999), };
  }

  return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999), };
}
