import DBDAO from "../dao/DBDAO";
// import { ConnectionInterface } from "../utils/NodePgConnection";
import { ConnectionInterface } from "../utils/Connection";
import { DB } from "../utils/config";
export const deleteDatabaseSchema = async (
  tenantDatabase: string,
  schemas: string[],
  callback: any
) => {
  const dialect = DB.POSTGRES;
  const dbDao = new DBDAO(dialect);
  const pgDBConnection = await dbDao.getDBConnectionByTenantPromise(
    tenantDatabase
  );

  function deleteSchema(schemaName: string) {
    return new Promise((resolve, reject) => {
      pgDBConnection.executeQuery(
        `DROP SCHEMA IF EXISTS ${schemaName} CASCADE`,
        [],
        (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  for (const schemaName of schemas) {
    await deleteSchema(schemaName).catch((err) => {
      pgDBConnection.close();
      callback(false);
    });
  }
  pgDBConnection.close();
  callback(true);
};

export const executeSqlPromise = (
  tenantDatabase: string,
  sqlStatement: string
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const dialect = DB.POSTGRES;
      const dbDao = new DBDAO(dialect);
      const pgDBConnection = await dbDao.getDBConnectionByTenantPromise(
        tenantDatabase
      );
      pgDBConnection.execute(sqlStatement, [], (err: any, result: any) => {
        pgDBConnection.close();
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
};