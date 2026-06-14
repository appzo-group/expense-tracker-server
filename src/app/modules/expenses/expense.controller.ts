import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import {
  parseCreateBody,
  parseListQuery,
  parseUpdateBody,
} from '../transactions';
import { ExpenseService } from './expense.service';

const createExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseService.createExpenseToDB(
    requireUserId(req),
    parseCreateBody(req.body),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Expense created successfully',
    data: result,
  });
});

const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseService.updateExpenseToDB(
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
});

const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  await ExpenseService.deleteExpenseFromDB(requireUserId(req), req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Expense deleted successfully',
    data: null,
  });
});

const getAllExpenses = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseService.getAllExpensesFromDB(
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
});

export const ExpenseController = {
  createExpense,
  updateExpense,
  deleteExpense,
  getAllExpenses,
};
