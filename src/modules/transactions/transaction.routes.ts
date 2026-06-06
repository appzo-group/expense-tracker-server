import { Router } from 'express';

import { authMiddleware } from '../../core/middleware/auth.middleware';
import { validate } from '../../core/middleware/validate.middleware';
import { catchAsync } from '../../core/http/catchAsync';
import { transactionController } from './transaction.controller';
import {
  idParamValidation,
  listTransactionsValidation,
} from './transaction.validation';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  listTransactionsValidation,
  validate,
  catchAsync(transactionController.list),
);
router.get(
  '/:id',
  idParamValidation,
  validate,
  catchAsync(transactionController.getById),
);

export const transactionRouter = router;
