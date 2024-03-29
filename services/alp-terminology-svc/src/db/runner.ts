import { createLogger } from '../logger';
import migrationDataSource from './migration-data-source';

export const updateDb = async () => {
  const logger = createLogger('updateDb');

  try {
    logger.info('Running migrations...');
    await migrationDataSource.initialize();
    await migrationDataSource.runMigrations();
    logger.info('~~~ Migrations completed! ~~~');
  } catch (err) {
    logger.error('Cannot start the app. Migrations has failed!', err);
    process.exit(0);
  }
};
