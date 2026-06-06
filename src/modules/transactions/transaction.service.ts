import { ApiError } from '../../core/http/ApiError';
import { TransactionType } from '../../shared/constants';
import { Paginated } from '../../shared/types/pagination.types';
import { buildMeta, parsePagination } from '../../shared/utils/pagination';
import { TransactionDocument } from './transaction.model';
import { transactionRepository } from './transaction.repository';
import {
  CategoryTotal,
  CreateTransactionInput,
  DateRange,
  ListTransactionsQuery,
  MonthlyTotal,
  PublicTransaction,
  UpdateTransactionInput,
} from './transaction.types';

/**
 * Owns the transaction domain. Other modules (expenses, income, budgets,
 * analytics, dashboard) compose these methods rather than touching the model.
 */
export const transactionService = {
  toPublic(doc: TransactionDocument): PublicTransaction {
    return doc.toJSON() as unknown as PublicTransaction;
  },

  async create(
    userId: string,
    input: CreateTransactionInput,
  ): Promise<PublicTransaction> {
    const doc = await transactionRepository.create(userId, input);
    return this.toPublic(doc);
  },

  async update(
    userId: string,
    id: string,
    input: UpdateTransactionInput,
    type?: TransactionType,
  ): Promise<PublicTransaction> {
    const doc = await transactionRepository.update(userId, id, input, type);
    if (!doc) throw ApiError.notFound('Transaction not found');
    return this.toPublic(doc);
  },

  async remove(
    userId: string,
    id: string,
    type?: TransactionType,
  ): Promise<void> {
    const doc = await transactionRepository.delete(userId, id, type);
    if (!doc) throw ApiError.notFound('Transaction not found');
  },

  async getById(userId: string, id: string): Promise<PublicTransaction> {
    const doc = await transactionRepository.findById(userId, id);
    if (!doc) throw ApiError.notFound('Transaction not found');
    return this.toPublic(doc);
  },

  async list(
    userId: string,
    query: ListTransactionsQuery,
  ): Promise<Paginated<PublicTransaction>> {
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

  async totals(
    userId: string,
    range: DateRange = {},
  ): Promise<{ income: number; expense: number; balance: number }> {
    const { income, expense } = await transactionRepository.totalsByType(
      userId,
      range,
    );
    return { income, expense, balance: income - expense };
  },

  byCategory(
    userId: string,
    type: TransactionType,
    range: DateRange = {},
  ): Promise<CategoryTotal[]> {
    return transactionRepository.groupByCategory(userId, type, range);
  },

  async monthly(userId: string, year: number): Promise<MonthlyTotal[]> {
    const rows = await transactionRepository.monthly(userId, year);
    const months: MonthlyTotal[] = Array.from({ length: 12 }, (_, i) => ({
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

  async recent(userId: string, limit: number): Promise<PublicTransaction[]> {
    const docs = await transactionRepository.recent(userId, limit);
    return docs.map((doc) => this.toPublic(doc));
  },

  spentForCategory(
    userId: string,
    category: string,
    range: DateRange = {},
  ): Promise<number> {
    return transactionRepository.spentForCategory(userId, category, range);
  },
};
