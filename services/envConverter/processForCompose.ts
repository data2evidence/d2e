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
      if (value.type === "POSTGRES") {
        value.values.dialect = "postgres";
      }
      value.values = _.merge(value.values, value.dbSvcValues);
      cleanupOverwriteValues(value);
      values.push(value);
    }
  }

  return values;
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
): HanaConfig [] => {
  let values: HanaConfig[] = [];
  for (const value of databaseValues) {
    if (value.type === "HANA") {
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
