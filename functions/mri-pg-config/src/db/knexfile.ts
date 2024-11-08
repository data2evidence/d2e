import '../env'
import { Knex } from 'knex'
import * as path from "path";

const _env = Deno.env.toObject();

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: _env.PG__HOST!,
    port: Number(_env.PG__PORT),
    database: _env.PG__DB_NAME!,
    user: _env.PG_USER!,
    password: _env.PG_PASSWORD!,
    ssl:
      _env.NODE_ENV === 'development'
        ? Boolean(_env.PG_SSL)
        : {
            rejectUnauthorized: true,
            ca: _env.PG_CA_ROOT_CERT
          }
  },
  searchPath: [_env.PG_SCHEMA!],
  pool: {
    min: Number(_env.PG__MIN_POOL),
    max: Number(_env.PG__MAX_POOL),
    idleTimeoutMillis: Number(_env.PG__IDLE_TIMEOUT_IN_MS) || 30000
  },
  debug: Boolean(Number(_env.PG__DEBUG)),
  migrations: {
    extension: '.ts',
    //loadExtensions: ['.ts'],
    schemaName: _env.PG_SCHEMA, // schema used for storing the migrations. use test_schema first. switch to qe_config later
    tableName: 'knex_migrations', // table name used for storing the migration state
    directory: `${path.dirname(path.fromFileUrl(import.meta.url)).replace(/\/usr\/src/, '.')}/migrations` // relative path to directory containing the migration files 
  },
  seeds: {
    extension: '.ts',
    //loadExtensions: ['.ts'],
    directory: `${path.dirname(path.fromFileUrl(import.meta.url)).replace(/\/usr\/src/, '.')}/seeds`
  }
}

export default config
