import { TransactionType } from '../../../enums/transaction';
import { getAllBudgetsFromDB } from '../budgets';
import {
  getByCategoryFromDB,
  getMonthlyFromDB,
  getTotalsFromDB,
  getRecentFromDB,
  ICategoryTotal,
  IDateRange,
  IMonthlyTotal,
} from '../transactions';
import { IDashboardSummary, IFinancialInsights, IWeeklySummary } from './analytics.interface';

const RECENT_LIMIT = 5;

export const getCategoryBreakdownFromDB = (
  userId: string,
  type: TransactionType,
  year: number,
): Promise<ICategoryTotal[]> => getByCategoryFromDB(userId, type, yearRange(year));

export const getMonthlyAnalyticsFromDB = (
  userId: string,
  year: number,
): Promise<IMonthlyTotal[]> => getMonthlyFromDB(userId, year);

export const getIncomeVsExpenseFromDB = async (
  userId: string,
  from?: Date,
  to?: Date,
): Promise<{ income: number; expense: number }> => {
  const { income, expense } = await getTotalsFromDB(userId, { from, to });
  return { income, expense };
};

export const getWeeklyAnalyticsFromDB = async (userId: string): Promise<IWeeklySummary> => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  from.setHours(0, 0, 0, 0);
  const { income, expense } = await getTotalsFromDB(userId, { from, to });
  return { from: from.toISOString(), to: to.toISOString(), income, expense };
};

export const getFinancialInsightsFromDB = async (userId: string): Promise<IFinancialInsights> => {
  const year = new Date().getFullYear();
  const [categories, monthly, totals] = await Promise.all([
    getByCategoryFromDB(userId, 'expense', yearRange(year)),
    getMonthlyFromDB(userId, year),
    getTotalsFromDB(userId),
  ]);

  const monthsWithExpense = monthly.filter((m) => m.expense > 0);
  const monthlyAverageExpense =
    monthsWithExpense.length > 0
      ? monthsWithExpense.reduce((sum, m) => sum + m.expense, 0) / monthsWithExpense.length
      : 0;

  const savingsRate = totals.income > 0 ? (totals.income - totals.expense) / totals.income : 0;

  return {
    topExpenseCategory: categories[0] ?? null,
    monthlyAverageExpense,
    savingsRate,
  };
};

export const getDashboardSummaryFromDB = async (userId: string): Promise<IDashboardSummary> => {
  const [totals, recentTransactions, budgetOverview] = await Promise.all([
    getTotalsFromDB(userId),
    getRecentFromDB(userId, RECENT_LIMIT),
    getAllBudgetsFromDB(userId),
  ]);

  return {
    totalBalance: totals.balance,
    totalIncome: totals.income,
    totalExpenses: totals.expense,
    recentTransactions,
    budgetOverview,
  };
};

function yearRange(year: number): IDateRange {
  return {
    from: new Date(year, 0, 1),
    to: new Date(year, 11, 31, 23, 59, 59, 999),
  };
}
