import {
  DBConnectionUtil as dbConnectionUtil,
  Connection as connection,
} from "@alp/alp-base-utils";

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

export function createConnection(
  cb: connection.CallBackInterface,
  dialect: "postgresql" | "hana" = "postgresql"
) {
  const credentials = credentialsMap[dialect];
  let client;
  dbConnectionUtil.DBConnectionUtil.getDbClient(credentials, (err, c) => {
    if (err) {
      throw err;
    }

    client = c;
    dbConnectionUtil.DBConnectionUtil.getConnection(
      credentials.dialect,
      client,
      credentials.schema,
      (err, data) => {
        if (err) {
          console.error("Error in seting default schema!");
        }

        cb(err, data);
      }
    );
  });
}
