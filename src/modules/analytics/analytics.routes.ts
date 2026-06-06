import { Router } from 'express';

import { authMiddleware } from '../../core/middleware/auth.middleware';
import { catchAsync } from '../../core/http/catchAsync';
import { analyticsController } from './analytics.controller';

const router = Router();
router.use(authMiddleware);

router.get('/by-category', catchAsync(analyticsController.byCategory));
router.get('/monthly', catchAsync(analyticsController.monthly));
router.get('/weekly', catchAsync(analyticsController.weekly));
router.get('/income-vs-expense', catchAsync(analyticsController.incomeVsExpense));
router.get('/insights', catchAsync(analyticsController.insights));

export const analyticsRouter = router;

// Dashboard is a read-only aggregation implemented within analytics.
const dashboard = Router();
dashboard.use(authMiddleware);
dashboard.get('/summary', catchAsync(analyticsController.dashboardSummary));

export const dashboardRouter = dashboard;
