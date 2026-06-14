import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TransactionController } from './transaction.controller';
import { TransactionValidation } from './transaction.validation';

const router = Router();

router.use(auth());

router.get(
  '/',
  validateRequest(TransactionValidation.listTransactionsZodSchema),
  TransactionController.getAllTransactions,
);
router.get(
  '/:id',
  validateRequest(TransactionValidation.idParamZodSchema),
  TransactionController.getSingleTransaction,
);

export const transactionRouter = router;
