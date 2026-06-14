import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import sendResponse from '../../../shared/sendResponse';
import { TransactionType } from '../../../enums/transaction';
import {
  getCategoryBreakdownFromDB,
  getMonthlyAnalyticsFromDB,
  getWeeklyAnalyticsFromDB,
  getIncomeVsExpenseFromDB,
  getFinancialInsightsFromDB,
  getDashboardSummaryFromDB,
} from './analytics.service';

export const getCategoryBreakdown = async (req: Request, res: Response): Promise<void> => {
  const type = (req.query.type as TransactionType) ?? 'expense';
  const year = parseYear(req.query.year);
  const result = await getCategoryBreakdownFromDB(requireUserId(req), type, year);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category breakdown fetched successfully',
    data: result,
  });
};

export const getMonthlyAnalytics = async (req: Request, res: Response): Promise<void> => {
  const year = parseYear(req.query.year);
  const result = await getMonthlyAnalyticsFromDB(requireUserId(req), year);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Monthly analytics fetched successfully',
    data: result,
  });
};

export const getWeeklyAnalytics = async (req: Request, res: Response): Promise<void> => {
  const result = await getWeeklyAnalyticsFromDB(requireUserId(req));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Weekly analytics fetched successfully',
    data: result,
  });
};

export const getIncomeVsExpense = async (req: Request, res: Response): Promise<void> => {
  const from = parseDate(req.query.from);
  const to = parseDate(req.query.to);
  const result = await getIncomeVsExpenseFromDB(requireUserId(req), from, to);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Income vs expense fetched successfully',
    data: result,
  });
};

export const getFinancialInsights = async (req: Request, res: Response): Promise<void> => {
  const result = await getFinancialInsightsFromDB(requireUserId(req));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Financial insights fetched successfully',
    data: result,
  });
};

export const getDashboardSummary = async (req: Request, res: Response): Promise<void> => {
  const result = await getDashboardSummaryFromDB(requireUserId(req));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard summary fetched successfully',
    data: result,
  });
};

function parseYear(raw: unknown): number {
  const year = Number(raw);
  return Number.isInteger(year) && year > 1970 ? year : new Date().getFullYear();
}

function parseDate(raw: unknown): Date | undefined {
  if (typeof raw !== 'string') return undefined;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
