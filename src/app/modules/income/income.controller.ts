import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import sendResponse from '../../../shared/sendResponse';
import { parseCreateBody, parseListQuery, parseUpdateBody } from '../transactions';
import {
  createIncomeToDB,
  updateIncomeToDB,
  deleteIncomeFromDB,
  getAllIncomeFromDB,
} from './income.service';

export const createIncome = async (req: Request, res: Response): Promise<void> => {
  const result = await createIncomeToDB(requireUserId(req), parseCreateBody(req.body));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Income created successfully',
    data: result,
  });
};

export const updateIncome = async (req: Request, res: Response): Promise<void> => {
  const result = await updateIncomeToDB(
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
};

export const deleteIncome = async (req: Request, res: Response): Promise<void> => {
  await deleteIncomeFromDB(requireUserId(req), req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Income deleted successfully',
    data: null,
  });
};

export const getAllIncome = async (req: Request, res: Response): Promise<void> => {
  const result = await getAllIncomeFromDB(requireUserId(req), parseListQuery(req.query, 'income'));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Income fetched successfully',
    meta: result.meta,
    data: result.items,
  });
};
