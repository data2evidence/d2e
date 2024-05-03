import {
  DBConnectionUtil as dbConnectionUtil,
  Connection as connection,
} from "@alp/alp-base-utils";
import { getDuckdbDBConnection } from "../../../../src/utils/DuckdbConnection";
import { ConnectionInterface } from "@alp/alp-base-utils/target/src/Connection";

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

export function createConnection(
  cb: connection.CallBackInterface,
  dialect: "postgresql" | "duckdb" = "postgresql"
) {
  if(dialect == 'duckdb'){
    cb(null, new Promise<ConnectionInterface>(async (resolve, reject) => {
      let analyticsConnection = await getDuckdbDBConnection('alpdev_pg_cdmvocab', 'alpdev_pg_cdmvocab')
      resolve(analyticsConnection)
    })
  )
  }else{
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
}