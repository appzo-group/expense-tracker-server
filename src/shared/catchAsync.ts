import e from 'cors';
import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error) ;
      next(error);
    }
  };

export default catchAsync;
