import { Request, Response } from 'express';

import { ApiResponse } from '../../core/http/ApiResponse';
import { TransactionType } from '../../shared/constants';
import { requireUserId } from '../../shared/utils/requireUser';
import { analyticsService } from './analytics.service';

export const analyticsController = {
  async byCategory(req: Request, res: Response) {
    const type = (req.query.type as TransactionType) ?? 'expense';
    const year = parseYear(req.query.year);
    const data = await analyticsService.byCategory(
      requireUserId(req),
      type,
      year,
    );
    ApiResponse.send(res, { data, message: 'Category breakdown fetched' });
  },

  async monthly(req: Request, res: Response) {
    const year = parseYear(req.query.year);
    const data = await analyticsService.monthly(requireUserId(req), year);
    ApiResponse.send(res, { data, message: 'Monthly analytics fetched' });
  },

  async weekly(req: Request, res: Response) {
    const data = await analyticsService.weekly(requireUserId(req));
    ApiResponse.send(res, { data, message: 'Weekly analytics fetched' });
  },

  async incomeVsExpense(req: Request, res: Response) {
    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to);
    const data = await analyticsService.incomeVsExpense(
      requireUserId(req),
      from,
      to,
    );
    ApiResponse.send(res, { data, message: 'Income vs expense fetched' });
  },

  async insights(req: Request, res: Response) {
    const data = await analyticsService.insights(requireUserId(req));
    ApiResponse.send(res, { data, message: 'Insights fetched' });
  },

  async dashboardSummary(req: Request, res: Response) {
    const data = await analyticsService.dashboardSummary(requireUserId(req));
    ApiResponse.send(res, { data, message: 'Dashboard summary fetched' });
  },
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
