import { TransactionType } from '../../../enums/transaction';
import { BudgetService } from '../budgets';
import { ICategoryTotal, IDateRange, IMonthlyTotal, TransactionService } from '../transactions';
import {
  IDashboardSummary,
  IFinancialInsights,
  IWeeklySummary,
} from './analytics.interface';

const RECENT_LIMIT = 5;

/** Read-only reporting composed from the transaction + budget services. */
export const AnalyticsService = {
  getCategoryBreakdownFromDB(
    userId: string,
    type: TransactionType,
    year: number,
  ): Promise<ICategoryTotal[]> {
    return TransactionService.getByCategoryFromDB(userId, type, yearRange(year));
  },

  getMonthlyAnalyticsFromDB(userId: string, year: number): Promise<IMonthlyTotal[]> {
    return TransactionService.getMonthlyFromDB(userId, year);
  },

  async getIncomeVsExpenseFromDB(
    userId: string,
    from?: Date,
    to?: Date,
  ): Promise<{ income: number; expense: number }> {
    const { income, expense } = await TransactionService.getTotalsFromDB(userId, { from, to });
    return { income, expense };
  },

  async getWeeklyAnalyticsFromDB(userId: string): Promise<IWeeklySummary> {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
    const { income, expense } = await TransactionService.getTotalsFromDB(userId, { from, to });
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      income,
      expense,
    };
  },

  async getFinancialInsightsFromDB(userId: string): Promise<IFinancialInsights> {
    const year = new Date().getFullYear();
    const [categories, monthly, totals] = await Promise.all([
      TransactionService.getByCategoryFromDB(userId, 'expense', yearRange(year)),
      TransactionService.getMonthlyFromDB(userId, year),
      TransactionService.getTotalsFromDB(userId),
    ]);

    const monthsWithExpense = monthly.filter((m) => m.expense > 0);
    const monthlyAverageExpense =
      monthsWithExpense.length > 0
        ? monthsWithExpense.reduce((sum, m) => sum + m.expense, 0) / monthsWithExpense.length
        : 0;

    const savingsRate =
      totals.income > 0 ? (totals.income - totals.expense) / totals.income : 0;

    return {
      topExpenseCategory: categories[0] ?? null,
      monthlyAverageExpense,
      savingsRate,
    };
  },

  async getDashboardSummaryFromDB(userId: string): Promise<IDashboardSummary> {
    const [totals, recentTransactions, budgetOverview] = await Promise.all([
      TransactionService.getTotalsFromDB(userId),
      TransactionService.getRecentFromDB(userId, RECENT_LIMIT),
      BudgetService.getAllBudgetsFromDB(userId),
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

function yearRange(year: number): IDateRange {
  return {
    from: new Date(year, 0, 1),
    to: new Date(year, 11, 31, 23, 59, 59, 999),
  };
}
