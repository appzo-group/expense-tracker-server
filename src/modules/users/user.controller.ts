import { Request, Response } from 'express';

import { ApiResponse } from '../../core/http/ApiResponse';
import { requireUserId } from '../../shared/utils/requireUser';
import { userService } from './user.service';

export const userController = {
  async getProfile(req: Request, res: Response) {
    const user = await userService.getProfile(requireUserId(req));
    ApiResponse.send(res, { data: user, message: 'Profile fetched' });
  },

  async updateProfile(req: Request, res: Response) {
    const user = await userService.updateProfile(requireUserId(req), {
      name: req.body.name,
    });
    ApiResponse.send(res, { data: user, message: 'Profile updated' });
  },

  async updateSettings(req: Request, res: Response) {
    const user = await userService.updateSettings(requireUserId(req), {
      currency: req.body.currency,
      notifications: req.body.notifications,
    });
    ApiResponse.send(res, { data: user, message: 'Settings updated' });
  },

  async deleteAccount(req: Request, res: Response) {
    await userService.deleteAccount(requireUserId(req), req.body.password);
    ApiResponse.send(res, { data: null, message: 'Account deleted' });
  },
};
