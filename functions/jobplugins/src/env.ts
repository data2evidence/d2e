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
};

export const services = JSON.parse(env.SERVICE_ROUTES);
