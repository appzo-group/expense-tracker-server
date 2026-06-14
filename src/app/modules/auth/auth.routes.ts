import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../../shared/catchAsync';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} from './auth.controller';
import {
  createRegisterZodSchema,
  createLoginZodSchema,
  createRefreshZodSchema,
  createForgotPasswordZodSchema,
  createResetPasswordZodSchema,
} from './auth.validation';

const router = Router();

router.post('/register', validateRequest(createRegisterZodSchema), catchAsync(registerUser));
router.post('/login', validateRequest(createLoginZodSchema), catchAsync(loginUser));
router.post('/refresh', validateRequest(createRefreshZodSchema), catchAsync(refreshToken));
router.post('/logout', validateRequest(createRefreshZodSchema), catchAsync(logoutUser));
router.post('/forgot-password', validateRequest(createForgotPasswordZodSchema), catchAsync(forgotPassword));
router.post('/reset-password', validateRequest(createResetPasswordZodSchema), catchAsync(resetPassword));

export const authRouter = router;
