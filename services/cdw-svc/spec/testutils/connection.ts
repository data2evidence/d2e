import { DBConnectionUtil as dbConnectionUtil } from "@alp/alp-base-utils";
import { Connection as connLib } from "@alp/alp-base-utils";
import ConnectionInterface = connLib.ConnectionInterface;

const hanaSchemaName = process.env.TESTSCHEMA;

export const credentialsMap = {
  postgresql: {
    host: "localhost",
    port: "35432",
    user: "postgres",
    password: "Toor1234",
    schema: "cdw_test_schema",
    dialect: "postgresql",
    database: "alp",
  },
  hana: {
    host: process.env.HANASERVER,
    port: process.env.TESTPORT,
    user: process.env.HDIUSER ? process.env.HDIUSER : "SYSTEM",
    password: process.env.TESTSYSTEMPW,
    schema: hanaSchemaName,
    dialect: "hana",
  },
};

/**
 * HDB Connection helper
 *
 * @returns {Promise}
 */
export function createConnection(
  dialect: "postgresql" | "hana" = "postgresql"
): Promise<ConnectionInterface> {
  const credentials = credentialsMap[dialect];
  return new Promise<ConnectionInterface>((resolve, reject) => {
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
  });
}
