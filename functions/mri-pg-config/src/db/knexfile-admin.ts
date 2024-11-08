import '../env'
import config from './knexfile'
import { Knex } from 'knex'

const _env = Deno.env.toObject();


const sleep = (time: number) => {
  setTimeout(() => time, time)
}

config.connection = async () => {
  if (_env.NODE_ENV === 'development') {
    await sleep(30000)
  }
  return {
    host: _env.PG__HOST!,
    port: Number(_env.PG__PORT),
    database: _env.PG__DB_NAME!,
    user: _env.PG_ADMIN_USER!,
    password: _env.PG_ADMIN_PASSWORD!,
    ssl:
      _env.NODE_ENV === "development"
        ? Boolean(_env.PG_SSL)
        : {
            rejectUnauthorized: true,
            ca: _env.PG_CA_ROOT_CERT,
          },
  };
}


export default config
