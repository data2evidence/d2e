import { DBConnectionUtil as dbConnectionUtil } from "@alp/alp-base-utils";
import { Connection as connLib } from "@alp/alp-base-utils";
import ConnectionInterface = connLib.ConnectionInterface;
import { getDuckdbDBConnection } from "../../src/utils/DuckdbConnection";

export const credentialsMap = {
  postgresql: {
    host: "localhost",
    port: "35432",
    user: "postgres",
    password: "Toor1234",
    schema: "cdw_test_schema",
    dialect: "postgresql",
    database: "alp",
  }
};

/**
 * Connection helper
 *
 * @returns {Promise}
 */
export function createConnection(
  dialect: "postgresql" | "duckdb" = "postgresql"
): Promise<ConnectionInterface> {
  return new Promise<ConnectionInterface>(async (resolve, reject) => {
    if(dialect == 'duckdb'){
      let analyticsConnection = await getDuckdbDBConnection('alpdev_pg_cdmvocab', 'alpdev_pg_cdmvocab')
      resolve(analyticsConnection)
    }else{
      const credentials = credentialsMap[dialect];
      let client;
      dbConnectionUtil.DBConnectionUtil.getDbClient(credentials, (err, c) => {
        if (err) {
          reject(err);
        } else {
          client = c;
          dbConnectionUtil.DBConnectionUtil.getConnection(
            credentials.dialect,
            client,
            credentials.schema,
            (err, data) => {
              if (err) {
                reject(
                  new Error(`Error in setting schema = ${credentials.schema}`)
                );
              } else {
                resolve(data);
              }
            }
          );
        }
      });
    }
  });
}
