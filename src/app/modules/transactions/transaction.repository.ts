import { FilterQuery, Types } from 'mongoose';

import { TransactionType } from '../../../enums/transaction';
import {
  ICreateTransaction,
  IDateRange,
  IListTransactionsQuery,
  ITransaction,
  IUpdateTransaction,
} from './transaction.interface';
import { TransactionModel } from './transaction.model';

export const createTransaction = (userId: string, input: ICreateTransaction) =>
  TransactionModel.create({ userId: new Types.ObjectId(userId), ...input });

export const findTransactionById = (userId: string, id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return TransactionModel.findOne({ _id: id, userId: new Types.ObjectId(userId) });
};

export const updateTransaction = async (
  userId: string,
  id: string,
  input: IUpdateTransaction,
  type?: TransactionType,
) => {
  if (!Types.ObjectId.isValid(id)) return null;
  const filter: FilterQuery<ITransaction> = { _id: id, userId: new Types.ObjectId(userId) };
  if (type) filter.type = type;
  return TransactionModel.findOneAndUpdate(filter, input, { new: true });
};

export const deleteTransaction = (userId: string, id: string, type?: TransactionType) => {
  if (!Types.ObjectId.isValid(id)) return null;
  const filter: FilterQuery<ITransaction> = { _id: id, userId: new Types.ObjectId(userId) };
  if (type) filter.type = type;
  return TransactionModel.findOneAndUpdate(filter, { deletedAt: new Date() });
};

export const deleteAllTransactionsForUser = (userId: string) =>
  TransactionModel.updateMany({ userId: new Types.ObjectId(userId) }, { deletedAt: new Date() });

export const listTransactions = async (
  userId: string,
  query: IListTransactionsQuery,
  skip: number,
  limit: number,
) => {
  const filter = buildFilter(userId, query);
  const sort = parseSort(query.sort);
  const [items, total] = await Promise.all([
    TransactionModel.find(filter).sort(sort).skip(skip).limit(limit),
    TransactionModel.countDocuments(filter),
  ]);
  return { items, total };
};

export const recentTransactions = (userId: string, limit: number) =>
  TransactionModel.find({ userId: new Types.ObjectId(userId) }).sort({ date: -1 }).limit(limit);

export const totalsByType = async (userId: string, range: IDateRange) => {
  const rows = await TransactionModel.aggregate<{ _id: TransactionType; total: number }>([
    { $match: matchUserRange(userId, range) },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);
  const totals = { income: 0, expense: 0 };
  for (const row of rows) totals[row._id] = row.total;
  return totals;
};

export const groupByCategory = (userId: string, type: TransactionType, range: IDateRange) =>
  TransactionModel.aggregate<{ category: string; total: number }>([
    { $match: { ...matchUserRange(userId, range), type } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $project: { _id: 0, category: '$_id', total: 1 } },
    { $sort: { total: -1 } },
  ]);

export const monthlyTotals = (userId: string, year: number) =>
  TransactionModel.aggregate<{ month: number; type: TransactionType; total: number }>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        date: {
          $gte: new Date(Date.UTC(year, 0, 1)),
          $lte: new Date(Date.UTC(year, 11, 31, 23, 59, 59)),
        },
      },
    },
    { $group: { _id: { month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
    { $project: { _id: 0, month: '$_id.month', type: '$_id.type', total: 1 } },
  ]);

export const spentForCategory = async (userId: string, category: string, range: IDateRange) => {
  const rows = await TransactionModel.aggregate<{ total: number }>([
    { $match: { ...matchUserRange(userId, range), type: 'expense', category } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return rows[0]?.total ?? 0;
};

function buildFilter(userId: string, query: IListTransactionsQuery): FilterQuery<ITransaction> {
  const filter: FilterQuery<ITransaction> = { userId: new Types.ObjectId(userId) };
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

function matchUserRange(userId: string, range: IDateRange): FilterQuery<ITransaction> {
  const match: FilterQuery<ITransaction> = { userId: new Types.ObjectId(userId) };
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
