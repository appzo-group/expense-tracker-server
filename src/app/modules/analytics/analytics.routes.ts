import { Router } from 'express';

import auth from '../../middlewares/auth';
import { AnalyticsController } from './analytics.controller';

const router = Router();
router.use(auth());

router.get('/by-category', AnalyticsController.getCategoryBreakdown);
router.get('/monthly', AnalyticsController.getMonthlyAnalytics);
router.get('/weekly', AnalyticsController.getWeeklyAnalytics);
router.get('/income-vs-expense', AnalyticsController.getIncomeVsExpense);
router.get('/insights', AnalyticsController.getFinancialInsights);

export const analyticsRouter = router;

// Dashboard is a read-only aggregation implemented within analytics.
const dashboard = Router();
dashboard.use(auth());
dashboard.get('/summary', AnalyticsController.getDashboardSummary);

export const dashboardRouter = dashboard;
