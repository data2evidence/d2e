import { DataSource, DataSourceOptions, LogLevel } from 'typeorm';
import { TlsOptions } from 'tls';
import { createLogger } from '../logger';
import { env } from '../env';
import { SeederOptions } from 'typeorm-extension';

const logger = createLogger('DataSource');

export const getSsl = (): boolean | TlsOptions => {
  if (env.PG_CA_ROOT_CERT) {
    return {
      rejectUnauthorized: true,
      ca: env.PG_CA_ROOT_CERT,
    };
  } else if (env.NODE_ENV === 'production') {
    logger.warn('PG_CA_ROOT_CERT is undefined');
  }
  return false;
};

export const getLogLevels = (): LogLevel[] => {
  if (env.NODE_ENV === 'production') {
    return ['log', 'info', 'warn', 'error', 'migration'];
  }
  return ['log', 'info', 'warn', 'error', 'migration', 'query', 'schema'];
};

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: env.PG__HOST,
  port: env.PG__PORT,
  username: env.PG_USER,
  password: env.PG_PASSWORD,
  database: env.PG__DB_NAME,
  schema: env.PG_SCHEMA,
  ssl: getSsl(),
  poolSize: env.PG__MAX_POOL,
  logging: getLogLevels(),
  entities: ['dist/**/*.entity.{ts,js}'],
  seeds: ['dist/**/db/seeds/*.seeder.{ts,js}'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
