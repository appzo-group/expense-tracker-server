import { body } from 'express-validator';

const passwordRule = body('password')
  .isString()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters');

const emailRule = body('email')
  .isEmail()
  .withMessage('Enter a valid email')
  .bail()
  .normalizeEmail();

export const registerValidation = [
  body('name')
    .isString()
    .bail()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Name is required'),
  emailRule,
  passwordRule,
];

export const loginValidation = [
  emailRule,
  body('password').isString().notEmpty().withMessage('Password is required'),
];

export const refreshValidation = [
  body('refreshToken').isString().notEmpty().withMessage('refreshToken is required'),
];

export const logoutValidation = refreshValidation;

export const forgotPasswordValidation = [emailRule];

export const resetPasswordValidation = [
  body('token').isString().notEmpty().withMessage('token is required'),
  passwordRule,
];
