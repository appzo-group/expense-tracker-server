import { NextFunction, Request, Response } from 'express';

import ApiError from '../errors/ApiErrors';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}
