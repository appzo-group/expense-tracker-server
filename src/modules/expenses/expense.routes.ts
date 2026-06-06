import { Router } from 'express';

import { authMiddleware } from '../../core/middleware/auth.middleware';
import { catchAsync } from '../../core/http/catchAsync';
import { validate } from '../../core/middleware/validate.middleware';
import {
  idParamValidation,
  listTransactionsValidation,
  transactionCreateValidation,
  transactionUpdateValidation,
} from '../transactions';
import { expenseController } from './expense.controller';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  listTransactionsValidation,
  validate,
  catchAsync(expenseController.list),
);
router.post(
  '/',
  transactionCreateValidation,
  validate,
  catchAsync(expenseController.create),
);
router.patch(
  '/:id',
  idParamValidation,
  transactionUpdateValidation,
  validate,
  catchAsync(expenseController.update),
);
router.delete(
  '/:id',
  idParamValidation,
  validate,
  catchAsync(expenseController.remove),
);

export const expenseRouter = router;
