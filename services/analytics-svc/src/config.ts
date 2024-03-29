const isTest = process.env.isTestEnv && process.env.isHttpTestRun;

export const ALP_APP_ROUTER_GRAPHQL_ENDPOINT =
    process.env.ALP_APP_ROUTER_GRAPHQL_ENDPOINT;

export const ALP_PORTAL_PUBLIC_GRAPHQL_ENDPOINT =
    process.env.ALP_PORTAL_PUBLIC_GRAPHQL_ENDPOINT;

export const ALP_MINERVA_PORTAL_SERVER__URL =
    process.env.ALP_MINERVA_PORTAL_SERVER__URL;

export const ALP_GATEWAY_OAUTH__URL = process.env.ALP_GATEWAY_OAUTH__URL;

export const IDP_ALP_SVC_CLIENT_ID = process.env.IDP__ALP_SVC__CLIENT_ID;

export const IDP_ALP_SVC_CLIENT_SECRET =
    process.env.IDP__ALP_SVC__CLIENT_SECRET;

export const USE_EXTENSION_FOR_COHORT_CREATION =
    process.env.USE_EXTENSION_FOR_COHORT_CREATION;

export const DATAFLOW__BASE_URL = process.env.DATAFLOW__BASE_URL;

export const DUCKDB_DATA_FOLDER = process.env.DUCKDB__DATA_FOLDER;
export const USE_DUCKDB = process.env.USE_DUCKDB;

export const ALP_MINERVA_PS_CONFIG_SERVER__URL = process.env.ALP_MINERVA_PS_CONFIG_SERVER__URL