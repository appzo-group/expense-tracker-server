import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TransactionType } from '../../../enums/transaction';
import { AnalyticsService } from './analytics.service';

const getCategoryBreakdown = catchAsync(async (req: Request, res: Response) => {
  const type = (req.query.type as TransactionType) ?? 'expense';
  const year = parseYear(req.query.year);
  const result = await AnalyticsService.getCategoryBreakdownFromDB(
    requireUserId(req),
    type,
    year,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category breakdown fetched successfully',
    data: result,
  });
});

const getMonthlyAnalytics = catchAsync(async (req: Request, res: Response) => {
  const year = parseYear(req.query.year);
  const result = await AnalyticsService.getMonthlyAnalyticsFromDB(requireUserId(req), year);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Monthly analytics fetched successfully',
    data: result,
  });
});

const getWeeklyAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getWeeklyAnalyticsFromDB(requireUserId(req));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Weekly analytics fetched successfully',
    data: result,
  });
});

const getIncomeVsExpense = catchAsync(async (req: Request, res: Response) => {
  const from = parseDate(req.query.from);
  const to = parseDate(req.query.to);
  const result = await AnalyticsService.getIncomeVsExpenseFromDB(
    requireUserId(req),
    from,
    to,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Income vs expense fetched successfully',
    data: result,
  });
});

const getFinancialInsights = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getFinancialInsightsFromDB(requireUserId(req));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Financial insights fetched successfully',
    data: result,
  });
});

const getDashboardSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getDashboardSummaryFromDB(requireUserId(req));
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard summary fetched successfully',
    data: result,
  });
});

export const AnalyticsController = {
  getCategoryBreakdown,
  getMonthlyAnalytics,
  getWeeklyAnalytics,
  getIncomeVsExpense,
  getFinancialInsights,
  getDashboardSummary,
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
