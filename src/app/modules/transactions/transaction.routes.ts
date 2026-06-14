import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../../shared/catchAsync';
import { getAllTransactions, getSingleTransaction } from './transaction.controller';
import { listTransactionsZodSchema, idParamZodSchema } from './transaction.validation';

const router = Router();

router.use(auth());

router.get('/', validateRequest(listTransactionsZodSchema), catchAsync(getAllTransactions));
router.get('/:id', validateRequest(idParamZodSchema), catchAsync(getSingleTransaction));

export const transactionRouter = router;
