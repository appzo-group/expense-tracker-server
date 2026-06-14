import rateLimit from 'express-rate-limit';

import config from '../../config';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.isTest,
  message: { success: false, message: 'Too many requests, slow down.' },
});
