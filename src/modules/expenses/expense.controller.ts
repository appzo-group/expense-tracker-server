import { Request, Response } from 'express';

import { ApiResponse } from '../../core/http/ApiResponse';
import { requireUserId } from '../../shared/utils/requireUser';
import {
  parseCreateBody,
  parseListQuery,
  parseUpdateBody,
} from '../transactions';
import { expenseService } from './expense.service';

export const expenseController = {
  async create(req: Request, res: Response) {
    const expense = await expenseService.create(
      requireUserId(req),
      parseCreateBody(req.body),
    );
    ApiResponse.send(res, {
      data: expense,
      message: 'Expense created',
      statusCode: 201,
    });
  },

  async update(req: Request, res: Response) {
    const expense = await expenseService.update(
      requireUserId(req),
      req.params.id,
      parseUpdateBody(req.body),
    );
    ApiResponse.send(res, { data: expense, message: 'Expense updated' });
  },

  async remove(req: Request, res: Response) {
    await expenseService.remove(requireUserId(req), req.params.id);
    ApiResponse.send(res, { data: null, message: 'Expense deleted' });
  },

  async list(req: Request, res: Response) {
    const result = await expenseService.list(
      requireUserId(req),
      parseListQuery(req.query, 'expense'),
    );
    ApiResponse.send(res, {
      data: result.items,
      meta: result.meta,
      message: 'Expenses fetched',
    });
  },
};
