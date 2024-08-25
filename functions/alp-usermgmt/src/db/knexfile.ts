import '../loadDotEnv'
import type { Knex } from '../types'
import { env } from '../env'
import { createLogger } from '../Logger'

const logger = createLogger('KnexConfig')

let ssl: any = Boolean(Deno.env.get("PG_SSL"))
if (env.PG_CA_ROOT_CERT) {
  ssl = {
    rejectUnauthorized: true,
    ca: env.PG_CA_ROOT_CERT
  }
}

if (!env.PG_CA_ROOT_CERT && Deno.env.get("NODE_ENV") === 'production') {
  logger.warn('PG_CA_ROOT_CERT is undefined')
}

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.PG_HOST,
    port: env.PG_PORT,
    database: env.PG_DB_NAME,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
    ssl
  },
  searchPath: [env.PG_SCHEMA],
  pool: {
    min: env.PG_MIN_POOL,
    max: env.PG_MAX_POOL,
    idleTimeoutMillis: env.PG__IDLE_TIMEOUT_IN_MS
  },
  debug: env.PG_DEBUG,
  migrations: {
    schemaName: 'usermgmt',
    tableName: 'knex_migrations',
    directory: 'migrations'
  }
}

export default config
