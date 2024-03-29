import { config } from 'dotenv'
config()

type LoggingLevel = 'info' | 'warn' | 'error'

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.DATAFLOW_MGMT__PORT) || 3000,
  APP_LOG_LEVEL: (process.env.DATAFLOW_MGMT__LOG_LEVEL as LoggingLevel) || 'info',
  ADHOC_FLOWS_SB: process.env.DATAFLOW_MGMT__ADHOC_FLOWS__PREFECT_SB_NAME || 'dataflow-adhoc-flows-sb',

  PREFECT_API_URL: process.env.PREFECT__API_URL,
  PORTAL_SERVER_API_URL: process.env.PORTAL_SERVER__API_URL,
  ANALYTICS_SVC_API_URL: process.env.ANALYTICS_SVC__API_URL,

  MINIO_ENDPOINT: process.env.MINIO__ENDPOINT,
  MINIO_PORT: parseInt(process.env.MINIO__PORT),
  MINIO_ACCESS_KEY: process.env.MINIO__ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO__SECRET_KEY,

  PREFECT_DEPLOYMENT_NAME: process.env.DATAFLOW_MGMT__PREFECT__DEPLOYMENT_NAME,
  PREFECT_FLOW_NAME: process.env.DATAFLOW_MGMT__PREFECT__FLOW_NAME,

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
  PG_MAX_POOL: parseInt(process.env.PG__MAX_POOL) || 10
}
