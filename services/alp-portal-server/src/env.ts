import { config } from 'dotenv'
config()

type LoggingLevel = 'info' | 'warn' | 'error'

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORTAL_SERVER__PORT) || 3000,
  PORTAL_SERVER_LOG_LEVEL: (process.env.PORTAL_SERVER__LOG_LEVEL as LoggingLevel) || 'info',
  PORTAL_API_URL: process.env.PORTAL__API_URL,
  PA_CONFIG_API_URL: process.env.PA_CONFIG__API_URL,
  USER_MGMT_API_URL: process.env.USER_MGMT__API_URL,
  APP_DEPLOY_MODE: process.env.APP__DEPLOY_MODE,

  MINIO_REGION: process.env.MINIO__REGION,
  MINIO_ENDPOINT: process.env.MINIO__ENDPOINT,
  MINIO_PORT: parseInt(process.env.MINIO__PORT),
  MINIO_SSL: process.env.MINIO_SSL === 'true',
  MINIO_ACCESS_KEY: process.env.MINIO__ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO__SECRET_KEY,

  PG_HOST: process.env.PG__HOST,
  PG_PORT: parseInt(<string>process.env.PG__PORT),
  PG_DATABASE: process.env.PG__PORTAL_SERVER__DB_NAME,
  PG_SCHEMA: process.env.PG__PORTAL_SERVER__SCHEMA,
  PG_USER: process.env.PG__PORTAL_SERVER__USER,
  PG_PASSWORD: process.env.PG__PORTAL_SERVER__PASSWORD,
  PG_MANAGE_USER: process.env.PG__PORTAL_SERVER__MANAGE_USER,
  PG_MANAGE_PASSWORD: process.env.PG__PORTAL_SERVER__MANAGE_PASSWORD,
  PG_SSL: process.env.PG__SSL,
  PG_CA_ROOT_CERT: process.env.PG__CA_ROOT_CERT,
  PG_MAX_POOL: parseInt(process.env.PG__MAX_POOL) || 10,

  TENANT_ID: process.env.APP__TENANT_ID,
  TENANT_NAME: process.env.APP__TENANT_NAME,
  SYSTEM_NAME: process.env.ALP__SYSTEM_NAME,
  PORTAL_PLUGINS: process.env.PLUGINS__JSON,

  ANALYTICS_SVC_API_BASE_URL: process.env.ANALYTICS_SVC__API_BASE_URL
}
