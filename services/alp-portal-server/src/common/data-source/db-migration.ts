import { createLogger } from '../../logger'
import migrationDataSource from './migration-data-source'

export const runMigrations = async () => {
  const logger = createLogger('db-migration')

  try {
    logger.info('Running migrations...')
    await migrationDataSource.initialize()
    await migrationDataSource.runMigrations()
    logger.info('~~~ Migrations completed! ~~~')
  } catch (err) {
    logger.error('Cannot start the app. Migrations has failed!', err)
    process.exit(0)
  }
}