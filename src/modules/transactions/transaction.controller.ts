import { Request, Response } from 'express';

import { ApiResponse } from '../../core/http/ApiResponse';
import { TransactionType } from '../../shared/constants';
import { requireUserId } from '../../shared/utils/requireUser';
import { transactionService } from './transaction.service';
import {
  ListTransactionsQuery,
  UpdateTransactionInput,
} from './transaction.types';

/** Parses a create body into the shared transaction fields (no `type`). */
export function parseCreateBody(body: Request['body']): {
  amount: number;
  category: string;
  note?: string;
  date: Date;
} {
  return {
    amount: Number(body.amount),
    category: String(body.category),
    note: typeof body.note === 'string' ? body.note : undefined,
    date: new Date(body.date),
  };
}

/** Parses an update body — only provided fields are included. */
export function parseUpdateBody(body: Request['body']): UpdateTransactionInput {
  const update: UpdateTransactionInput = {};
  if (body.amount !== undefined) update.amount = Number(body.amount);
  if (body.category !== undefined) update.category = String(body.category);
  if (body.note !== undefined) update.note = String(body.note);
  if (body.date !== undefined) update.date = new Date(body.date);
  return update;
}

/**
 * Parses raw request query params into a typed [ListTransactionsQuery].
 * Exported so the expenses/income controllers can reuse it (with `type` preset).
 */
export function parseListQuery(
  raw: Request['query'],
  forcedType?: TransactionType,
): ListTransactionsQuery {
  return {
    type: forcedType ?? (raw.type as TransactionType | undefined),
    category: asString(raw.category),
    search: asString(raw.search),
    from: asDate(raw.from),
    to: asDate(raw.to),
    sort: asString(raw.sort) ?? '-date',
    page: asNumber(raw.page),
    limit: asNumber(raw.limit),
  };
}

export const transactionController = {
  async list(req: Request, res: Response) {
    const result = await transactionService.list(
      requireUserId(req),
      parseListQuery(req.query),
    );
    ApiResponse.send(res, {
      data: result.items,
      meta: result.meta,
      message: 'Transactions fetched',
    });
  },

  async getById(req: Request, res: Response) {
    const tx = await transactionService.getById(
      requireUserId(req),
      req.params.id,
    );
    ApiResponse.send(res, { data: tx, message: 'Transaction fetched' });
  },
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
