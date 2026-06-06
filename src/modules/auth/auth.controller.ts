import { Request, Response } from 'express';

import { ApiResponse } from '../../core/http/ApiResponse';
import { authService } from './auth.service';

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    ApiResponse.send(res, {
      data: result,
      message: 'Account created',
      statusCode: 201,
    });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });
    ApiResponse.send(res, { data: result, message: 'Logged in' });
  },

  async refresh(req: Request, res: Response) {
    const tokens = await authService.refresh(req.body.refreshToken);
    ApiResponse.send(res, { data: tokens, message: 'Token refreshed' });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.body.refreshToken);
    ApiResponse.send(res, { data: null, message: 'Logged out' });
  },

  async forgotPassword(req: Request, res: Response) {
    const result = await authService.forgotPassword(req.body.email);
    ApiResponse.send(res, {
      data: result,
      message: 'If the email exists, a reset link has been sent',
    });
  },

  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body.token, req.body.password);
    ApiResponse.send(res, { data: null, message: 'Password updated' });
  },
};
