import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const globalLimiter = rateLimit({
  windowMs: 15*60*1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.isTest,
  message: { success: false, message: 'Too many requests, slow down.' },
});


