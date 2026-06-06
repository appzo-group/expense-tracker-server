/** Shared enums/constants used across modules. */

export const TRANSACTION_TYPES = ['expense', 'income'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const BUDGET_PERIODS = ['monthly', 'yearly'] as const;
export type BudgetPeriod = (typeof BUDGET_PERIODS)[number];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
] as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

/** How long a password-reset token stays valid. */
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
