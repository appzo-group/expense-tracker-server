import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import catchAsync from '../../../shared/catchAsync';
import { retrieveProfile, updateProfile, updateSettings, deleteAccount } from './user.controller';
import { updateProfileZodSchema, updateSettingsZodSchema, deleteAccountZodSchema } from './user.validation';

const router = Router();

router.use(auth());
router.get('/profile', catchAsync(retrieveProfile));
router.patch('/profile', validateRequest(updateProfileZodSchema), catchAsync(updateProfile));
router.patch('/settings', validateRequest(updateSettingsZodSchema), catchAsync(updateSettings));
router.delete('/profile', validateRequest(deleteAccountZodSchema), catchAsync(deleteAccount));

export const userRouter = router;
