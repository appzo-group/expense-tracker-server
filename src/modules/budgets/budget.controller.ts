import { Request, Response } from 'express';

import { ApiResponse } from '../../core/http/ApiResponse';
import { requireUserId } from '../../shared/utils/requireUser';
import { budgetService } from './budget.service';
import { CreateBudgetInput, UpdateBudgetInput } from './budget.types';

export const budgetController = {
  async list(req: Request, res: Response) {
    const budgets = await budgetService.list(requireUserId(req));
    ApiResponse.send(res, { data: budgets, message: 'Budgets fetched' });
  },

  async create(req: Request, res: Response) {
    const input: CreateBudgetInput = {
      category: req.body.category,
      limit: Number(req.body.limit),
      period: req.body.period,
      startDate: new Date(req.body.startDate),
    };
    const budget = await budgetService.create(requireUserId(req), input);
    ApiResponse.send(res, {
      data: budget,
      message: 'Budget created',
      statusCode: 201,
    });
  },

  async update(req: Request, res: Response) {
    const input: UpdateBudgetInput = {};
    if (req.body.category !== undefined) input.category = req.body.category;
    if (req.body.limit !== undefined) input.limit = Number(req.body.limit);
    if (req.body.period !== undefined) input.period = req.body.period;
    if (req.body.startDate !== undefined) {
      input.startDate = new Date(req.body.startDate);
    }
    const budget = await budgetService.update(
      requireUserId(req),
      req.params.id,
      input,
    );
    ApiResponse.send(res, { data: budget, message: 'Budget updated' });
  },

  async remove(req: Request, res: Response) {
    await budgetService.remove(requireUserId(req), req.params.id);
    ApiResponse.send(res, { data: null, message: 'Budget deleted' });
  },
};
