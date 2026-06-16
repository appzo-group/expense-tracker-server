import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import sendResponse from '../../../shared/sendResponse';
import {
  registerUserToDB,
  loginUserFromDB,
  newAccessTokenToUser,
  logoutUserFromDB,
  forgetPasswordToDB,
  resetPasswordToDB,
} from './auth.service';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const result = await registerUserToDB({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Account created successfully',
    data: result,
  });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const result = await loginUserFromDB({ email: req.body.email, password: req.body.password });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Logged in successfully',
    data: result,
  });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const result = await newAccessTokenToUser(req.body.refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Token refreshed successfully',
    data: result,
  });
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  await logoutUserFromDB(req.body.refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Logged out successfully',
    data: null,
  });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const result = await forgetPasswordToDB(req.body.email);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'If the email exists, a reset link has been sent',
    data: result,
  });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  await resetPasswordToDB(req.body.token, req.body.password);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Password updated successfully',
    data: null,
  });
};
