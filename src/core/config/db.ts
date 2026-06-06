import mongoose from 'mongoose';

import { env } from './env';
import { logger } from './logger';


export async function connectDb(): Promise<void> {
  mongoose.set('strictQuery', true);
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(env.database_url as string);
      logger.info('MongoDB connected');
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn(`MongoDB connection attempt ${attempt} failed: ${message}`);
      if (attempt === maxAttempts) throw error;
      await delay(attempt * 1000);
    }
  }
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
