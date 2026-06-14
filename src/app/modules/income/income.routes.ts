import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TransactionValidation } from '../transactions';
import { IncomeController } from './income.controller';

const router = Router();

router.use(auth());

router.get(
  '/',
  validateRequest(TransactionValidation.listTransactionsZodSchema),
  IncomeController.getAllIncome,
);
router.post(
  '/',
  validateRequest(TransactionValidation.createTransactionZodSchema),
  IncomeController.createIncome,
);
router.patch(
  '/:id',
  validateRequest(TransactionValidation.idParamZodSchema),
  validateRequest(TransactionValidation.updateTransactionZodSchema),
  IncomeController.updateIncome,
);
router.delete(
  '/:id',
  validateRequest(TransactionValidation.idParamZodSchema),
  IncomeController.deleteIncome,
);

export const incomeRouter = router;
