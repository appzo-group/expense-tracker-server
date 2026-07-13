import mongoose from 'mongoose';

import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';
import { dbconnect } from './app/db/mongodb';

process.on('uncaughtException', (error) => {
  errorLogger.error('uncaughtException Detected', error);
  process.exit(1);
});

let server: ReturnType<typeof app.listen>;

async function main(): Promise<void> {
  try {
    const message = await dbconnect();
    server = app.listen(Number(config.port), () => {
      logger.info(`Application listening on port: ${config.port} (${config.node_env})`);
    });
    app.get('/c', (_req, res) => {
      res.status(200).send(message);
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


main();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) server.close();
});
