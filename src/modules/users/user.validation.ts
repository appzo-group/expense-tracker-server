import { body } from 'express-validator';

export const updateProfileValidation = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Name must be between 1 and 60 characters'),
];

export const updateSettingsValidation = [
  body('currency')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  body('notifications.budgetAlerts')
    .optional()
    .isBoolean()
    .withMessage('budgetAlerts must be a boolean'),
];
