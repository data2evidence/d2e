import { join } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'
import { env } from '../../env'
import { getSsl, getLogLevels } from './data-source'

const baseDir = Deno.env.get("CLI_MIGRATION") === 'true' ? 'src' : 'dist'

const migrationDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env.PG_HOST,
  port: env.PG_PORT,
  username: env.PG_MANAGE_USER,
  password: env.PG_MANAGE_PASSWORD,
  database: env.PG_DATABASE,
  schema: env.PG_SCHEMA,
  ssl: getSsl(),
  poolSize: env.PG_MAX_POOL,
  logging: getLogLevels(),
  entities: [join(baseDir, '**/*.entity.{ts,js}')],
  migrations: [join(baseDir, '**/data-source/migrations/*.{ts,js}')]
}

const migrationDataSource = new DataSource(migrationDataSourceOptions)
export default migrationDataSource
