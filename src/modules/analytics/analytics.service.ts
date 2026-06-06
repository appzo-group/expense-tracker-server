import { TransactionType } from '../../shared/constants';
import { budgetService } from '../budgets';
import { CategoryTotal, MonthlyTotal, transactionService } from '../transactions';
import {
  DashboardSummary,
  FinancialInsights,
  WeeklySummary,
} from './analytics.types';

const RECENT_LIMIT = 5;

/** Read-only reporting composed from the transaction + budget services. */
export const analyticsService = {
  byCategory(
    userId: string,
    type: TransactionType,
    year: number,
  ): Promise<CategoryTotal[]> {
    return transactionService.byCategory(userId, type, yearRange(year));
  },

  monthly(userId: string, year: number): Promise<MonthlyTotal[]> {
    return transactionService.monthly(userId, year);
  },

  incomeVsExpense(
    userId: string,
    from?: Date,
    to?: Date,
  ): Promise<{ income: number; expense: number }> {
    return transactionService
      .totals(userId, { from, to })
      .then(({ income, expense }) => ({ income, expense }));
  },

  async weekly(userId: string): Promise<WeeklySummary> {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
    const { income, expense } = await transactionService.totals(userId, {
      from,
      to,
    });
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      income,
      expense,
    };
  },

  async insights(userId: string): Promise<FinancialInsights> {
    const year = new Date().getFullYear();
    const [categories, monthly, totals] = await Promise.all([
      transactionService.byCategory(userId, 'expense', yearRange(year)),
      transactionService.monthly(userId, year),
      transactionService.totals(userId),
    ]);

    const monthsWithExpense = monthly.filter((m) => m.expense > 0);
    const monthlyAverageExpense =
      monthsWithExpense.length > 0
        ? monthsWithExpense.reduce((sum, m) => sum + m.expense, 0) /
          monthsWithExpense.length
        : 0;

    const savingsRate =
      totals.income > 0
        ? (totals.income - totals.expense) / totals.income
        : 0;

    return {
      topExpenseCategory: categories[0] ?? null,
      monthlyAverageExpense,
      savingsRate,
    };
  },

  async dashboardSummary(userId: string): Promise<DashboardSummary> {
    const [totals, recentTransactions, budgetOverview] = await Promise.all([
      transactionService.totals(userId),
      transactionService.recent(userId, RECENT_LIMIT),
      budgetService.list(userId),
    ]);

    return {
      totalBalance: totals.balance,
      totalIncome: totals.income,
      totalExpenses: totals.expense,
      recentTransactions,
      budgetOverview,
    };
  },
};

function yearRange(year: number) {
  return {
    from: new Date(year, 0, 1),
    to: new Date(year, 11, 31, 23, 59, 59, 999),
  };
}
