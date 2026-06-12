import createApp from './app';
import { connectDb } from './core/config/db';
import { env } from './core/config/env';
import { logger } from './core/config/logger';

async function main(): Promise<void> {
  await connectDb();
  const app = createApp();
  app.listen(env.port, () => {
    logger.info(`Server listening on http://localhost:${env.port} (${env.node_env})`);
  });

}

main().catch((error) => {
  logger.error(
    `Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
