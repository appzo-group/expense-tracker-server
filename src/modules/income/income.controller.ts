import { Request, Response } from 'express';

import { ApiResponse } from '../../core/http/ApiResponse';
import { requireUserId } from '../../shared/utils/requireUser';
import {
  parseCreateBody,
  parseListQuery,
  parseUpdateBody,
} from '../transactions';
import { incomeService } from './income.service';

export const incomeController = {
  async create(req: Request, res: Response) {
    const income = await incomeService.create(
      requireUserId(req),
      parseCreateBody(req.body),
    );
    ApiResponse.send(res, {
      data: income,
      message: 'Income created',
      statusCode: 201,
    });
  },

  async update(req: Request, res: Response) {
    const income = await incomeService.update(
      requireUserId(req),
      req.params.id,
      parseUpdateBody(req.body),
    );
    ApiResponse.send(res, { data: income, message: 'Income updated' });
  },

  async remove(req: Request, res: Response) {
    await incomeService.remove(requireUserId(req), req.params.id);
    ApiResponse.send(res, { data: null, message: 'Income deleted' });
  },

  async list(req: Request, res: Response) {
    const result = await incomeService.list(
      requireUserId(req),
      parseListQuery(req.query, 'income'),
    );
    ApiResponse.send(res, {
      data: result.items,
      meta: result.meta,
      message: 'Income fetched',
    });
  },
};
