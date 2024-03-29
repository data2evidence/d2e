import DBDAO from "../dao/DBDAO";
// import { NodeHDBConnection } from "../utils/NodeHDBConnection";
import { DB } from "../utils/config";

export const deleteDatabaseSchemaAndAuditPolicy = async (
  tenantDatabase: string,
  schemas: string[],
  callback: any
) => {
  const dialect = DB.HANA;
  const dbDao = new DBDAO(dialect);
  const hanaDBConnection = await dbDao.getDBConnectionByTenantPromise(
    tenantDatabase
  );

  hanaDBConnection.executeProc(
    `SP::DELETE_SCHEMA_AND_AUDIT_POLICY`,
    [schemas.join(",")],
    (err: any, result: any) => {
      // If delete is successful, result is returned as "undefined"
      hanaDBConnection.close();
      // Returns callback false if any error
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    }
  );
};

export const deleteDatabaseSchemaAndAuditPolicyPromise = (
  tenantDatabase: string,
  schemas: string[]
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const dialect = DB.HANA;
      const dbDao = new DBDAO(dialect);
      const hanaDBConnection = await dbDao.getDBConnectionByTenantPromise(
        tenantDatabase
      );
      hanaDBConnection.executeProc(
        `SP::DELETE_SCHEMA_AND_AUDIT_POLICY`,
        [schemas.join(",")],
        (err: any, result: any) => {
          // If delete is successful, result is returned as "undefined"
          hanaDBConnection.close();
          // Returns callback false if any error
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const executeSql = async (
  tenantDatabase: string,
  sqlStatement: string,
  callback: any
) => {
  const dialect = DB.HANA;
  const dbDao = new DBDAO(dialect);
  const hanaDBConnection = await dbDao.getDBConnectionByTenantPromise(
    tenantDatabase
  );

  hanaDBConnection.execute(sqlStatement, [], (err: any, result: any) => {
    hanaDBConnection.close();
    callback(result);
  });
};

export const executeSqlPromise = (
  tenantDatabase: string,
  sqlStatement: string
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const dialect = DB.HANA;
      const dbDao = new DBDAO(dialect);
      const hanaDBConnection = await dbDao.getDBConnectionByTenantPromise(
        tenantDatabase
      );
      hanaDBConnection.execute(sqlStatement, [], (err: any, result: any) => {
        hanaDBConnection.close();
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

export const getRandomNumber = (max: number) => {
  return Math.floor(Math.random() * max);
};
