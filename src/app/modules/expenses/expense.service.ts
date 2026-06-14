import { IListTransactionsQuery, IUpdateTransaction } from '../transactions/transaction.interface';
import {
  createTransactionToDB,
  updateTransactionToDB,
  deleteTransactionFromDB,
  getAllTransactionsFromDB,
} from '../transactions/transaction.service';
import { IExpenseDto } from './expense.interface';

export const createExpenseToDB = (userId: string, dto: IExpenseDto) =>
  createTransactionToDB(userId, { ...dto, type: 'expense' });

export const updateExpenseToDB = (userId: string, id: string, dto: IUpdateTransaction) =>
  updateTransactionToDB(userId, id, dto, 'expense');

export const deleteExpenseFromDB = (userId: string, id: string) =>
  deleteTransactionFromDB(userId, id, 'expense');

export const getAllExpensesFromDB = (userId: string, query: IListTransactionsQuery) =>
  getAllTransactionsFromDB(userId, { ...query, type: 'expense' });
