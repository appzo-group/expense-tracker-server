import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BudgetController } from './budget.controller';
import { BudgetValidation } from './budget.validation';

const router = Router();

router.use(auth());

router.get('/', BudgetController.getAllBudgets);
router.post(
  '/',
  validateRequest(BudgetValidation.createBudgetZodSchema),
  BudgetController.createBudget,
);
router.patch(
  '/:id',
  validateRequest(BudgetValidation.budgetIdZodSchema),
  validateRequest(BudgetValidation.updateBudgetZodSchema),
  BudgetController.updateBudget,
);
router.delete(
  '/:id',
  validateRequest(BudgetValidation.budgetIdZodSchema),
  BudgetController.deleteBudget,
);

export const budgetRouter = router;
