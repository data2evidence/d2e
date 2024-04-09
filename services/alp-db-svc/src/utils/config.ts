require("dotenv").config({ debug: process.env.DEBUG });
import { HealthCheckError } from "@godaddy/terminus";
import winston from "winston";
import { readFileSync } from "fs";
import * as utils from "./baseUtils";
import {
  IDBHanaCredentialsType,
  IDBPgCredentialsType,
  IHanaTenantConfig,
  IPgTenantConfig,
} from "./types";

let properties: object;
let logger: winston.Logger;

export const getProperties = (): any => {
  if (!properties) {
    const isProd = process.env.NODE_ENV === "production";
    const k8sPathPrefix = "/var/alp-db-svc";
    properties = {
      alp_db_http_port: Number(process.env.DB_SVC__PORT),
      alp_db_base_path: String(process.env.DB_SVC__PATH),
      alp_system_id: String(process.env.ALP__SYSTEM_ID),
      user_mgmt_base_url: String(process.env.USER_MGMT__BASE_URL),
      dataflow_mgmt_api_base_url: String(
        process.env.DATAFLOW_GATEWAY__BASE_URL
      ),
      sub_prop: String(process.env.DB_SVC__IDP_SUBJECT_PROP),
      skip_auth:
        process.env.NODE_ENV === "test" || process.env.NODE_ENV === "script"
          ? true
          : utils.getBoolean(process.env.SKIP_AUTH),
      hana_tenant_configs: isProd
        ? readFileSync(`${k8sPathPrefix}/HANA_TENANT_CONFIGS`, "utf-8")
        : process.env.HANA__TENANT_CONFIGS,
      hana_read_role: isProd
        ? utils.strUC(readFileSync(`${k8sPathPrefix}/HANA_READ_ROLE`, "utf-8"))
        : utils.strUC(process.env.HANA__READ_ROLE),
      omop_vocab_schema: isProd
        ? utils.strUC(
            readFileSync(`${k8sPathPrefix}/OMOP_VOCAB_SCHEMA`, "utf-8").split(
              ","
            )
          )
        : String(process.env.OMOP__VOCAB_SCHEMA).split(","),
      postgres_tenant_configs: isProd
        ? readFileSync(`${k8sPathPrefix}/POSTGRES_TENANT_CONFIGS`, "utf-8")
        : process.env.PG__TENANT_CONFIGS,
      postgres_read_role: isProd
        ? utils.strUC(
            readFileSync(`${k8sPathPrefix}/POSTGRES_READ_ROLE`, "utf-8")
          )
        : process.env.PG__READ_ROLE,
      ssl_public_key: isProd
        ? readFileSync(`${k8sPathPrefix}/SSL_PUBLIC_CERT`, "utf-8")
        : process.env.TLS__INTERNAL__CRT
        ? process.env.TLS__INTERNAL__CRT.replace(/\\n/g, "\n")
        : null,
      ssl_private_key: isProd
        ? readFileSync(`${k8sPathPrefix}/SSL_PRIVATE_KEY`, "utf-8")
        : process.env.TLS__INTERNAL__KEY
        ? process.env.TLS__INTERNAL__KEY.replace(/\\n/g, "\n")
        : null,
      db_svc_ca_cert: isProd
        ? process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n")
        : null,
      minio_region: isProd
        ? readFileSync(`${k8sPathPrefix}/MINIO__REGION`, "utf-8")
        : process.env.MINIO__REGION,
      minio_endpoint: isProd
        ? readFileSync(`${k8sPathPrefix}/MINIO__ENDPOINT`, "utf-8")
        : process.env.MINIO__ENDPOINT,
      minio_port: isProd
        ? readFileSync(`${k8sPathPrefix}/MINIO__PORT`, "utf-8")
        : process.env.MINIO__PORT,
      minio_ssl: isProd
        ? readFileSync(`${k8sPathPrefix}/MINIO__SSL`, "utf-8")
        : process.env.MINIO__SSL,
      minio_access_key: isProd
        ? readFileSync(`${k8sPathPrefix}/MINIO__ACCESS_KEY`, "utf-8")
        : process.env.MINIO__ACCESS_KEY,
      minio_secret_key: isProd
        ? readFileSync(`${k8sPathPrefix}/MINIO__SECRET_KEY`, "utf-8")
        : process.env.MINIO__SECRET_KEY,
    };

    if (process.env.NODE_ENV === "test") {
      properties = {
        ...properties,
        hana_tenant_configs: process.env.INTEGRATION_TEST__HANA__TENANT_CONFIGS,
      };
    }
  }

  return properties;
};

export const getTenantConfigs = (dialect: string) => {
  let input;
  if (dialect === DB.POSTGRES) {
    input = getProperties()["postgres_tenant_configs"];
  } else if (dialect === DB.HANA) {
    input = getProperties()["hana_tenant_configs"];
  } else {
    throw new Error(
      `Error loading tenant configs, dialect:${dialect} is not supported`
    );
  }
  if (input) {
    return JSON.parse(String(input));
  } else {
    throw new Error("Invalid JSON string");
  }
};

function getTenantConfigByTenant(dialect: string, tenant: string) {
  let tenantConfigs = getTenantConfigs(dialect);
  return tenantConfigs[tenant];
}

function getHanaTenantConfigByTenant(tenant: string): IHanaTenantConfig {
  let hanaTenantConfigs = getTenantConfigs(DB.HANA);
  // logger.info(`hanaTenantConfigs:\n${JSON.stringify(hanaTenantConfigs, null, 4)}`);
  return hanaTenantConfigs[tenant];
}

// This config is mainly used to connect to Hana DB
function getHanaConfigByTenant(tenant: string): IDBHanaCredentialsType {
  let hanaTenantConfig: IHanaTenantConfig = getHanaTenantConfigByTenant(tenant);
  return {
    host: hanaTenantConfig.host,
    port: hanaTenantConfig.port,
    user: hanaTenantConfig.hanaAdminUser,
    password: hanaTenantConfig.hanaAdminPassword,
    databaseName: hanaTenantConfig.databaseName,
    validate_certificate: utils.getBoolean(
      hanaTenantConfig.validate_certificate
    ),
    sslTrustStore: hanaTenantConfig.sslTrustStore,
    pooling: utils.getBoolean(hanaTenantConfig.pooling),
    autoCommit: utils.getBoolean(hanaTenantConfig.autoCommit),
    encrypt: utils.getBoolean(hanaTenantConfig.encrypt),
    useTLS: utils.getBoolean(hanaTenantConfig.encrypt),
    rejectUnauthorized: false, // TODO: remove when self-signed certs are removed
    hostname_in_certificate: hanaTenantConfig.host,
    sslCryptoProvider: "sapcrypto",
    dialect: DB.HANA,
  };
}

function getPgTenantConfigByTenant(tenant: string): IPgTenantConfig {
  let pgTenantConfigs = getTenantConfigs(DB.POSTGRES);
  // logger.info(`pgTenantConfigs:\n${JSON.stringify(pgTenantConfigs, null, 4)}`);
  return pgTenantConfigs[tenant];
}

function getPgConfigByTenant(tenant: string): IDBPgCredentialsType {
  let pgTenantConfig: IPgTenantConfig = getPgTenantConfigByTenant(tenant);
  return {
    host: pgTenantConfig.host,
    port: pgTenantConfig.port,
    database: pgTenantConfig.databaseName,
    user: pgTenantConfig.postgresAdminUser,
    password: pgTenantConfig.postgresAdminPassword,
    ssl: pgTenantConfig.ssl,
    connectionTimeoutMillis: pgTenantConfig.connectionTimeoutMillis,
    idle_in_transaction_session_timeout:
      pgTenantConfig.idle_in_transaction_session_timeout,
    query_timeout: pgTenantConfig.query_timeout,
    statement_timeout: pgTenantConfig.statement_timeout,
    dialect: DB.POSTGRES,
  };
}

export function getLogger() {
  if (!logger) {
    logger = winston.createLogger({
      level: process.env.DB_SVC__LOG_LEVEL,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.colorize(),
            winston.format.printf((nfo) => {
              return `[${nfo.timestamp}] ${nfo.level}: ${nfo.message}`;
            })
          ),
        }),
      ],
    });
  }
  return logger;
}

export function getTerminusOptions(
  logger: winston.Logger,
  appBasePath: string
): object {
  const options: any = {
    // cleanup options
    timeout: 5000, // [optional = 1000] number of milliseconds before forceful exiting
    logger: logger.error, // [optional] logger function to be called with errors.
    onShutdown: () => {
      logger.error("Server shutting down..");
    },
  };

  const health: any = {
    verbatim: true, // [optional = false] use object returned from /healthcheck verbatim in response
  };

  health[`${appBasePath}/health`] = async function () {
    // a function returning a promise indicating service health,
    const errors: any[] = [];
    return Promise.all(
      [
        // all your health checks goes here
      ].map((p: any) =>
        p.catch((error: Error) => {
          // silently collecting all the errors
          errors.push(error);
          return undefined;
        })
      )
    ).then(() => {
      if (errors.length) {
        throw new HealthCheckError("healthcheck failed", errors);
      }
    });
  };
  options["healthChecks"] = health; // health check options
  return options;
}

export function getChangeLogFile(dialect: String, dataModel: String) {
  let changeLogFile;
  //this will happen
  switch (dataModel) {
    case ALP_DATA_MODELS.PATHOLOGY:
      changeLogFile = "liquibase-changelog_pathology.xml";
      break;
    case ALP_DATA_MODELS.BIO_ME:
      changeLogFile = "liquibase-bio-me.xml";
      break;
    case ALP_DATA_MODELS.RADIOLOGY:
      changeLogFile = "liquibase-radiology.xml";
      break;
    case ALP_DATA_MODELS.CUSTOM_OMOP_MS:
      changeLogFile = "liquibase-custom-omop-ms.xml";
      break;
    case ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI:
      changeLogFile = "liquibase-custom-omop-ms-phi.xml";
      break;
    case ALP_DATA_MODELS.OMOP5_4:
    default:
      changeLogFile = "liquibase-changelog-5-4.xml";
      break;
    case ALP_DATA_MODELS.OMOP:
      changeLogFile = "liquibase-changelog.xml";
      break;
    case ALP_DATA_MODELS.REPORTING_BI:
      changeLogFile = "liquibase-reporting-bi.xml";
      break;
    case ALP_STAGING_AREAS.FHIR_DATA:
      changeLogFile = "liquibase-fhir-data.xml";
      break;
    case CDM.CHARACTERIZATION:
      changeLogFile = "liquibase-characterization.xml";
      break;
    case ALP_DATA_MODELS.GENOMICS:
      changeLogFile = "liquibase-genomics.xml";
  }
  return `db/migrations/${dialect}/${changeLogFile}`;
}

export function getMigrationToolConfig(
  dialect: string,
  tenant: string,
  schema: string,
  dataModel: string,
  pluginChangelogFilepath?: string | undefined,
  pluginClasspath?: string | undefined
): any {
  let changeLogFile = pluginChangelogFilepath
    ? pluginChangelogFilepath
    : getChangeLogFile(dialect, dataModel);

  // Set during prefect task run
  // Temporarily use as default class path for dbsvc endpoints not using plugin

  const modulePath = process.env.DEFAULT_MIGRATION_SCRIPTS_PATH
    ? ":" + process.env.DEFAULT_MIGRATION_SCRIPTS_PATH
    : "";

  const liquibasePath =
    process.env.LIQUIBASE_PATH ?? "db/migrations/liquibase/liquibase";

  if (dialect === DB.HANA) {
    let tenantConfig: IHanaTenantConfig = getTenantConfigByTenant(
      dialect,
      tenant
    );

    const hanaDriverPath =
      process.env.HANA__DRIVER_CLASS_PATH ??
      "/app/inst/drivers/ngdbc-latest.jar";
    let hanaClasspath = pluginClasspath
      ? `${hanaDriverPath}:${pluginClasspath}`
      : `${hanaDriverPath}${modulePath}`;

    logger.info(`hanaClasspath is ${hanaClasspath}`);

    const connectionBaseUrl = `jdbc:sap://${tenantConfig.host}:${tenantConfig.port}?`;
    const connectionProperties = [
      `databaseName=${utils.strUC(tenantConfig.databaseName)}`,
      `validateCertificate=${utils.getBoolean(
        tenantConfig.validate_certificate
      )}`,
      `encrypt=${utils.getBoolean(tenantConfig.encrypt)}`,
      `sslTrustStore=${tenantConfig.sslTrustStore}`,
      `hostNameInCertificate=${tenantConfig.host}`,
      `currentSchema=${utils.strUC(schema)}`,
    ].join("&");

    //For Liquibase
    return {
      changeLogFile: changeLogFile,
      url: `${connectionBaseUrl}${connectionProperties}`,
      classpath: hanaClasspath,
      username: tenantConfig.hanaAdminUser,
      password: tenantConfig.hanaAdminPassword,
      logLevel: process.env.LB__LOG_LEVEL,
      overwriteOutputFile: "true",
      driver: "com.sap.db.jdbc.Driver",
      defaultSchemaName: utils.strUC(schema),
      liquibaseSchemaName: utils.strUC(schema),
      headless: true,
      liquibase: liquibasePath,
    };
  } else if (dialect === DB.POSTGRES) {
    let tenantConfig: IPgTenantConfig = getTenantConfigByTenant(
      dialect,
      tenant
    );

    const postgresDriverPath =
      process.env.POSTGRES__DRIVER_CLASS_PATH ??
      "/app/inst/drivers/postgresql-42.3.1.jar";

    let postgresClasspath = pluginClasspath
      ? `${postgresDriverPath}:${pluginClasspath}`
      : `${postgresDriverPath}${modulePath}`;

    logger.info(`postgresClasspath is ${postgresClasspath}`);

    const connectionBaseUrl = `jdbc:postgresql://${tenantConfig.host}:${tenantConfig.port}/${tenantConfig.databaseName}?`;
    const connectionProperties = [
      `user=${tenantConfig.postgresAdminUser}`,
      `password=${tenantConfig.postgresAdminPassword}`,
      `currentSchema="${schema}"`,
    ].join("&");
    return {
      // Relevent documentation
      // https://docs.liquibase.com/commands/community/generatechangelog.html

      changeLogFile: changeLogFile,
      url: `${connectionBaseUrl}${connectionProperties}`,
      username: tenantConfig.postgresAdminUser,
      password: tenantConfig.postgresAdminPassword,
      classpath: postgresClasspath,
      logLevel: process.env.LB__LOG_LEVEL,
      driver: "org.postgresql.Driver",
      defaultSchemaName: schema,
      liquibaseSchemaName: schema,
      liquibase: liquibasePath,
    };
  }
}

export function getUpdateMaintenanceScriptConfig(
  tenant: string,
  schema: string
): any {
  let hanaTenantConfig: IHanaTenantConfig = getHanaTenantConfigByTenant(tenant);

  const liquibasePath =
    process.env.LIQUIBASE_PATH ?? "db/migrations/liquibase/liquibase";

  const connectionBaseUrl = `jdbc:sap://${hanaTenantConfig.host}:${hanaTenantConfig.port}?`;
  const connectionProperties = [
    `databaseName=${utils.strUC(hanaTenantConfig.databaseName)}`,
    `validateCertificate=${utils.getBoolean(
      hanaTenantConfig.validate_certificate
    )}`,
    `encrypt=${utils.getBoolean(hanaTenantConfig.encrypt)}`,
    `sslTrustStore=${hanaTenantConfig.sslTrustStore}`,
    `hostNameInCertificate=${hanaTenantConfig.host}`,
    `currentSchema=${utils.strUC(schema)}`,
  ].join("&");

  //For Liquibase
  return {
    changeLogFile:
      "db/migrations/hana/liquibase-maintenance-script-changelog.xml",
    url: `${connectionBaseUrl}${connectionProperties}`,
    classpath: "db/drivers/hana/ngdbc-latest.jar",
    username: hanaTenantConfig.hanaAdminUser,
    password: hanaTenantConfig.hanaAdminPassword,
    logLevel: process.env.LB__LOG_LEVEL,
    overwriteOutputFile: "true",
    driver: "com.sap.db.jdbc.Driver",
    defaultSchemaName: utils.strUC(schema),
    liquibaseSchemaName: utils.strUC(schema),
    headless: true,
    liquibase: liquibasePath,
  };
}

export function getCDMVersion(dataModel: string): string {
  let cdmVersion;

  switch (dataModel) {
    case ALP_DATA_MODELS.OMOP:
    case ALP_DATA_MODELS.CUSTOM_OMOP_MS:
    case ALP_DATA_MODELS.CUSTOM_OMOP_MS_PHI:
      cdmVersion = OMOP_VERSIONS.OMOP;
      break;
    case ALP_DATA_MODELS.OMOP5_4:
      cdmVersion = OMOP_VERSIONS.OMOP5_4;
      break;
    default:
      cdmVersion = "";
      break;
  }
  return cdmVersion;
}

export enum DB {
  HANA = "hana",
  POSTGRES = "postgres",
}

export enum ALP_DATA_MODELS {
  OMOP = "omop",
  OMOP5_4 = "omop5-4",
  CUSTOM_OMOP_MS = "custom-omop-ms",
  CUSTOM_OMOP_MS_PHI = "custom-omop-ms-phi",
  PATHOLOGY = "pathology",
  BIO_ME = "bio-me",
  REPORTING_BI = "reporting-bi",
  RADIOLOGY = "radiology",
  GENOMICS = "genomics",
}

export enum CDM {
  CHARACTERIZATION = "characterization",
}

export enum OMOP_VERSIONS {
  OMOP = "5.3",
  OMOP5_4 = "5.4",
}

export enum ALP_STAGING_AREAS {
  FHIR_DATA = "fhir_data",
}

export const handleCaseByDialect = (dialect: string, value: string) => {
  switch (dialect) {
    case DB.HANA:
      return utils.strUC(value);

    case DB.POSTGRES:
      return utils.strLC(value);

    default:
      throw `Invalid dialect ${dialect}`;
  }
};

export function getDBConfigByTenant(dialect: string, tenant: string) {
  switch (dialect) {
    case DB.HANA:
      return getHanaConfigByTenant(tenant);
    case DB.POSTGRES:
      return getPgConfigByTenant(tenant);
    default:
      return getHanaConfigByTenant(tenant);
  }
}

export function getAllTenants() {
  let tenants: Array<{ name: string; dialect: string }> = [];
  const hanaTenantConfigs = getTenantConfigs(DB.HANA);
  const postgresTenantConfigs = getTenantConfigs(DB.POSTGRES);
  Object.keys(hanaTenantConfigs).forEach((dbName) =>
    tenants.push({
      name: dbName,
      dialect: DB.HANA,
    })
  );
  Object.keys(postgresTenantConfigs).forEach((dbName) =>
    tenants.push({
      name: dbName,
      dialect: DB.POSTGRES,
    })
  );
  return tenants;
}

export function getTenants(dialect: string) {
  const tenants = new Array();
  const tenantConfigs = getTenantConfigs(dialect);
  Object.keys(tenantConfigs).forEach((key) => {
    tenants.push(key);
  });
  //logger.info(`tenants: ${JSON.stringify(tenants, null, 4)}`);
  return tenants;
}

export function getTenantConfigKeys(dialect: string) {
  if (dialect == DB.POSTGRES) {
    return {
      readUser: "postgresReadUser",
      readPassword: "postgresReadPassword",
      readRole: "postgres_read_role",
    };
  } else if (dialect == DB.HANA) {
    return {
      readUser: "hanaReadUser",
      readPassword: "hanaReadPassword",
      readRole: "hana_read_role",
    };
  } else {
    throw new Error(
      `Error loading tenant configs, dialect:${dialect} is not supported`
    );
  }
}

export function parseLatestVersion(liquibaseMessage: string): string {
  let undeployedChangesets: string[] = liquibaseMessage.split("\n");
  undeployedChangesets.pop(); // remove last element that is new line

  if (undeployedChangesets.length === 1) {
    // no undeployed changesets listed i.e. up to date
    return "up to date";
  } else {
    // undeployed changesets listed i.e. not up to date
    // get latest changeset filepath
    let latestChangesetFilepath = undeployedChangesets.pop()?.trim();
    let latestVersionID =
      typeof latestChangesetFilepath === "string" &&
      latestChangesetFilepath.length > 0
        ? getVersionID(latestChangesetFilepath.split("::")[0])
        : "";
    return latestVersionID;
  }
}

export function getVersionID(filepath: string) {
  let changelogFolder: string = filepath.split("/")[4];
  let changelogFileVersion: string = filepath.split("/")[5].split("_")[0];
  let versionID: string = changelogFolder + "_" + changelogFileVersion;
  return versionID;
}
