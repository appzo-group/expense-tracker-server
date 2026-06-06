import { Request } from 'express';

import { ApiError } from '../../core/http/ApiError';

/**
 * Returns the authenticated user id. Controllers behind `authMiddleware` can
 * rely on this; it throws (401) defensively if the guard was somehow skipped.
 */
export function requireUserId(req: Request): string {
  const id = req.user?.id;
  if (!id) throw ApiError.unauthorized();
  return id;
}
