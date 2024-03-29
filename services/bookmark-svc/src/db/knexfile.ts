import { Knex } from 'knex'
import { env } from '../env'

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.PG_HOST,
    port: env.PG_PORT,
    database: env.PG_DB_NAME,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
    ssl:
      env.NODE_ENV === 'development'
        ? Boolean(env.PG_SSL)
        : {
            rejectUnauthorized: true,
            ca: env.PG_CA_ROOT_CERT,
          },
  },
  searchPath: [env.PG_SCHEMA],
  pool: {
    min: env.PG_MIN_POOL,
    max: env.PG_MAX_POOL,
    idleTimeoutMillis: env.PG_IDLE_TIMEOUT_IN_MS,
  },
  debug: env.PG_DEBUG,
  migrations: {
    schemaName: 'qe_config',
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
}

export default config
