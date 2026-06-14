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
import { IncomeService } from './income.service';

const createIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await IncomeService.createIncomeToDB(
    requireUserId(req),
    parseCreateBody(req.body),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Income created successfully',
    data: result,
  });
});

const updateIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await IncomeService.updateIncomeToDB(
    requireUserId(req),
    req.params.id,
    parseUpdateBody(req.body),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Income updated successfully',
    data: result,
  });
});

const deleteIncome = catchAsync(async (req: Request, res: Response) => {
  await IncomeService.deleteIncomeFromDB(requireUserId(req), req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Income deleted successfully',
    data: null,
  });
});

const getAllIncome = catchAsync(async (req: Request, res: Response) => {
  const result = await IncomeService.getAllIncomeFromDB(
    requireUserId(req),
    parseListQuery(req.query, 'income'),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Income fetched successfully',
    meta: result.meta,
    data: result.items,
  });
});

export const IncomeController = {
  createIncome,
  updateIncome,
  deleteIncome,
  getAllIncome,
};
