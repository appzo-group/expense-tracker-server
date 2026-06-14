import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ICreateBudget, IUpdateBudget } from './budget.interface';
import { BudgetService } from './budget.service';

const getAllBudgets = catchAsync(async (req: Request, res: Response) => {
  const result = await BudgetService.getAllBudgetsFromDB(requireUserId(req));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Budgets fetched successfully',
    data: result,
  });
});

const createBudget = catchAsync(async (req: Request, res: Response) => {
  const input: ICreateBudget = {
    category: req.body.category,
    limit: Number(req.body.limit),
    period: req.body.period,
    startDate: new Date(req.body.startDate),
  };
  const result = await BudgetService.createBudgetToDB(requireUserId(req), input);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Budget created successfully',
    data: result,
  });
});

const updateBudget = catchAsync(async (req: Request, res: Response) => {
  const input: IUpdateBudget = {};
  if (req.body.category !== undefined) input.category = req.body.category;
  if (req.body.limit !== undefined) input.limit = Number(req.body.limit);
  if (req.body.period !== undefined) input.period = req.body.period;
  if (req.body.startDate !== undefined) input.startDate = new Date(req.body.startDate);

  const result = await BudgetService.updateBudgetToDB(
    requireUserId(req),
    req.params.id,
    input,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Budget updated successfully',
    data: result,
  });
});

const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  await BudgetService.deleteBudgetFromDB(requireUserId(req), req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Budget deleted successfully',
    data: null,
  });
});

export const BudgetController = {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};
