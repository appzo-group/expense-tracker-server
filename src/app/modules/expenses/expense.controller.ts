import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import sendResponse from '../../../shared/sendResponse';
import { parseCreateBody, parseListQuery, parseUpdateBody } from '../transactions';
import {
  createExpenseToDB,
  updateExpenseToDB,
  deleteExpenseFromDB,
  getAllExpensesFromDB,
} from './expense.service';

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  const result = await createExpenseToDB(requireUserId(req), parseCreateBody(req.body));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Expense created successfully',
    data: result,
  });
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  const result = await updateExpenseToDB(
    requireUserId(req),
    req.params.id,
    parseUpdateBody(req.body),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Expense updated successfully',
    data: result,
  });
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  await deleteExpenseFromDB(requireUserId(req), req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Expense deleted successfully',
    data: null,
  });
};

export const getAllExpenses = async (req: Request, res: Response): Promise<void> => {
  const result = await getAllExpensesFromDB(
    requireUserId(req),
    parseListQuery(req.query, 'expense'),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Expenses fetched successfully',
    meta: result.meta,
    data: result.items,
  });
};
