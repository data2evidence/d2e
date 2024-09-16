import { Connection } from "@alp/alp-base-utils";
import { env } from "../configs";
import { CachedbDBConnectionUtil } from "@alp/alp-base-utils/target/src/cachedb/CachedbDBConnectionUtil";
import { getCachedbDatabaseFormatProtocolB } from "@alp/alp-base-utils";
import {
  DUCKDB_FILE_DATABASE_CODE,
  DUCKDB_FILE_SCHEMA_NAME,
} from "../qe/settings/Defaults";
import { IDBCredentialsType } from "../types";

export const getCachedbDbConnections = async ({
  userObj,
  token,
}): Promise<Connection.ConnectionInterface> => {
  const dialect = "duckdb";

  let cachedbDatabase = getCachedbDatabaseFormatProtocolB(
    dialect,
    DUCKDB_FILE_DATABASE_CODE,
    DUCKDB_FILE_SCHEMA_NAME,
    DUCKDB_FILE_SCHEMA_NAME
  );

  const credentials: IDBCredentialsType = {
    dialect,
    host: env.CACHEDB__HOST,
    port: env.CACHEDB__PORT,
    database: cachedbDatabase,
    user: token,
    schema: DUCKDB_FILE_SCHEMA_NAME,
    password: "dummy", // Password not used for alp-cachedb connections
  };

  // Overwrite analyticsCrendential values to connect to cachedb

  const connection = await CachedbDBConnectionUtil.getDBConnection({
    credentials: credentials,
    schemaName: DUCKDB_FILE_SCHEMA_NAME,
    vocabSchemaName: DUCKDB_FILE_SCHEMA_NAME,
    userObj,
  });
  return connection;
};
