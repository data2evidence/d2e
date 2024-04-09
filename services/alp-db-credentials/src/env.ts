import { config } from 'dotenv'
config()

type LoggingLevel = 'info' | 'warn' | 'error'

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.DB_CREDENTIALS_MGR__PORT) || 9007,
  LOG_LEVEL: (process.env.DB_CREDENTIALS_MGR__LOG_LEVEL as LoggingLevel) || 'info',
  DATABASE_CREDENTIALS: process.env.DATABASE_CREDENTIALS,
  PG_HOST: process.env.PG__HOST,
  PG_PORT: Number(process.env.PG__PORT),
  PG_DATABASE: process.env.PG__DB_NAME,
  PG_SCHEMA: process.env.PG__DB_CREDENTIALS_MGR__SCHEMA,
  PG_USER: process.env.PG__DB_CREDENTIALS_MGR__USER,
  PG_PASSWORD: process.env.PG__DB_CREDENTIALS_MGR__PASSWORD,
  PG_MANAGE_USER: process.env.PG__DB_CREDENTIALS_MGR__MANAGE_USER,
  PG_MANAGE_PASSWORD: process.env.PG__DB_CREDENTIALS_MGR__MANAGE_PASSWORD,
  PG_SSL: process.env.PG__SSL,
  PG_CA_ROOT_CERT: process.env.PG__CA_ROOT_CERT,
  PG_MAX_POOL: Number(process.env.PG__MAX_POOL) || 10,
  VALID_CLIENT_CREDENTIAL_IDS: process.env.DB_CREDENTIALS_MGR__VALID_CLIENT_CREDENTIAL_IDS || '',
  SSL_PRIVATE_KEY: process.env.TLS__INTERNAL__KEY?.replace(/\\n/g, '\n'),
  SSL_PUBLIC_CERT: process.env.TLS__INTERNAL__CRT?.replace(/\\n/g, '\n'),
  DB_CREDENTIALS_CA_CERT: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, '\n')
}
