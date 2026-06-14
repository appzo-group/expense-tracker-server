import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../../shared/catchAsync';
import { createIncome, updateIncome, deleteIncome, getAllIncome } from './income.controller';
import {
  createIncomeZodSchema,
  updateIncomeZodSchema,
  listIncomeZodSchema,
  incomeIdZodSchema,
} from './income.validation';

const router = Router();

router.use(auth());

router.get('/', validateRequest(listIncomeZodSchema), catchAsync(getAllIncome));
router.post('/', validateRequest(createIncomeZodSchema), catchAsync(createIncome));
router.patch(
  '/:id',
  validateRequest(incomeIdZodSchema),
  validateRequest(updateIncomeZodSchema),
  catchAsync(updateIncome),
);
router.delete('/:id', validateRequest(incomeIdZodSchema), catchAsync(deleteIncome));

export const incomeRouter = router;
