import '../env'
import config from './knexfile'

const sleep = (time: number) => {
  setTimeout(() => time, time)
}

config.connection = async () => {
  if (process.env.NODE_ENV === 'development') {
    await sleep(30000)
  }
  return {
    host: process.env.PG_HOST!,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE!,
    user: process.env.PG_ADMIN_USER!,
    password: process.env.PG_ADMIN_PASSWORD!,
    ssl:
      process.env.NODE_ENV === "development"
        ? Boolean(process.env.PG_SSL)
        : {
            rejectUnauthorized: true,
            ca: process.env.PG_CA_ROOT_CERT,
          },
  };
}

export default config
