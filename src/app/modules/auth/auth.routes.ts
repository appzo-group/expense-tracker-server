import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidation.createRegisterZodSchema),
  AuthController.registerUser,
);
router.post(
  '/login',
  validateRequest(AuthValidation.createLoginZodSchema),
  AuthController.loginUser,
);
router.post(
  '/refresh',
  validateRequest(AuthValidation.createRefreshZodSchema),
  AuthController.refreshToken,
);
router.post(
  '/logout',
  validateRequest(AuthValidation.createRefreshZodSchema),
  AuthController.logoutUser,
);
router.post(
  '/forgot-password',
  validateRequest(AuthValidation.createForgotPasswordZodSchema),
  AuthController.forgotPassword,
);
router.post(
  '/reset-password',
  validateRequest(AuthValidation.createResetPasswordZodSchema),
  AuthController.resetPassword,
);

export const authRouter = router;
