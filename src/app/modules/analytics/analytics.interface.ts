import { IPublicBudget } from '../budgets/budget.interface';
import { ICategoryTotal, IMonthlyTotal, IPublicTransaction } from '../transactions/transaction.interface';

export interface IDashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  recentTransactions: IPublicTransaction[];
  budgetOverview: IPublicBudget[];
}

export interface IWeeklySummary {
  from: string;
  to: string;
  income: number;
  expense: number;
}

export interface IFinancialInsights {
  topExpenseCategory: ICategoryTotal | null;
  monthlyAverageExpense: number;
  savingsRate: number;
}

export type { ICategoryTotal, IMonthlyTotal };
