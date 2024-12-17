const _env = Deno.env.toObject();

export const env = {
  NODE_ENV: _env.NODE_ENV,
  TENANT_ID: _env.APP_TENANT_ID,
  TENANT_NAME: _env.APP__TENANT_NAME,
  SYSTEM_NAME: _env.ALP__SYSTEM_NAME,

  PORTAL_PLUGINS: _env.PORTAL_PLUGINS,

  PG_HOST: _env.PG__HOST,
  PG_PORT: parseInt(<string>_env.PG__PORT),
  PG_DATABASE: _env.PG__PORTAL_SERVER__DB_NAME,
  PG_SCHEMA: _env.PG__PORTAL_SERVER__SCHEMA,
  PG_USER: _env.PG__PORTAL_SERVER__USER,
  PG_PASSWORD: _env.PG__PORTAL_SERVER__PASSWORD,
  PG_MANAGE_USER: _env.PG__PORTAL_SERVER__MANAGE_USER,
  PG_MANAGE_PASSWORD: _env.PG__PORTAL_SERVER__MANAGE_PASSWORD,
  PG_SSL: _env.PG__SSL,
  PG_CA_ROOT_CERT: _env.PG__CA_ROOT_CERT,
  PG_MAX_POOL: parseInt(_env.PG__MAX_POOL) || 10,

  MINIO_ENDPOINT: "alp-minerva-s3",
  MINIO_PORT: 9000,
  MINIO_SSL: false,
  MINIO_REGION: "ap-southeast-1",
  MINIO_ACCESS_KEY: "${MINIO__SECRET_KEY}",
  MINIO_SECRET_KEY: "${MINIO__SECRET_KEY}",

  SSL_CA_CERT: _env.SSL_CA_CERT
}

export const services = {
  analytics: _env.ANALYTICS_URL,
  // paConfig: _env.PA_CONFIG_URL,
  // usermgmt: _env.USER_MGMT_URL
  usermgmt: "usermgmt_url",
  paConfig: "pa_config_url"
}
