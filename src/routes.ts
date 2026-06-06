import { Router } from 'express';
import { analyticsRouter, dashboardRouter } from './modules/analytics';
import { authRouter } from './modules/auth';
import { budgetRouter } from './modules/budgets';
import { expenseRouter } from './modules/expenses';
import { incomeRouter } from './modules/income';
import { transactionRouter } from './modules/transactions';
import { userRouter } from './modules/users';


export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ok', data: { status: 'healthy' } });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/transactions', transactionRouter);
apiRouter.use('/expenses', expenseRouter);
apiRouter.use('/income', incomeRouter);
apiRouter.use('/budgets', budgetRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/dashboard', dashboardRouter);
