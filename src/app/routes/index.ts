import { Router } from 'express';

import { analyticsRouter, dashboardRouter } from '../modules/analytics';
import { authRouter } from '../modules/auth';
import { budgetRouter } from '../modules/budgets';
import { expenseRouter } from '../modules/expenses';
import { incomeRouter } from '../modules/income';
import { transactionRouter } from '../modules/transactions';
import { userRouter } from '../modules/users';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/transactions', transactionRouter);
apiRouter.use('/expenses', expenseRouter);
apiRouter.use('/income', incomeRouter);
apiRouter.use('/budgets', budgetRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/dashboard', dashboardRouter);

export default apiRouter;
