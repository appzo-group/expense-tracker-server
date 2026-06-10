import { FilterQuery, Types } from 'mongoose';

import { TransactionType } from '../../shared/constants';
import { TransactionDocument, TransactionModel } from './transaction.model';
import {
  CreateTransactionInput,
  DateRange,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from './transaction.types';

/** All Mongoose access for the transactions collection (CRUD + aggregation). */
export const transactionRepository = {
  create(userId: string, input: CreateTransactionInput) {
    return TransactionModel.create({
      userId: new Types.ObjectId(userId),
      ...input,
    });
  },

  findById(userId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return TransactionModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
  },

  async update(
    userId: string,
    id: string,
    input: UpdateTransactionInput,
    type?: TransactionType,
  ) {
    if (!Types.ObjectId.isValid(id)) return null;
    const filter: FilterQuery<TransactionDocument> = {
      _id: id,
      userId: new Types.ObjectId(userId),
    };
    if (type) filter.type = type;
    return TransactionModel.findOneAndUpdate(filter, input, { new: true });
  },

  /** Soft-delete: marks the transaction as deleted rather than removing it. */
  delete(userId: string, id: string, type?: TransactionType) {
    if (!Types.ObjectId.isValid(id)) return null;
    const filter: FilterQuery<TransactionDocument> = {
      _id: id,
      userId: new Types.ObjectId(userId),
    };
    if (type) filter.type = type;
    return TransactionModel.findOneAndUpdate(filter, { deletedAt: new Date() });
  },

  /** Soft-delete every transaction for a user (account deletion). */
  deleteAllForUser(userId: string) {
    return TransactionModel.updateMany(
      { userId: new Types.ObjectId(userId) },
      { deletedAt: new Date() },
    );
  },

  async list(userId: string, query: ListTransactionsQuery, skip: number, limit: number) {
    const filter = buildFilter(userId, query);
    const sort = parseSort(query.sort);
    const [items, total] = await Promise.all([
      TransactionModel.find(filter).sort(sort).skip(skip).limit(limit),
      TransactionModel.countDocuments(filter),
    ]);
    return { items, total };
  },

  recent(userId: string, limit: number) {
    return TransactionModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .limit(limit);
  },

  /** Sum of amounts grouped by type within a date range. */
  async totalsByType(userId: string, range: DateRange) {
    const rows = await TransactionModel.aggregate<{
      _id: TransactionType;
      total: number;
    }>([
      { $match: matchUserRange(userId, range) },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
    const totals = { income: 0, expense: 0 };
    for (const row of rows) totals[row._id] = row.total;
    return totals;
  },

  /** Sum grouped by category for a given type within a range. */
  async groupByCategory(
    userId: string,
    type: TransactionType,
    range: DateRange,
  ) {
    return TransactionModel.aggregate<{ category: string; total: number }>([
      { $match: { ...matchUserRange(userId, range), type } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } },
      { $sort: { total: -1 } },
    ]);
  },

  /** Monthly income+expense totals for a calendar year. */
  async monthly(userId: string, year: number) {
    return TransactionModel.aggregate<{
      month: number;
      type: TransactionType;
      total: number;
    }>([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: {
            $gte: new Date(Date.UTC(year, 0, 1)),
            $lte: new Date(Date.UTC(year, 11, 31, 23, 59, 59)),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          type: '$_id.type',
          total: 1,
        },
      },
    ]);
  },

  /** Total spent (expense) for one category within a range — used by budgets. */
  async spentForCategory(userId: string, category: string, range: DateRange) {
    const rows = await TransactionModel.aggregate<{ total: number }>([
      {
        $match: {
          ...matchUserRange(userId, range),
          type: 'expense',
          category,
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return rows[0]?.total ?? 0;
  },
};

function buildFilter(
  userId: string,
  query: ListTransactionsQuery,
): FilterQuery<TransactionDocument> {
  const filter: FilterQuery<TransactionDocument> = {
    userId: new Types.ObjectId(userId),
  };
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = query.from;
    if (query.to) filter.date.$lte = query.to;
  }
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ note: regex }, { category: regex }];
  }
  return filter;
}

function matchUserRange(userId: string, range: DateRange) {
  const match: FilterQuery<TransactionDocument> = {
    userId: new Types.ObjectId(userId),
  };
  if (range.from || range.to) {
    match.date = {};
    if (range.from) match.date.$gte = range.from;
    if (range.to) match.date.$lte = range.to;
  }
  return match;
}

function parseSort(sort?: string): Record<string, 1 | -1> {
  const allowed = new Set(['date', 'amount']);
  if (!sort) return { date: -1 };
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  if (!allowed.has(field)) return { date: -1 };
  return { [field]: desc ? -1 : 1 };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
