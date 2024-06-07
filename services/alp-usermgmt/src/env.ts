type LoggingLevel = 'info' | 'warn' | 'error'

export const env = {
  USER_MGMT_PATH: process.env.USER_MGMT__PATH!,
  USER_MGMT_PORT: Number(process.env.USER_MGMT__PORT!) || 9002,
  USER_MGMT_LOG_LEVEL: (process.env.USER_MGMT__LOG_LEVEL as LoggingLevel) || 'info',
  USER_MGMT_IDP_SUBJECT_PROP: process.env.USER_MGMT__IDP_SUBJECT_PROP!,
  PG_HOST: process.env.PG__HOST!,
  PG_PORT: Number(process.env.PG__PORT!),
  PG_DB_NAME: process.env.PG__USER_MGMT__DB_NAME!,
  PG_SCHEMA: process.env.PG__USER_MGMT__SCHEMA!,
  PG_USER: process.env.PG__USER_MGMT__USER!,
  PG_PASSWORD: process.env.PG__USER_MGMT__PASSWORD!,
  PG_ADMIN_USER: process.env.PG__USER_MGMT__ADMIN_USER!,
  PG_ADMIN_PASSWORD: process.env.PG__USER_MGMT__ADMIN_PASSWORD!,
  PG_CA_ROOT_CERT: process.env.PG__CA_ROOT_CERT,
  PG_MIN_POOL: Number(process.env.PG__MIN_POOL) || 2,
  PG_MAX_POOL: Number(process.env.PG__MAX_POOL) || 10,
  PG_DEBUG: Boolean(Number(process.env.PG_DEBUG)) || false,
  PG__IDLE_TIMEOUT_IN_MS: Number(process.env.PG__IDLE_TIMEOUT_IN_MS) || 30000,
  NIFI_MGMT_BASE_URL: process.env.NIFI_MGMT__BASE_URL,
  ALP_SYSTEM_NAME: process.env.ALP__SYSTEM_NAME,
  APP_TENANT_ID: process.env.APP__TENANT_ID,
  IDP_BASE_URL: process.env.IDP__BASE_URL,
  IDP_RELYING_PARTY: process.env.IDP__RELYING_PARTY,
  IDP_FETCH_USER_INFO_TYPE: process.env.IDP__FETCH_USER_INFO_TYPE,
  IDP_ALP_ADMIN_CLIENT_ID: process.env.IDP__ALP_ADMIN__CLIENT_ID,
  IDP_ALP_ADMIN_CLIENT_SECRET: process.env.IDP__ALP_ADMIN__CLIENT_SECRET,
  IDP_ALP_ADMIN_RESOURCE: process.env.IDP__ALP_ADMIN__RESOURCE,
  SSL_PRIVATE_KEY: process.env.TLS__INTERNAL__KEY?.replace(/\\n/g, '\n'),
  SSL_PUBLIC_CERT: process.env.TLS__INTERNAL__CRT?.replace(/\\n/g, '\n'),
  SSL_CA_CERT: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, '\n'),
  SERVICE_ROUTES: process.env.SERVICE_ROUTES || '{}'
}

export const services = JSON.parse(env.SERVICE_ROUTES)
