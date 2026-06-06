import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { ApiError } from '../http/ApiError';

/**
 * Verifies the `Authorization: Bearer <accessToken>` header and attaches
 * `req.user = { id }`. Verifying the access-token signature is simple enough to
 * live here so `core` stays independent of the tokens module (which owns signing
 * and refresh rotation).
 */
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(ApiError.unauthorized('Missing or malformed Authorization header'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = jwt.verify(token, env.jwt.access_secret as string) as { sub?: string };
    if (!payload.sub) {
      next(ApiError.unauthorized('Invalid token'));
      return;
    }
    req.user = { id: payload.sub };
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
