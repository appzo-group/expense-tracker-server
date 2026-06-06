import { TransactionType } from '../../shared/constants';

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: Date;
}

export interface UpdateTransactionInput {
  amount?: number;
  category?: string;
  note?: string;
  date?: Date;
}

export interface ListTransactionsQuery {
  type?: TransactionType;
  category?: string;
  search?: string;
  from?: Date;
  to?: Date;
  sort?: string; // e.g. '-date', 'amount'
  page?: number;
  limit?: number;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface MonthlyTotal {
  month: number;
  income: number;
  expense: number;
}

export interface PublicTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string;
}
