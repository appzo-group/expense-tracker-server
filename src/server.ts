import mongoose from 'mongoose';

import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';

process.on('uncaughtException', (error) => {
  errorLogger.error('uncaughtException Detected', error);
  process.exit(1);
});

let server: ReturnType<typeof app.listen>;

async function main(): Promise<void> {
  try {
    await connectWithRetry();
    server = app.listen(Number(config.port), () => {
      logger.info(`Application listening on port: ${config.port} (${config.node_env})`);
    });
  } catch (error) {
    errorLogger.error('Failed to connect to the database');
    process.exit(1);
  }

  process.on('unhandledRejection', (error) => {
    if (server) {
      server.close(() => {
        errorLogger.error('UnhandledRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

async function connectWithRetry(maxAttempts = 5): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      mongoose.set('strictQuery', true);
      await mongoose.connect(config.database_url);
      logger.info('Database connected successfully');
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn(`Database connection attempt ${attempt} failed: ${message}`);
      if (attempt === maxAttempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
}

main();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) server.close();
});
