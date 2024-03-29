import config from './knexfile'
import { env } from '../env'

config.connection = async () => {
  return {
    host: env.PG_HOST,
    port: env.PG_PORT,
    database: env.PG_DB_NAME,
    user: env.PG_ADMIN_USER!,
    password: env.PG_ADMIN_PASSWORD!,
    ssl:
      env.NODE_ENV === 'development'
        ? Boolean(env.PG_SSL)
        : {
            rejectUnauthorized: true,
            ca: env.PG_CA_ROOT_CERT,
          },
  }
}

export default config
