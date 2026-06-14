import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../../shared/catchAsync';
import { getAllBudgets, createBudget, updateBudget, deleteBudget } from './budget.controller';
import { createBudgetZodSchema, updateBudgetZodSchema, budgetIdZodSchema } from './budget.validation';

const router = Router();

router.use(auth());

router.get('/', catchAsync(getAllBudgets));
router.post('/', validateRequest(createBudgetZodSchema), catchAsync(createBudget));
router.patch('/:id', validateRequest(budgetIdZodSchema), validateRequest(updateBudgetZodSchema), catchAsync(updateBudget));
router.delete('/:id', validateRequest(budgetIdZodSchema), catchAsync(deleteBudget));

export const budgetRouter = router;
