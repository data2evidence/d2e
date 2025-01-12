import config from './knexfile'
import { env } from '../env'

config.connection = async () => {
  return {
    host: env.PG__HOST,
    port: env.PG__PORT,
    database: env.PG__DB_NAME,
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
