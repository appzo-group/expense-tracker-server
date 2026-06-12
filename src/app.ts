import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { errorHandler } from './core/middleware/error.middleware';
import { notFound } from './core/middleware/notFound.middleware';
import { globalLimiter } from './core/middleware/rateLimit.middleware';
import { sanitize } from './core/middleware/sanitize.middleware';
import { apiRouter } from './routes';
import { monitorApiRequest } from './core/config/logger';


export function createApp(): Application {
  const app = express();

  app.use(monitorApiRequest);
  app.use(helmet());
  app.use(cors({ credentials: true }));
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(sanitize);
  app.use(globalLimiter);

  app.use('/api/v1', apiRouter);

  app.get('/health', (_req, res) => {
    res.status(200).send('OK');
  });
  app.get('/', (_req, res) => {
    res.status(200).send('Expense Tracker Server Running');
  });


  app.use(notFound);
  app.use(errorHandler);

  return app;
}
