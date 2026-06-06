import { Router } from 'express';

import { catchAsync } from '../../core/http/catchAsync';
import { validate } from '../../core/middleware/validate.middleware';
import { authController } from './auth.controller';
import {
  forgotPasswordValidation,
  loginValidation,
  logoutValidation,
  refreshValidation,
  registerValidation,
  resetPasswordValidation,
} from './auth.validation';

const router = Router();

router.post(
  '/register',
  registerValidation,
  validate,
  catchAsync(authController.register),
);
router.post(
  '/login',
  loginValidation,
  validate,
  catchAsync(authController.login),
);
router.post(
  '/refresh',
  refreshValidation,
  validate,
  catchAsync(authController.refresh),
);
router.post(
  '/logout',
  logoutValidation,
  validate,
  catchAsync(authController.logout),
);
router.post(
  '/forgot-password',
  forgotPasswordValidation,
  validate,
  catchAsync(authController.forgotPassword),
);
router.post(
  '/reset-password',
  resetPasswordValidation,
  validate,
  catchAsync(authController.resetPassword),
);

export const authRouter = router;
