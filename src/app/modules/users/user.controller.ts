import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { requireUserId } from '../../../helpers/requireUser';
import sendResponse from '../../../shared/sendResponse';
import { deleteAllForUser as deleteAllBudgetsForUser } from '../budgets/budget.service';
import { revokeAllForUser } from '../tokens/token.service';
import { deleteAllForUser as deleteAllTransactionsForUser } from '../transactions/transaction.service';
import { retrieveProfileToDB, updateProfileToDB, updateSettingsToDB, deleteAccountFromDB } from './user.service';


// get profile information
export const retrieveProfile = async (req: Request, res: Response): Promise<void> => {
  const result = await retrieveProfileToDB(requireUserId(req));
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Profile fetched successfully', data: result });
};


// update Profile Information
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const result = await updateProfileToDB(requireUserId(req), { name: req.body.name });
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Profile updated successfully', data: result });
};


// update Settings
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const result = await updateSettingsToDB(requireUserId(req), { currency: req.body.currency, notifications: req.body.notifications });
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Settings updated successfully', data: result });
};


//delete User Account Controller
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  await deleteAccountFromDB(requireUserId(req), req.body.password);
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Account deleted successfully', data: null });
};


