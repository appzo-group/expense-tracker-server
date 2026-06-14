import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TransactionValidation } from '../transactions';
import { ExpenseController } from './expense.controller';

const router = Router();

router.use(auth());

router.get(
  '/',
  validateRequest(TransactionValidation.listTransactionsZodSchema),
  ExpenseController.getAllExpenses,
);
router.post(
  '/',
  validateRequest(TransactionValidation.createTransactionZodSchema),
  ExpenseController.createExpense,
);
router.patch(
  '/:id',
  validateRequest(TransactionValidation.idParamZodSchema),
  validateRequest(TransactionValidation.updateTransactionZodSchema),
  ExpenseController.updateExpense,
);
router.delete(
  '/:id',
  validateRequest(TransactionValidation.idParamZodSchema),
  ExpenseController.deleteExpense,
);

export const expenseRouter = router;
