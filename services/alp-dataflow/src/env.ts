import { config } from 'dotenv'
config()

type LoggingLevel = 'info' | 'warn' | 'error'

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.DATAFLOW_MGMT__PORT) || 3000,
  APP_LOG_LEVEL: (process.env.DATAFLOW_MGMT__LOG_LEVEL as LoggingLevel) || 'info',
  ADHOC_FLOWS_SB: process.env.DATAFLOW_MGMT__ADHOC_FLOWS__PREFECT_SB_NAME || 'dataflow-adhoc-flows-sb',
  ADHOC_DEPLOYMENT_FLOWS_BUCKET_NAME:
    process.env.DATAFLOW_MGMT__ADHOC_FLOWS__PREFECT_S3_BUCKET_NAME || 'dataflow-adhoc-flows',

  MINIO_ENDPOINT: process.env.MINIO__ENDPOINT,
  MINIO_PORT: parseInt(process.env.MINIO__PORT),
  MINIO_ACCESS_KEY: process.env.MINIO__ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO__SECRET_KEY,

  PG_HOST: process.env.PG__HOST,
  PG_PORT: parseInt(process.env.PG__PORT),
  PG_DATABASE: process.env.PG__DATAFLOW_MGMT__DB_NAME,
  PG_SCHEMA: process.env.PG__DATAFLOW_MGMT__SCHEMA,
  PG_USER: process.env.PG__DATAFLOW_MGMT__USER,
  PG_PASSWORD: process.env.PG__DATAFLOW_MGMT__PASSWORD,
  PG_MANAGE_USER: process.env.PG__DATAFLOW_MGMT__MANAGE_USER,
  PG_MANAGE_PASSWORD: process.env.PG__DATAFLOW_MGMT__MANAGE_PASSWORD,
  PG_SSL: process.env.PG__SSL,
  PG_CA_ROOT_CERT: process.env.PG__CA_ROOT_CERT,
  PG_MAX_POOL: parseInt(process.env.PG__MAX_POOL) || 10,

  SSL_PRIVATE_KEY: process.env.TLS__INTERNAL__KEY?.replace(/\\n/g, '\n'),
  SSL_PUBLIC_CERT: process.env.TLS__INTERNAL__CRT?.replace(/\\n/g, '\n'),
  SSL_CA_CERT: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, '\n'),

  SERVICE_ROUTES: process.env.SERVICE_ROUTES || '{}'
}

export const services = JSON.parse(env.SERVICE_ROUTES)
