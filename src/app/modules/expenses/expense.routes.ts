import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../../shared/catchAsync';
import { createExpense, updateExpense, deleteExpense, getAllExpenses } from './expense.controller';
import {
  createExpenseZodSchema,
  updateExpenseZodSchema,
  listExpensesZodSchema,
  expenseIdZodSchema,
} from './expense.validation';

const router = Router();

router.use(auth());

router.get('/', validateRequest(listExpensesZodSchema), catchAsync(getAllExpenses));
router.post('/', validateRequest(createExpenseZodSchema), catchAsync(createExpense));
router.patch(
  '/:id',
  validateRequest(expenseIdZodSchema),
  validateRequest(updateExpenseZodSchema),
  catchAsync(updateExpense),
);
router.delete('/:id', validateRequest(expenseIdZodSchema), catchAsync(deleteExpense));

export const expenseRouter = router;
