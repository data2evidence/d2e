// Setting MAX_PACKET_SIZE in node-hdb prevents failure of large sql statements https://github.com/SAP/node-hdb/issues/19
/* tslint:disable no-var-requires */
// require("hdb/lib/protocol/common/Constants").MAX_PACKET_SIZE = Math.pow(2, 30);
import { Logger, User, Connection, QueryObject } from "@alp/alp-base-utils";
// import { CachedbNodeHDBConnection } from "@alp/alp-base-utils";
import { CachedbDBConnectionUtil } from "@alp/alp-base-utils";
import { CdwConfigCachedbPostgresConnection } from "./CdwConfigCachedbPostgresConnection";
import CreateLogger = Logger.CreateLogger;
import ConnectionInterface = Connection.ConnectionInterface;
const logger = CreateLogger("CdwConfigCachedbDBConnectionUtil");

export class CdwConfigCachedbDBConnectionUtil extends CachedbDBConnectionUtil.CachedbDBConnectionUtil {
  public static getConnection(
    dialect: string,
    client: any,
    schemaName: string,
    vocabSchemaName?: string,
    cb?,
    userObj?: User
  ): Promise<Connection.ConnectionInterface> {
    return new Promise((resolve, reject) => {
      const callback =
        cb ||
        ((err, connection) => {
          if (err) {
            return reject(err);
          }
          resolve(connection);
        });
      if (dialect === "postgresql" || dialect === "duckdb") {
        CdwConfigCachedbPostgresConnection.createConnection(
          client,
          schemaName,
          vocabSchemaName,
          callback
        );
      } else {
        // CachedbNodeHDBConnection.CachedbNodeHDBConnection.createConnection(
        //   client,
        //   schemaName,
        //   vocabSchemaName,
        //   async (err, connection: ConnectionInterface) => {
        //     if (err) {
        //       return callback(err);
        //     }

        //     let currentUser;

        //     if (userObj) {
        //       currentUser = userObj.getUser();
        //     }

        //     if (!currentUser) {
        //       logger.debug(
        //         "No user supplied. Cannot set HANA Connection APPLICATIONUSER"
        //       );
        //       return callback(null, connection);
        //     }

        //     try {
        //       await QueryObject.format(
        //         `SET 'APPLICATIONUSER' = '${currentUser}'`
        //       ).executeUpdateAsync(connection);

        //       return callback(null, connection);
        //     } catch (err) {
        //       callback(err);
        //     }
        //   }
        // );
      }
    });
  }
}
