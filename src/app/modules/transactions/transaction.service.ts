import { buildMeta, parsePagination } from '../../../helpers/pagination';
import { TransactionType } from '../../../enums/transaction';
import { IPaginated } from '../../../types/pagination.types';
import ApiError from '../../errors/ApiErrors';
import { ITransactionDocument } from './transaction.model';
import { transactionRepository } from './transaction.repository';
import {
  ICategoryTotal,
  ICreateTransaction,
  IDateRange,
  IListTransactionsQuery,
  IMonthlyTotal,
  IPublicTransaction,
  IUpdateTransaction,
} from './transaction.interface';

/**
 * Owns the transaction domain. Other modules (expenses, income, budgets,
 * analytics, dashboard) compose these methods rather than touching the model.
 */
export const TransactionService = {
  toPublic(doc: ITransactionDocument): IPublicTransaction {
    return doc.toJSON() as unknown as IPublicTransaction;
  },

  async createTransactionToDB(
    userId: string,
    input: ICreateTransaction,
  ): Promise<IPublicTransaction> {
    const doc = await transactionRepository.create(userId, input);
    return this.toPublic(doc);
  },

  async updateTransactionToDB(
    userId: string,
    id: string,
    input: IUpdateTransaction,
    type?: TransactionType,
  ): Promise<IPublicTransaction> {
    const doc = await transactionRepository.update(userId, id, input, type);
    if (!doc) throw new ApiError(404, 'Transaction not found');
    return this.toPublic(doc);
  },

  async deleteTransactionFromDB(
    userId: string,
    id: string,
    type?: TransactionType,
  ): Promise<void> {
    const doc = await transactionRepository.delete(userId, id, type);
    if (!doc) throw new ApiError(404, 'Transaction not found');
  },

  async deleteAllForUser(userId: string): Promise<void> {
    await transactionRepository.deleteAllForUser(userId);
  },

  async getSingleTransactionFromDB(
    userId: string,
    id: string,
  ): Promise<IPublicTransaction> {
    const doc = await transactionRepository.findById(userId, id);
    if (!doc) throw new ApiError(404, 'Transaction not found');
    return this.toPublic(doc);
  },

  async getAllTransactionsFromDB(
    userId: string,
    query: IListTransactionsQuery,
  ): Promise<IPaginated<IPublicTransaction>> {
    const pagination = parsePagination(query);
    const { items, total } = await transactionRepository.list(
      userId,
      query,
      pagination.skip,
      pagination.limit,
    );
    return {
      items: items.map((doc) => this.toPublic(doc)),
      meta: buildMeta(total, pagination),
    };
  },

  async getTotalsFromDB(
    userId: string,
    range: IDateRange = {},
  ): Promise<{ income: number; expense: number; balance: number }> {
    const { income, expense } = await transactionRepository.totalsByType(userId, range);
    return { income, expense, balance: income - expense };
  },

  getByCategoryFromDB(
    userId: string,
    type: TransactionType,
    range: IDateRange = {},
  ): Promise<ICategoryTotal[]> {
    return transactionRepository.groupByCategory(userId, type, range);
  },

  async getMonthlyFromDB(userId: string, year: number): Promise<IMonthlyTotal[]> {
    const rows = await transactionRepository.monthly(userId, year);
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
  },

  async getRecentFromDB(userId: string, limit: number): Promise<IPublicTransaction[]> {
    const docs = await transactionRepository.recent(userId, limit);
    return docs.map((doc) => this.toPublic(doc));
  },

  getSpentForCategoryFromDB(
    userId: string,
    category: string,
    range: IDateRange = {},
  ): Promise<number> {
    return transactionRepository.spentForCategory(userId, category, range);
  },
};
