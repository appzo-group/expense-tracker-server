import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

import config from '../config';

export const logger = winston.createLogger({
  level: config.isTest ? 'silent' : 'info',
  silent: config.isTest,

  format: winston.format.combine(
    winston.format.timestamp(),
    config.isTest
      ? winston.format.printf(
        ({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`,
      )
      : winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

export const errorLogger = winston.createLogger({
  level: 'error',
  silent: config.isTest,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

export const monitorApiRequest = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const ms = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    logger.info(`${req.method} ${res.statusCode} ${req.originalUrl} → ${ms} ms`);

  });
  next();
};
