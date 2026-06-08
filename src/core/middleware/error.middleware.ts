import { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';

import { logger } from '../config/logger';
import { env } from '../config/env';
import { ApiError } from '../http/ApiError';


export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errors: Record<string, string> = {};

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof MongooseError.ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    for (const [field, detail] of Object.entries(err.errors)) {
      errors[field] = detail.message;
    }
  } else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  } else if (isDuplicateKeyError(err)) {
    statusCode = 409;
    message = 'Resource already exists';
  }

  if (statusCode >= 500) {
    logger.error(
      `Unhandled error: ${err instanceof Error ? err.stack ?? err.message : String(err)}`,
    );
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(!env.isTest || statusCode < 500
      ? {}
      : { stack: err instanceof Error ? err.stack : undefined }),
  });
};

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: number }).code === 11000
  );
}
