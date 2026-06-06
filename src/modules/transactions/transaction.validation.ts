import { body, param, query } from 'express-validator';

import { TRANSACTION_TYPES } from '../../shared/constants';

/** Body validation for creating a transaction (reused by expenses/income). */
export const transactionCreateValidation = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than zero'),
  body('category')
    .isString()
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('note').optional().isString().trim(),
  body('date').isISO8601().withMessage('Date must be a valid ISO date'),
];

/** Body validation for updating a transaction — all fields optional. */
export const transactionUpdateValidation = [
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than zero'),
  body('category').optional().isString().trim().notEmpty(),
  body('note').optional().isString().trim(),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date'),
];

export const listTransactionsValidation = [
  query('type')
    .optional()
    .isIn(TRANSACTION_TYPES)
    .withMessage('type must be expense or income'),
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1 }),
];

export const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid id'),
];
