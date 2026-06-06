import { Response } from 'express';

import { PaginationMeta } from '../../shared/types/pagination.types';

interface SuccessOptions<T> {
  data: T;
  message?: string;
  statusCode?: number;
  meta?: PaginationMeta;
}

/** Builds the standard success envelope and writes it to the response. */
export const ApiResponse = {
  send<T>(res: Response, options: SuccessOptions<T>): Response {
    const { data, message = 'OK', statusCode = 200, meta } = options;
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    });
  },
};
