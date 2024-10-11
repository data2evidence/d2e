import process from "node:process";

export const env = {
  SERVICE_ROUTES: process.env.SERVICE_ROUTES || "{}",
  SSL_CA_CERT: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
  ADHOC_DEPLOYMENT_FLOWS_BUCKET_NAME:
    process.env.DATAFLOW_MGMT__ADHOC_FLOWS__PREFECT_S3_BUCKET_NAME ||
    "dataflow-adhoc-flows",
};

export const services = JSON.parse(env.SERVICE_ROUTES);
