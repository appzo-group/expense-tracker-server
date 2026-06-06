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
import { incomeController } from './income.controller';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  listTransactionsValidation,
  validate,
  catchAsync(incomeController.list),
);
router.post(
  '/',
  transactionCreateValidation,
  validate,
  catchAsync(incomeController.create),
);
router.patch(
  '/:id',
  idParamValidation,
  transactionUpdateValidation,
  validate,
  catchAsync(incomeController.update),
);
router.delete(
  '/:id',
  idParamValidation,
  validate,
  catchAsync(incomeController.remove),
);

export const incomeRouter = router;
