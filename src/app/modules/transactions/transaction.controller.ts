import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import sendResponse from '../../../shared/sendResponse';
import { TransactionType } from '../../../enums/transaction';
import { IListTransactionsQuery, IUpdateTransaction } from './transaction.interface';
import { getAllTransactionsFromDB, getSingleTransactionFromDB } from './transaction.service';

export const parseCreateBody = (body: Request['body']): {
  amount: number;
  category: string;
  note?: string;
  date: Date;
} => ({
  amount: Number(body.amount),
  category: String(body.category),
  note: typeof body.note === 'string' ? body.note : undefined,
  date: new Date(body.date),
});

export const parseUpdateBody = (body: Request['body']): IUpdateTransaction => {
  const update: IUpdateTransaction = {};
  if (body.amount !== undefined) update.amount = Number(body.amount);
  if (body.category !== undefined) update.category = String(body.category);
  if (body.note !== undefined) update.note = String(body.note);
  if (body.date !== undefined) update.date = new Date(body.date);
  return update;
};

export const parseListQuery = (
  raw: Request['query'],
  forcedType?: TransactionType,
): IListTransactionsQuery => ({
  type: forcedType ?? (raw.type as TransactionType | undefined),
  category: asString(raw.category),
  search: asString(raw.search),
  from: asDate(raw.from),
  to: asDate(raw.to),
  sort: asString(raw.sort) ?? '-date',
  page: asNumber(raw.page),
  limit: asNumber(raw.limit),
});

export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
  const result = await getAllTransactionsFromDB(requireUserId(req), parseListQuery(req.query));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Transactions fetched successfully',
    meta: result.meta,
    data: result.items,
  });
};

export const getSingleTransaction = async (req: Request, res: Response): Promise<void> => {
  const result = await getSingleTransactionFromDB(requireUserId(req), req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Transaction fetched successfully',
    data: result,
  });
};

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function asDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
