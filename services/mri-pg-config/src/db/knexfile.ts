import '../env'
import { Knex } from 'knex'

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.PG_HOST!,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE!,
    user: process.env.PG_USER!,
    password: process.env.PG_PASSWORD!,
    ssl:
      process.env.NODE_ENV === 'development'
        ? Boolean(process.env.PG_SSL)
        : {
            rejectUnauthorized: true,
            ca: process.env.PG_CA_ROOT_CERT
          }
  },
  searchPath: [process.env.PG_SCHEMA!],
  pool: {
    min: Number(process.env.PG_MIN_POOL),
    max: Number(process.env.PG_MAX_POOL),
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_IN_MS) || 30000
  },
  debug: Boolean(Number(process.env.PG_DEBUG)),
  migrations: {
    schemaName: process.env.PG_SCHEMA, // schema used for storing the migrations. use test_schema first. switch to qe_config later
    tableName: 'knex_migrations', // table name used for storing the migration state
    directory: 'migrations' // relative path to directory containing the migration files 
  }
}

export default config
