import { PostgresConnection } from "@alp/alp-base-utils";
import { Pool } from "pg";

export class CdwConfigCachedbPostgresConnection extends PostgresConnection.PostgresConnection {
  public static createConnection(
    pool: Pool,
    schemaName,
    vocabSchemaName = schemaName,
    callback,
    dialect = "postgresql"
  ) {
    try {
      const conn = new CdwConfigCachedbPostgresConnection(
        pool,
        schemaName,
        vocabSchemaName,
        dialect
      );
      callback(null, conn);
    } catch (err) {
      callback(err, null);
    }
  }
  public parseSql(temp: string): string {
    // Specifically for cdw-config-svc, duckdb does not require direct connection to database.
    // $$$$SCHEMA$$$$ is the replacement, but will appear in the string as $$SCHEMA$$
    temp = temp.replace(/\$\$SCHEMA_DIRECT_CONN\$\$./g, "$$$$SCHEMA$$$$.");
    return super.parseSql(temp);
  }
}
