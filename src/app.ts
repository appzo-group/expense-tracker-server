import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import { globalLimiter } from './app/middlewares/rateLimit';
import { sanitize } from './app/middlewares/sanitize';
import apiRouter from './app/routes';
import { monitorApiRequest } from './shared/logger';


const app = express();

app.set("trust proxy", true);

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
app.use(globalErrorHandler);

export default app;
