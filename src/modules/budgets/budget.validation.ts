import { body, param } from 'express-validator';

import { BUDGET_PERIODS } from '../../shared/constants';

export const createBudgetValidation = [
  body('category').isString().bail().trim().notEmpty().withMessage('Category is required'),
  body('limit').isFloat({ gt: 0 }).withMessage('Limit must be greater than zero'),
  body('period').isIn(BUDGET_PERIODS).withMessage('Period must be monthly or yearly'),
  body('startDate').isISO8601().withMessage('startDate must be a valid ISO date'),
];

export const updateBudgetValidation = [
  body('category').optional().isString().trim().notEmpty(),
  body('limit').optional().isFloat({ gt: 0 }).withMessage('Limit must be greater than zero'),
  body('period').optional().isIn(BUDGET_PERIODS),
  body('startDate').optional().isISO8601(),
];

export const budgetIdValidation = [
  param('id').isMongoId().withMessage('Invalid id'),
];
