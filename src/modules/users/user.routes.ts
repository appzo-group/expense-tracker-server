import { Router } from 'express';

import { authMiddleware } from '../../core/middleware/auth.middleware';
import { validate } from '../../core/middleware/validate.middleware';
import { catchAsync } from '../../core/http/catchAsync';
import { userController } from './user.controller';
import {
  deleteAccountValidation,
  updateProfileValidation,
  updateSettingsValidation,
} from './user.validation';

const router = Router();

router.use(authMiddleware);

router.get('/profile', catchAsync(userController.getProfile));
router.patch(
  '/profile',
  updateProfileValidation,
  validate,
  catchAsync(userController.updateProfile),
);
router.patch(
  '/settings',
  updateSettingsValidation,
  validate,
  catchAsync(userController.updateSettings),
);
router.delete(
  '/profile',
  deleteAccountValidation,
  validate,
  catchAsync(userController.deleteAccount),
);

export const userRouter = router;
