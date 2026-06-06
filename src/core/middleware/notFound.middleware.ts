import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../http/ApiError';

/** Catch-all for unmatched routes → forwards a 404 to the error handler. */
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
