import { buildMeta, parsePagination } from '../../../helpers/pagination';
import { TransactionType } from '../../../enums/transaction';
import { IPaginated } from '../../../types/pagination.types';
import ApiError from '../../errors/ApiErrors';
import {
  createTransaction,
  findTransactionById,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactionsForUser,
  listTransactions,
  recentTransactions,
  totalsByType,
  groupByCategory,
  monthlyTotals,
  spentForCategory,
} from './transaction.repository';
import {
  ICategoryTotal,
  ICreateTransaction,
  IDateRange,
  IListTransactionsQuery,
  IMonthlyTotal,
  IPublicTransaction,
  IUpdateTransaction,
} from './transaction.interface';

export const toPublic = (doc: any): IPublicTransaction => doc

export const createTransactionToDB = async (
  userId: string,
  input: ICreateTransaction,
): Promise<IPublicTransaction> => {
  const doc = await createTransaction(userId, input);
  return toPublic(doc);
};

export const updateTransactionToDB = async (
  userId: string,
  id: string,
  input: IUpdateTransaction,
  type?: TransactionType,
): Promise<IPublicTransaction> => {
  const doc = await updateTransaction(userId, id, input, type);
  if (!doc) throw new ApiError(404, 'Transaction not found');
  return toPublic(doc);
};

export const deleteTransactionFromDB = async (
  userId: string,
  id: string,
  type?: TransactionType,
): Promise<void> => {
  const doc = await deleteTransaction(userId, id, type);
  if (!doc) throw new ApiError(404, 'Transaction not found');
};

export const deleteAllForUser = async (userId: string): Promise<void> => {
  await deleteAllTransactionsForUser(userId);
};

export const getSingleTransactionFromDB = async (
  userId: string,
  id: string,
): Promise<IPublicTransaction> => {
  const doc = await findTransactionById(userId, id);
  if (!doc) throw new ApiError(404, 'Transaction not found');
  return toPublic(doc);
};

export const getAllTransactionsFromDB = async (
  userId: string,
  query: IListTransactionsQuery,
): Promise<IPaginated<IPublicTransaction>> => {
  const pagination = parsePagination(query);
  const { items, total } = await listTransactions(userId, query, pagination.skip, pagination.limit);
  return {
    items: items.map(toPublic),
    meta: buildMeta(total, pagination),
  };
};

export const getTotalsFromDB = async (
  userId: string,
  range: IDateRange = {},
): Promise<{ income: number; expense: number; balance: number }> => {
  const { income, expense } = await totalsByType(userId, range);
  return { income, expense, balance: income - expense };
};

export const getByCategoryFromDB = (
  userId: string,
  type: TransactionType,
  range: IDateRange = {},
): Promise<ICategoryTotal[]> => groupByCategory(userId, type, range);

export const getMonthlyFromDB = async (userId: string, year: number): Promise<IMonthlyTotal[]> => {
  const rows = await monthlyTotals(userId, year);
  const months: IMonthlyTotal[] = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0,
  }));
  for (const row of rows) {
    const target = months[row.month - 1];
    if (target) target[row.type] = row.total;
  }
  return months;
};

export const getRecentFromDB = async (
  userId: string,
  limit: number,
): Promise<IPublicTransaction[]> => {
  const docs = await recentTransactions(userId, limit);
  return docs.map(toPublic);
};

export const getSpentForCategoryFromDB = (
  userId: string,
  category: string,
  range: IDateRange = {},
): Promise<number> => spentForCategory(userId, category, range);
