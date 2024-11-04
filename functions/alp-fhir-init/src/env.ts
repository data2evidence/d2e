const _env = Deno.env.toObject();
console.log(JSON.stringify(_env))
export const env = {
  FHIR__CLIENT_ID: _env.FHIR__CLIENT_ID,
  FHIR__CLIENT_SECRET: _env.FHIR__CLIENT_SECRET,
  FHIR__LOG_LEVEL: _env.FHIR__LOG_LEVEL,
  PORT: Number(_env.PORT!),
  DUCKDB_PATH: _env.DUCKDB_PATH,
  PLUGIN_PATH: _env.PLUGIN_PATH,
  GATEWAY_CA_CERT: _env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, '\n'),
  IDP__ALP_DATA_CLIENT_ID: _env.IDP__ALP_DATA_CLIENT_ID,
  IDP__ALP_DATA__CLIENT_SECRET: _env.IDP__ALP_DATA__CLIENT_SECRET,
  ALP_GATEWAY_OAUTH__URL: _env.ALP_GATEWAY_OAUTH__URL,
  SERVICE_ROUTES: _env.SERVICE_ROUTES || '{}',
  PG_SUPER_USER: _env.PG_SUPER_USER,
  PG_SUPER_PASSWORD: _env.PG_SUPER_PASSWORD,
  PG__HOST: _env.PG__HOST,
  PG__PORT: _env.PG__PORT,
  PG__DB_NAME: _env.PG__DB_NAME
}
export const services = JSON.parse(env.SERVICE_ROUTES)