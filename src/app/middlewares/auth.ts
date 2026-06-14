import { NextFunction, Request, Response } from 'express';

import config from '../../config';
import { jwtHelper } from '../../helpers/jwtHelper';
import ApiError from '../errors/ApiErrors';

const auth = (...roles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const tokenWithBearer = req.headers.authorization;
      if (!tokenWithBearer || !tokenWithBearer.startsWith('Bearer ')) {
        throw new ApiError(401, 'You are not authorized');
      }

      const token = tokenWithBearer.split(' ')[1];
      const decoded = jwtHelper.verifyToken(token, config.jwt.access_secret);

      if (!decoded.sub) {
        throw new ApiError(401, 'Invalid token');
      }

      req.user = { id: decoded.sub };

      if (roles.length && !roles.includes(decoded.role as string)) {
        throw new ApiError(403, "You don't have permission to access this route");
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
