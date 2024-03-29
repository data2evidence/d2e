import { join } from 'path'
import { DataSource, DataSourceOptions, LogLevel } from 'typeorm'
import { TlsOptions } from 'tls'
import { createLogger } from '../../logger'
import { env } from '../../env'

const logger = createLogger('DataSource')
const baseDir = process.env.CLI_MIGRATION === 'true' ? 'src' : 'dist'

export const getSsl = (): boolean | TlsOptions => {
  if (env.PG_CA_ROOT_CERT) {
    return {
      rejectUnauthorized: true,
      ca: env.PG_CA_ROOT_CERT
    }
  } else if (env.NODE_ENV === 'production') {
    logger.warn('PG_CA_ROOT_CERT is undefined')
  }
  return false
}

export const getLogLevels = (): LogLevel[] => {
  if (env.NODE_ENV === 'production') {
    return ['log', 'info', 'warn', 'error', 'migration']
  }
  return ['log', 'info', 'warn', 'error', 'migration', 'query', 'schema']
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env.PG_HOST,
  port: env.PG_PORT,
  username: env.PG_USER,
  password: env.PG_PASSWORD,
  database: env.PG_DATABASE,
  schema: env.PG_SCHEMA,
  ssl: getSsl(),
  poolSize: env.PG_MAX_POOL,
  logging: getLogLevels(),
  entities: [join(baseDir, '**/*.entity.{ts,js}')]
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
