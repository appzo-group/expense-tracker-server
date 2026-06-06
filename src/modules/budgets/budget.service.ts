import { ApiError } from '../../core/http/ApiError';
import { BudgetPeriod } from '../../shared/constants';
import { DateRange, transactionService } from '../transactions';
import { BudgetDocument } from './budget.model';
import { budgetRepository } from './budget.repository';
import {
  CreateBudgetInput,
  PublicBudget,
  UpdateBudgetInput,
} from './budget.types';

/**
 * Budgets with `spent` computed at read time from the transaction service for
 * the budget's current period (no stored/derived state to drift).
 */
export const budgetService = {
  async create(
    userId: string,
    input: CreateBudgetInput,
  ): Promise<PublicBudget> {
    const doc = await budgetRepository.create(userId, input);
    return this.withSpent(userId, doc);
  },

  async update(
    userId: string,
    id: string,
    input: UpdateBudgetInput,
  ): Promise<PublicBudget> {
    const doc = await budgetRepository.update(userId, id, input);
    if (!doc) throw ApiError.notFound('Budget not found');
    return this.withSpent(userId, doc);
  },

  async remove(userId: string, id: string): Promise<void> {
    const doc = await budgetRepository.delete(userId, id);
    if (!doc) throw ApiError.notFound('Budget not found');
  },

  async list(userId: string): Promise<PublicBudget[]> {
    const docs = await budgetRepository.findByUser(userId);
    return Promise.all(docs.map((doc) => this.withSpent(userId, doc)));
  },

  /** Attaches the current-period spend to a budget document. */
  async withSpent(
    userId: string,
    doc: BudgetDocument,
  ): Promise<PublicBudget> {
    const range = periodRange(doc.period);
    const spent = await transactionService.spentForCategory(
      userId,
      doc.category,
      range,
    );
    return { ...(doc.toJSON() as unknown as PublicBudget), spent };
  },
};

/** The current calendar window for a budget period. */
function periodRange(period: BudgetPeriod): DateRange {
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
