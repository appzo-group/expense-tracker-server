import { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';

import config from '../../config';
import { errorLogger } from '../../shared/logger';
import { IErrorMessage } from '../../types/errors.types';
import ApiError from '../errors/ApiErrors';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IErrorMessage[] = [];

  if (err instanceof ZodError) {
    const formatted = handleZodError(err);
    statusCode = formatted.statusCode;
    message = formatted.message;
    errorMessages = formatted.errorMessages;
  } else if (err instanceof MongooseError.ValidationError) {
    const formatted = handleValidationError(err);
    statusCode = formatted.statusCode;
    message = formatted.message;
    errorMessages = formatted.errorMessages;
  } else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
    errorMessages = [{ path: err.path, message }];
  } else if (isDuplicateKeyError(err)) {
    statusCode = 409;
    message = 'Resource already exists';
    errorMessages = [{ path: '', message }];
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [{ path: '', message: err.message }];
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
    errorMessages = [{ path: '', message: err.message }];
  }

  if (statusCode >= 500) {
    errorLogger.error(
      `Unhandled error: ${err instanceof Error ? err.stack ?? err.message : String(err)}`,
    );
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
    stack: config.isDev ? (err instanceof Error ? err.stack : undefined) : undefined,
  });
};

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: number }).code === 11000
  );
}

export default globalErrorHandler;
