import process from "node:process";

const _env = Deno.env.toObject();

export const env = {
  SERVICE_ROUTES: process.env.SERVICE_ROUTES || "{}",
  NODE_ENV: _env.NODE_ENV,
  SSL_CA_CERT: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
  ADHOC_DEPLOYMENT_FLOWS_BUCKET_NAME:
    process.env.DATAFLOW_MGMT__ADHOC_FLOWS__PREFECT_S3_BUCKET_NAME ||
    "dataflow-adhoc-flows",
  GATEWAY_CA_CERT: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
  PG__HOST: _env.PG__HOST,
  PG__PORT: _env.PG__PORT,
  PG_ADMIN_USER: _env.PG_ADMIN_USER,
  PG_ADMIN_PASSWORD: _env.PG_ADMIN_PASSWORD,
  PG__DB_NAME: _env.PG__DB_NAME,
  PG_SCHEMA: "trex",
};

export const services = JSON.parse(env.SERVICE_ROUTES);
