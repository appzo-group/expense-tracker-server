import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import sendResponse from '../../../shared/sendResponse';
import { ICreateBudget, IUpdateBudget } from './budget.interface';
import { getAllBudgetsFromDB, createBudgetToDB, updateBudgetToDB, deleteBudgetFromDB } from './budget.service';

export const getAllBudgets = async (req: Request, res: Response): Promise<void> => {
  const result = await getAllBudgetsFromDB(requireUserId(req));
  sendResponse(res, {
    success: true, statusCode: StatusCodes.OK, message: 'Budgets fetched successfully', data: result,
  });
};

export const createBudget = async (req: Request, res: Response): Promise<void> => {
  const input: ICreateBudget = {
    category: req.body.category,
    limit: Number(req.body.limit),
    period: req.body.period,
    startDate: new Date(req.body.startDate),
  };

  const result = await createBudgetToDB(requireUserId(req), input);

  sendResponse(res, {
    success: true, statusCode: StatusCodes.CREATED, message: 'Budget created successfully', data: result
  });
};

export const updateBudget = async (req: Request, res: Response): Promise<void> => {
  const input: IUpdateBudget = {};
  if (req.body.category !== undefined) input.category = req.body.category;
  if (req.body.limit !== undefined) input.limit = Number(req.body.limit);
  if (req.body.period !== undefined) input.period = req.body.period;
  if (req.body.startDate !== undefined) input.startDate = new Date(req.body.startDate);

  const result = await updateBudgetToDB(requireUserId(req), req.params.id, input);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Budget updated successfully',
    data: result,
  });
};

export const deleteBudget = async (req: Request, res: Response): Promise<void> => {
  await deleteBudgetFromDB(requireUserId(req), req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Budget deleted successfully',
    data: null,
  });
};
