import _ from "lodash";
import {
  CombinedEnv,
  HanaConfig,
  IntTestConfig,
  PostgresConfig,
} from "./types";

export const serviceNames = {
  DB_SVC: "alp-minerva-db-mgmt-svc",
  ANALYTICS_SVC: "alp-minerva-analytics-svc",
  SQLEDITOR: "alp-sqleditor",
  CDW_SVC: "alp-minerva-cdw-svc",
} as const;

const cleanupOverwriteValues = (
  value: HanaConfig | PostgresConfig | IntTestConfig
) => {
  if (value.type === "HANA" || value.type === "POSTGRES") {
    delete value.analyticsSvcValues;
    delete value.dbSvcValues;
  }
};

export const processForComposeDbSvc = (
  databaseValues: CombinedEnv
): (HanaConfig | PostgresConfig)[] => {
  let values: (HanaConfig | PostgresConfig)[] = [];
  for (const value of databaseValues) {
    if (value.type === "HANA" || value.type === "POSTGRES") {
      value.values = _.merge(value.values, value.dbSvcValues);
      cleanupOverwriteValues(value);
      values.push(value);
    }
  }

  return values;
};

export const processForComposeSqleditor = (
  databaseValues: CombinedEnv
): string => {
  const interpreterprefix = `[notebook]
  [[interpreters]]`;
  const postgresConnStr = `[[[postgresql]]]
  name = PostgreSql
  interface=sqlalchemy
  options='{"url": "postgresql+psycopg2://{READ_USER}:{READ_USER_PASSWORD}@{HOST}:{PORT}/{DATABASE}"}'
  `;
  const hanaConnStr = `[[[db2]]]
  name = HANA
  interface=sqlalchemy
  options='{"url": "hana://{READ_USER}:{READ_USER_PASSWORD}@{HOST}:{PORT}/{DATABASE}"}'
  `;

  let interpretersText = "";
  for (const value of databaseValues) {
    let temp = "";
    if (value.type === "HANA") {
      temp = hanaConnStr;
    } else if (value.type === "POSTGRES") {
      temp = postgresConnStr;
    }

    temp = temp.replace(
      "{READ_USER}",
      (value as PostgresConfig | HanaConfig).values.credentials.readUser
    );
    temp = temp.replace(
      "{READ_USER_PASSWORD}",
      (value as PostgresConfig | HanaConfig).values.credentials.readPassword
    );
    temp = temp.replace(
      "{HOST}",
      (value as PostgresConfig | HanaConfig).values.host
    );
    temp = temp.replace(
      "{PORT}",
      (value as PostgresConfig | HanaConfig).values.port
    );
    temp = temp.replace(
      "{DATABASE}",
      (value as PostgresConfig | HanaConfig).values.databaseName
    );
    interpretersText += `\n ${temp}`;
  }

  return `${interpreterprefix}\n${interpretersText}`;
};

export const processForComposeAnalytics = (
  databaseValues: CombinedEnv
): (HanaConfig | PostgresConfig)[] => {
  let values: (HanaConfig | PostgresConfig)[] = [];
  for (const value of databaseValues) {
    if (value.type === "HANA" || value.type === "POSTGRES") {
      value.values = _.merge(value.values, value.analyticsSvcValues);
      cleanupOverwriteValues(value);
      values.push(value);
    }
  }

  return values;
};

export const processForComposeCdwSvc = (
  databaseValues: CombinedEnv
): PostgresConfig[] => {
  let values: PostgresConfig[] = [];
  for (const value of databaseValues) {
    if (value.type === "POSTGRES") {
      value.values = _.merge(value.values, value.cdwSvcValues);
      cleanupOverwriteValues(value);
      values.push(value);
    }
  }

  return values;
};

export const filterServiceCredentials = (
  databaseCredentialsStr: string,
  service: string
) => {
  const databaseCredentialsJson = JSON.parse(databaseCredentialsStr);
  let databaseCredentials: CombinedEnv = [];
  for (const value of databaseCredentialsJson) {
    if (value.tags.includes(service)) {
      databaseCredentials.push(value);
    }
  }
  return databaseCredentials;
};
