import { NextFunction, Request, Response } from 'express';

export function sanitize(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') scrub(req.body);
  if (req.params && typeof req.params === 'object') scrub(req.params);
  next();
}

function scrub(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) scrub(item);
    return;
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete (value as Record<string, unknown>)[key];
      } else {
        scrub((value as Record<string, unknown>)[key]);
      }
    }
  }
}
