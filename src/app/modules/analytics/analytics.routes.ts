import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../../shared/catchAsync';
import {
  getCategoryBreakdown,
  getMonthlyAnalytics,
  getWeeklyAnalytics,
  getIncomeVsExpense,
  getFinancialInsights,
  getDashboardSummary,
} from './analytics.controller';
import {
  categoryBreakdownZodSchema,
  monthlyZodSchema,
  incomeVsExpenseZodSchema,
} from './analytics.validation';

const router = Router();
router.use(auth());

router.get('/by-category', validateRequest(categoryBreakdownZodSchema), catchAsync(getCategoryBreakdown));
router.get('/monthly', validateRequest(monthlyZodSchema), catchAsync(getMonthlyAnalytics));
router.get('/weekly', catchAsync(getWeeklyAnalytics));
router.get('/income-vs-expense', validateRequest(incomeVsExpenseZodSchema), catchAsync(getIncomeVsExpense));
router.get('/insights', catchAsync(getFinancialInsights));

export const analyticsRouter = router;

// Dashboard is a read-only aggregation implemented within analytics.
const dashboard = Router();
dashboard.use(auth());
dashboard.get('/summary', catchAsync(getDashboardSummary));

export const dashboardRouter = dashboard;
