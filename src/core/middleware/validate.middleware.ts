import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { ApiError } from '../http/ApiError';

/**
 * Runs after a route's express-validator chains. If any failed, responds 422
 * with a `field → message` map (consumed by the Flutter `ValidationFailure`).
 */
export function validate(req: Request, _res: Response, next: NextFunction): void {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
    return;
  }

  const errors: Record<string, string> = {};
  for (const error of result.array()) {
    // `path` exists for field errors; keep the first message per field.
    const field = (error as { path?: string }).path ?? 'error';
    if (!errors[field]) errors[field] = error.msg as string;
  }

  next(ApiError.unprocessable('Validation failed', errors));
}
