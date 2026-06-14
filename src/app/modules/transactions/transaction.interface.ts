import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { TransactionType } from '../../../enums/transaction';

export interface TransactionInterface {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ITransaction = HydratedDocument<TransactionInterface>;

export type IPublicTransaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string;
};

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
