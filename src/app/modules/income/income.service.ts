import { IListTransactionsQuery, IUpdateTransaction } from '../transactions/transaction.interface';
import {
  createTransactionToDB,
  updateTransactionToDB,
  deleteTransactionFromDB,
  getAllTransactionsFromDB,
} from '../transactions/transaction.service';
import { IIncomeDto } from './income.interface';

export const createIncomeToDB = (userId: string, dto: IIncomeDto) =>
  createTransactionToDB(userId, { ...dto, type: 'income' });

export const updateIncomeToDB = (userId: string, id: string, dto: IUpdateTransaction) =>
  updateTransactionToDB(userId, id, dto, 'income');

export const deleteIncomeFromDB = (userId: string, id: string) =>
  deleteTransactionFromDB(userId, id, 'income');

export const getAllIncomeFromDB = (userId: string, query: IListTransactionsQuery) =>
  getAllTransactionsFromDB(userId, { ...query, type: 'income' });
