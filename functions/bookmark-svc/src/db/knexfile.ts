import { Knex } from 'knex'
import { env } from '../env'

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.PG__HOST,
    port: env.PG__PORT,
    database: env.PG__DB_NAME,
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
    min: env.PG__MIN_POOL,
    max: env.PG__MAX_POOL,
    idleTimeoutMillis: env.PG__IDLE_TIMEOUT_IN_MS,
  },
  debug: env.PG__DEBUG,
  migrations: {
    schemaName: 'qe_config',
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
}

export default config
