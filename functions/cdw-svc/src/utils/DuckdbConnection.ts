import {
    Connection as c
} from "@alp/alp-base-utils";
type ConnectionInterface = c.ConnectionInterface;
type CallBackInterface = c.CallBackInterface;
type ParameterInterface = c.ParameterInterface;
const flattenParameter = c.flattenParameter;
const DBValues = c.DBValues;
import duckdb from "npm:duckdb";
import { DBError } from "@alp/alp-base-utils";
import { Logger } from "@alp/alp-base-utils";
import { translateHanaToDuckdb } from "../../../_shared/alp-base-utils/src/helpers/hanaTranslation.ts";

import fs from 'node:fs';
import { env } from "../configs";

import { DUCKDB_FILE_NAME } from "../qe/settings/Defaults";
const logger = Logger.CreateLogger("Duckdb Connection");

// Helper function similar to getDBConnection implementation in alp-base-utils DBConnectionUtil.ts
export const getDuckdbDBConnection = () => {
    return new Promise<ConnectionInterface>(async (resolve, reject) => {
        DuckdbConnection.createConnection(
            async (err, connection: ConnectionInterface) => {
                if (err) {
                    logger.error(err);
                    reject(err);
                }
                resolve(connection);
            }
        );
    });
};

export const getDefaultSchemaName = () => {
    return DUCKDB_FILE_NAME;
}

const _resolveDuckdbDatabaseFilePath = () => {
  /*
    Checks if there is a duckdb file in DUCKDB_PATH, if there is a file there, use it.
    Else fallback to using the built in duckdb file in BUILT_IN_DUCKDB_PATH
  */

  const defaultDuckdbFilePath = `${env.DUCKDB_PATH}/${getDefaultSchemaName()}`;

  if (existsSync(defaultDuckdbFilePath)) {
    logger.debug(`Using duckdb file from ${env.DUCKDB_PATH}`);
    return defaultDuckdbFilePath;
  } else {
    logger.debug(`Using built in duckdb file from ${env.BUILT_IN_DUCKDB_PATH}`);
    return `${env.BUILT_IN_DUCKDB_PATH}/${getDefaultSchemaName()}`;
  }
};

export class DuckdbConnection implements ConnectionInterface {
    private constructor(
        public database: any,
        public conn: any,
        public schemaName: string,
        public vocabSchemaName = schemaName,
        public dialect = "DUCKDB"
    ) {}

    public static async createConnection(
        callback
    ) {
        try {
            const duckdbFilePath = _resolveDuckdbDatabaseFilePath()        
            const duckdDB = await duckdb.Database.create(
                duckdbFilePath,
                duckdb.OPEN_READONLY
            );
            const duckdDBconn = await duckdDB.connect();
            const conn: DuckdbConnection = new DuckdbConnection(duckdDB, duckdDBconn, getDefaultSchemaName());
            callback(null, conn);
        } catch (err) {
            callback(err, null);
        }
    }

    public parseResults(result: any) {
        function formatResult(value: any) {
            // TODO: investigate if more cases are needed to handle DATE, TIMESTAMP and BIT datetypes
            switch (typeof value) {
                case "bigint": //bigint
                    return Number(value) * 1;
                default:
                    return value;
            }
        }
        Object.keys(result).forEach((rowId) => {
            Object.keys(result[rowId]).forEach((colKey) => {
                if (
                    result[rowId][colKey] === null ||
                    typeof result[rowId][colKey] === "undefined"
                ) {
                    result[rowId][colKey] = DBValues.NOVALUE;
                } else {
                    result[rowId][colKey] = formatResult(result[rowId][colKey]);
                }
            });
        });
        return result;
    }

    public async execute(
        sql,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            logger.debug(`Sql: ${sql}`);
            logger.debug(
                `parameters: ${JSON.stringify(flattenParameter(parameters))}`
            );
            let temp = sql;
            temp = this.parseSql(temp);
            const result = await this.conn.all(
                temp,
                ...flattenParameter(parameters)
            );
            callback(null, result);
        } catch (err) {
            logger.error(err);
            callback(new DBError(logger.error(err), err.message), null);
        }
    }

    private parseSql(temp: string): string {
        // Specifically for cdw-config-svc, duckdb does not require direct connection to database.
        // $$$$SCHEMA$$$$ is the replacement, but will appear in the string as $$SCHEMA$$ 
        temp = temp.replace(/\$\$SCHEMA_DIRECT_CONN\$\$./g, "$$$$SCHEMA$$$$.");

        return translateHanaToDuckdb(temp, this.schemaName, this.vocabSchemaName);
    }

    public getTranslatedSql(sql: string): string {
        return this.parseSql(sql);
    }

    public executeQuery(
        sql,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            this.execute(sql, parameters, (err, resultSet) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                } else {
                    const result = this.parseResults(resultSet);
                    callback(null, result);
                }
            });
        } catch (err) {
            callback(new DBError(logger.error(err), err.message), null);
        }
    }

    public async executeStreamQuery(
        sql,
        parameters: ParameterInterface[],
        callback: CallBackInterface,
        schemaName: string = ""
    ) {
        try {
            sql = this.getSqlStatementWithSchemaName(schemaName, sql);
            sql = this.parseSql(sql);
            const stream = this.conn.stream(sql, ...flattenParameter(parameters));          
            callback(null, stream);
          } catch (err) {
            logger.error(`Execute error: ${JSON.stringify(err)}
            =>sql: ${sql}
            =>parameters: ${JSON.stringify(parameters)}`);
            callback(new DBError(logger.error(err), err.message), null);
          }
    }

    public executeUpdate(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            this.execute(sql, parameters, (err, result) => {
                if (err) {
                    callback(new DBError(logger.error(err), err.stack), null);
                }
                callback(null, result.rowCount);
            });
        } catch (error) {
            callback(error, null);
        }
    }

    public executeProc(
        procedure: string,
        parameters: [],
        callback: CallBackInterface
    ) {
        try {
            const params = parameters.map((param) => "?");
            const sql = `select count(*) from \"${procedure}\"(${params.join()})`;
            logger.debug(`Sql: ${sql}`);
            let temp = sql;
            temp = this.parseSql(temp);
            this.conn.exec(temp, parameters, (err, result) => {
                if (err) {
                    return callback(
                        new DBError(logger.error(err), err.stack),
                        null
                    );
                }
                callback(null, result.rowCount);
            });
        } catch (err) {
            callback(new DBError(logger.error(err), err.message), null);
        }
    }

    public commit(callback?: CallBackInterface) {
        this.conn.exec("COMMIT", (commitError) => {
            if (commitError) {
                throw commitError;
            }
            if (callback) {
                callback(null, null);
            }
        });
    }

    public setAutoCommitToFalse() {
        throw new Error("setAutoCommitToFalse is not yet implemented");
    }

    public async close() {
        await this.database.close();
        logger.debug(`Duckdb database connection has been closed`);
    }

    public executeBulkUpdate(
        sql: string,
        parameters: ParameterInterface[][],
        callback: CallBackInterface
    ) {
        throw "executeBulkUpdate is not yet implemented";
    }

    public executeBulkInsert(
        sql: string,
        parameters: null[][],
        callback: CallBackInterface
    ) {
        throw "executeBulkInsert is not yet implemented";
    }
    /**
     * This methods sets the current application user to the DB session (i.e. XS.APPLICATIONUSER).
     * This method must be called in the respective endpoints before performing any queries involving the guarded patients.
     */
    public setCurrentUserToDbSession(
        user: string,
        callback: CallBackInterface
    ) {
        callback(null, null);
        // Users does not exist on duckdb connections
    }

    public setTemporalSystemTimeToDbSession(
        systemTime: string,
        cb: CallBackInterface
    ) {
        cb(null, null);
        // throw "Setting Temporal System Time to DB session is not yet implemented";
    }

    public rollback(callback: CallBackInterface) {
        // this.conn.rollBack((err) => {
        //   if (err) {
        //     err.code = "ECOMMIT";
        //     return callback(new DBError(err.code, err.message), null);
        //   } else {
        //     callback(null, true);
        //   }
        // });

        // Property 'rollBack' does not exist on type 'Pool'
        throw "rollback is not yet implemented";
    }

    private getSqlStatementWithSchemaName(
        schemaName: string,
        sql: string,
      ): string {
        const replacement = schemaName === "" ? "" : `${schemaName}.`;
        return sql.replace(/\$\$SCHEMA\$\$./g, replacement);
      }
}
