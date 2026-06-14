import { BudgetPeriod } from '../../../enums/budget';
import ApiError from '../../errors/ApiErrors';
import { IDateRange, TransactionService } from '../transactions';
import { ICreateBudget, IPublicBudget, IUpdateBudget } from './budget.interface';
import { IBudgetDocument } from './budget.model';
import { budgetRepository } from './budget.repository';

/**
 * Budgets with `spent` computed at read time from the transaction service for
 * the budget's current period (no stored/derived state to drift).
 */
export const BudgetService = {
  async createBudgetToDB(userId: string, input: ICreateBudget): Promise<IPublicBudget> {
    const doc = await budgetRepository.create(userId, input);
    return this.withSpent(userId, doc);
  },

  async updateBudgetToDB(
    userId: string,
    id: string,
    input: IUpdateBudget,
  ): Promise<IPublicBudget> {
    const doc = await budgetRepository.update(userId, id, input);
    if (!doc) throw new ApiError(404, 'Budget not found');
    return this.withSpent(userId, doc);
  },

  async deleteBudgetFromDB(userId: string, id: string): Promise<void> {
    const doc = await budgetRepository.delete(userId, id);
    if (!doc) throw new ApiError(404, 'Budget not found');
  },

  async deleteAllForUser(userId: string): Promise<void> {
    await budgetRepository.deleteAllForUser(userId);
  },

  async getAllBudgetsFromDB(userId: string): Promise<IPublicBudget[]> {
    const docs = await budgetRepository.findByUser(userId);
    return Promise.all(docs.map((doc) => this.withSpent(userId, doc)));
  },

  /** Attaches the current-period spend to a budget document. */
  async withSpent(userId: string, doc: IBudgetDocument): Promise<IPublicBudget> {
    const range = periodRange(doc.period);
    const spent = await TransactionService.getSpentForCategoryFromDB(
      userId,
      doc.category,
      range,
    );
    return { ...(doc.toJSON() as unknown as IPublicBudget), spent };
  },
};

/** The current calendar window for a budget period. */
function periodRange(period: BudgetPeriod): IDateRange {
  const now = new Date();
  if (period === 'yearly') {
    return {
      from: new Date(now.getFullYear(), 0, 1),
      to: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
    };
  }
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}
