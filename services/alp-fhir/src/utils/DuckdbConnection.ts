// import {
//     ConnectionInterface,
//     CallBackInterface,
//     ParameterInterface,
//     flattenParameter,
//     DBValues,
// } from "@alp/alp-base-utils/target/src/Connection";
// import { Connection, Database, OPEN_READONLY } from "duckdb-async";
// import { DBError } from "@alp/alp-base-utils/target/src/DBError";
// import { CreateLogger } from "@alp/alp-base-utils/target/src/Logger";
// import fs from 'fs';
// const logger = CreateLogger("Duckdb Connection");
// const DUCKDB_PATH = '../duckdb'

// // Helper function similar to getDBConnection implementation in alp-base-utils DBConnectionUtil.ts
// export const getDuckdbDBConnection = () => {
//     return new Promise<ConnectionInterface>(async (resolve, reject) => {
//         DuckdbConnection.createConnection(
//             async (err, connection: ConnectionInterface) => {
//                 if (err) {
//                     logger.error(err);
//                     reject(err);
//                 }
//                 resolve(connection);
//             }
//         );
//     });
// };

// export const getDefaultSchemaName = () => {
//     return `cdmdefault.duckdb`;
// }
// export class DuckdbConnection implements ConnectionInterface {
//     private constructor(
//         public database: Database,
//         public conn: Connection,
//         public schemaName: string,
//         public vocabSchemaName = schemaName,
//         public dialect = "DUCKDB"
//     ) {}
//     activate_nativedb_communication?(credentials: any): void {
//         throw new Error("Method not implemented.");
//     }
//     deactivate_nativedb_communication?(dbName: any): void {
//         throw new Error("Method not implemented.");
//     }

//     public static async createConnection(
//         callback
//     ) {
//         try {
//             let dbPathString = DUCKDB_PATH
//             if(fs.existsSync(dbPathString))
//             {
//                 const duckdDB = await Database.create(
//                     `${dbPathString}/${getDefaultSchemaName()}`,
//                     OPEN_READONLY
//                 );
//                 const duckdDBconn = await duckdDB.connect();
//                 const conn: DuckdbConnection = new DuckdbConnection(duckdDB, duckdDBconn, getDefaultSchemaName());
//                 callback(null, conn);
//             }
            
//         } catch (err: any) {
//             callback(err, null);
//         }
//     }

//     public parseResults(result: any) {
//         function formatResult(value: any) {
//             // TODO: investigate if more cases are needed to handle DATE, TIMESTAMP and BIT datetypes
//             switch (typeof value) {
//                 case "bigint": //bigint
//                     return Number(value) * 1;
//                 default:
//                     return value;
//             }
//         }
//         Object.keys(result).forEach((rowId) => {
//             Object.keys(result[rowId]).forEach((colKey) => {
//                 if (
//                     result[rowId][colKey] === null ||
//                     typeof result[rowId][colKey] === "undefined"
//                 ) {
//                     result[rowId][colKey] = DBValues.NOVALUE;
//                 } else {
//                     result[rowId][colKey] = formatResult(result[rowId][colKey]);
//                 }
//             });
//         });
//         return result;
//     }

//     public async execute(
//         sql,
//         parameters: ParameterInterface[],
//         callback: CallBackInterface
//     ) {
//         try {
//             logger.debug(`Sql: ${sql}`);
//             logger.debug(
//                 `parameters: ${JSON.stringify(flattenParameter(parameters))}`
//             );
//             let temp = sql;
//             //temp = this.parseSql(temp);
//             const result = await this.conn.all(
//                 temp,
//                 ...flattenParameter(parameters)
//             );
//             callback(null, result);
//         } catch (err: any) {
//             logger.error(err);
//             callback(new DBError(logger.error(err), err.message), null);
//         }
//     }

//     // private parseSql(temp: string): string {
//     //     return translateHanaToDuckdb(temp, this.schemaName, this.vocabSchemaName);
//     // }

//     public getTranslatedSql(sql: string): string {
//         throw new Error("Method not implemented.");
//     }

//     public executeQuery(
//         sql,
//         parameters: ParameterInterface[],
//         callback: CallBackInterface
//     ) {
//         try {
//             this.execute(sql, parameters, (err, resultSet) => {
//                 if (err) {
//                     logger.error(err);
//                     callback(err, null);
//                 } else {
//                     const result = this.parseResults(resultSet);
//                     callback(null, result);
//                 }
//             });
//         } catch (err: any) {
//             callback(new DBError(logger.error(err), err.message), null);
//         }
//     }

//     public async executeStreamQuery(
//         sql,
//         parameters: ParameterInterface[],
//         callback: CallBackInterface,
//         schemaName: string = ""
//     ) {
//         try {
//             //sql = this.getSqlStatementWithSchemaName(schemaName, sql);
//             //sql = this.parseSql(sql);
//             const stream = this.conn.stream(sql, ...flattenParameter(parameters));          
//             callback(null, stream);
//           } catch (err: any) {
//             logger.error(`Execute error: ${JSON.stringify(err)}
//             =>sql: ${sql}
//             =>parameters: ${JSON.stringify(parameters)}`);
//             callback(new DBError(logger.error(err), err.message), null);
//           }
//     }

//     public executeUpdate(
//         sql: string,
//         parameters: ParameterInterface[],
//         callback: CallBackInterface
//     ) {
//         try {
//             this.execute(sql, parameters, (err, result) => {
//                 if (err) {
//                     callback(new DBError(logger.error(err), err.stack), null);
//                 }
//                 callback(null, result.rowCount);
//             });
//         } catch (error) {
//             callback(error, null);
//         }
//     }

//     public executeProc(
//         procedure: string,
//         parameters: [],
//         callback: CallBackInterface
//     ) {
//         try {
//             const params = parameters.map((param) => "?");
//             const sql = `select count(*) from \"${procedure}\"(${params.join()})`;
//             logger.debug(`Sql: ${sql}`);
//             let temp = sql;
//             //temp = this.parseSql(temp);
//             this.conn.exec(temp, parameters, (err, result) => {
//                 if (err) {
//                     return callback(
//                         new DBError(logger.error(err), err.stack),
//                         null
//                     );
//                 }
//                 callback(null, result.rowCount);
//             });
//         } catch (err: any) {
//             callback(new DBError(logger.error(err), err.message), null);
//         }
//     }

//     public commit(callback?: CallBackInterface) {
//         this.conn.exec("COMMIT", (commitError) => {
//             if (commitError) {
//                 throw commitError;
//             }
//             if (callback) {
//                 callback(null, null);
//             }
//         });
//     }

//     public setAutoCommitToFalse() {
//         throw new Error("setAutoCommitToFalse is not yet implemented");
//     }

//     public async close() {
//         await this.database.close();
//         logger.debug(`Duckdb database connection has been closed`);
//     }

//     public executeBulkUpdate(
//         sql: string,
//         parameters: ParameterInterface[][],
//         callback: CallBackInterface
//     ) {
//         throw "executeBulkUpdate is not yet implemented";
//     }

//     public executeBulkInsert(
//         sql: string,
//         parameters: null[][],
//         callback: CallBackInterface
//     ) {
//         throw "executeBulkInsert is not yet implemented";
//     }
//     /**
//      * This methods sets the current application user to the DB session (i.e. XS.APPLICATIONUSER).
//      * This method must be called in the respective endpoints before performing any queries involving the guarded patients.
//      */
//     public setCurrentUserToDbSession(
//         user: string,
//         callback: CallBackInterface
//     ) {
//         callback(null, null);
//         // Users does not exist on duckdb connections
//     }

//     public setTemporalSystemTimeToDbSession(
//         systemTime: string,
//         cb: CallBackInterface
//     ) {
//         cb(null, null);
//         // throw "Setting Temporal System Time to DB session is not yet implemented";
//     }

//     public rollback(callback: CallBackInterface) {
//         // this.conn.rollBack((err) => {
//         //   if (err) {
//         //     err.code = "ECOMMIT";
//         //     return callback(new DBError(err.code, err.message), null);
//         //   } else {
//         //     callback(null, true);
//         //   }
//         // });

//         // Property 'rollBack' does not exist on type 'Pool'
//         throw "rollback is not yet implemented";
//     }

//     private getSqlStatementWithSchemaName(
//         schemaName: string,
//         sql: string,
//       ): string {
//         throw "rollback is not yet implemented";
//         // const replacement = schemaName === "" ? "" : `${schemaName}.`;
//         // return sql.replace(/\$\$SCHEMA\$\$./g, replacement);
//       }
// }
