import { Router } from 'express';

import { authMiddleware } from '../../core/middleware/auth.middleware';
import { catchAsync } from '../../core/http/catchAsync';
import { validate } from '../../core/middleware/validate.middleware';
import { budgetController } from './budget.controller';
import {
  budgetIdValidation,
  createBudgetValidation,
  updateBudgetValidation,
} from './budget.validation';

const router = Router();

router.use(authMiddleware);

router.get('/', catchAsync(budgetController.list));
router.post(
  '/',
  createBudgetValidation,
  validate,
  catchAsync(budgetController.create),
);
router.patch(
  '/:id',
  budgetIdValidation,
  updateBudgetValidation,
  validate,
  catchAsync(budgetController.update),
);
router.delete(
  '/:id',
  budgetIdValidation,
  validate,
  catchAsync(budgetController.remove),
);

export const budgetRouter = router;
