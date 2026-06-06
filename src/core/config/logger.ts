import winston from 'winston';
import { env } from './env';
import { NextFunction, Request, Response } from 'express';

export const logger = winston.createLogger({
  level: !env.isTest ? 'info' : 'debug',
  silent: env.isTest,
  format: winston.format.combine(
    winston.format.timestamp(),
    !env.isTest
      ? winston.format.json()
      : winston.format.printf(
        ({ level, message, timestamp }) =>
          `${timestamp} [${level}] ${message}`,
      ),
  ),
  transports: [new winston.transports.Console()],
});


export const monitorApiRequest = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const time = diff[0] * 1000 + diff[1] / 1e6;
    logger.info(`${req.method} ${req.originalUrl} → ${time.toFixed(2)} ms`);
  });

  next();
}
