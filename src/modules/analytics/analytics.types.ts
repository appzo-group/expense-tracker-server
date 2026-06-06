import { PublicBudget } from '../budgets';
import { CategoryTotal, MonthlyTotal, PublicTransaction } from '../transactions';

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  recentTransactions: PublicTransaction[];
  budgetOverview: PublicBudget[];
}

export interface WeeklySummary {
  from: string;
  to: string;
  income: number;
  expense: number;
}

export interface FinancialInsights {
  topExpenseCategory: CategoryTotal | null;
  monthlyAverageExpense: number;
  savingsRate: number;
}

export type { CategoryTotal, MonthlyTotal };
