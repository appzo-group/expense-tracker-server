import { TransactionType } from '../../../enums/transaction';

export interface ICreateTransaction {
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: Date;
}

export interface IUpdateTransaction {
  amount?: number;
  category?: string;
  note?: string;
  date?: Date;
}

export interface IListTransactionsQuery {
  type?: TransactionType;
  category?: string;
  search?: string;
  from?: Date;
  to?: Date;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface IDateRange {
  from?: Date;
  to?: Date;
}

export interface ICategoryTotal {
  category: string;
  total: number;
}

export interface IMonthlyTotal {
  month: number;
  income: number;
  expense: number;
}

export interface IPublicTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string;
}
