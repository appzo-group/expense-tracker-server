import { Request } from 'express';

import ApiError from '../app/errors/ApiErrors';

export function requireUserId(req: Request): string {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, 'You are not authorized');
  return id;
}
