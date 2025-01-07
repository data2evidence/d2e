import { createLogger } from '../../logger.ts';
import migrationDataSource from './migration-data-source.ts';

export const runMigrations = async () => {
  const logger = createLogger('db-migration')

  try {
    logger.info('Running migrations...')
    console.log(`Running migrations...`)
    await migrationDataSource.initialize()
    await migrationDataSource.runMigrations()
    logger.info('~~~ Migrations completed! ~~~')
    console.log('~~~ Migrations completed! ~~~')
  } catch (err) {
    logger.error('Cannot start the app. Migrations has failed!', err)
    Deno.exit(0)
  }
// }
// const _env = Deno.env.toObject();
// export const runMigrations = async () => {
//   const logger = createLogger('db-migration')

//   try {
//     logger.info('Running migrations...')
//     await migrationDataSource.initialize()
    
//     const queryRunner = migrationDataSource.createQueryRunner()
//     const migrationsTable = await queryRunner.hasTable('migrations')
//     console.log('Migrations table exists:', migrationsTable)
    
//     try {
//       // Add schema name to the query if you're using a specific schema
//       const schema = _env.PG_SCHEMA ? `${_env.PG_SCHEMA}.` : '';
//       const existingMigrations = await queryRunner.query(`SELECT * FROM ${schema}migrations`);
//       console.log('Existing migrations:', existingMigrations);
      
//       // Also log the count of configured migrations vs executed migrations
//       console.log('Configured migrations count:', migrationDataSource.migrations.length);
//       console.log('Executed migrations count:', existingMigrations.length);
      
//       // Compare to see which migrations are pending
//       const executedMigrationNames = new Set(existingMigrations.map(m => m.name));
//       const pendingMigrations = migrationDataSource.migrations
//         .filter(m => !executedMigrationNames.has(m.name))
//         .map(m => m.name);
      
//       console.log('Pending migrations:', pendingMigrations);
      
//     } catch (queryError) {
//       console.error('Error querying migrations table:', queryError);
//     }

//     await migrationDataSource.runMigrations()
//     logger.info('~~~ Migrations completed! ~~~')
//   } catch (err) {
//     logger.error('Cannot start the app. Migrations has failed!', {
//       error: err,
//       stack: err.stack
//     })
//     process.exit(1)
//   } finally {
//     // await queryRunner?.release();
//     await migrationDataSource.destroy()
//   }
// }