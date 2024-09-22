// @ts-ignore
import {
    DBSvcConnectionInterface,
    CallBackInterface,
    ParameterInterface,
    flattenParameter,
    DBValues,
} from "./DBSvcConnection";
import * as config from "./DBSvcConfig";
const logger = config.getLogger();
export class NodeHDBConnection implements DBSvcConnectionInterface {
    public static createConnection(client: any, callback: CallBackInterface) {
        const conn = new NodeHDBConnection(client);
        callback(null, conn);
    }

    /**
     * Pass the already connected client
     * Creating the connection using the constructor WILL NOT set the
     * default schema, hence usage of the constructor is discouraged.
     * @param  {any}    client
     */
    constructor(public conn: any) {}

    public execute(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            logger.debug(`Sql: ${sql}`);
            this.conn.prepare(sql, (err: Error, statement: any) => {
                if (err) {
                    logger.error(`Execute error: ${JSON.stringify(err)})
                    =>sql: ${sql}
                    =>parameters: ${JSON.stringify(parameters)}`);
                    callback(err, null);
                } else {
                    statement.exec(flattenParameter(parameters), callback);
                }
            });
        } catch (err) {
            callback(err, null);
        }
    }

    public executeQuery(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            this.execute(sql, parameters, (err, resultSet) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                } else {
                    logger.debug(`${JSON.stringify(resultSet, null, 2)}`);
                    const result = this.parseResults(
                        resultSet,
                        resultSet.metadata
                    );
                    callback(null, result);
                }
            });
        } catch (err) {
            callback(err, null);
        }
    }

    public executeStreamQuery(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface,
        schemaName: string = ""
    ) {
        throw "executeStreamQuery is not yet implemented";
    }

    public executeUpdate(
        sql: string,
        parameters: ParameterInterface[],
        callback: CallBackInterface
    ) {
        try {
            this.execute.apply(this, <any>arguments);
        } catch (err) {
            callback(err, null);
        }
    }

    public executeProc(
        procedure: string,
        args: string[],
        callback: CallBackInterface
    ) {
        try {
            const params = args.map((param) => "?");
            const sql = `CALL \"${procedure}\" (${params.join()})`;
            this.conn.prepare(sql, (err: any, statement: any) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                statement.exec(
                    args,
                    (err: any, parameters: any, results: any) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        callback(null, results);
                    }
                );
            });
        } catch (err) {
            callback(err, null);
        }
    }

    public executeProcWithSchema(
        procedure: string,
        args: string[],
        schema: string,
        callback: CallBackInterface
    ) {
        try {
            const params = args.map((param) => "?");
            const sql = `CALL ${schema}.\"${procedure}\" (${params.join()})`;
            this.conn.prepare(sql, (err: any, statement: any) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                statement.exec(
                    args,
                    (err: any, parameters: any, results: any) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        callback(null, results);
                    }
                );
            });
        } catch (err) {
            callback(err, null);
        }
    }

    public commit(callback?: CallBackInterface) {
        try {
            this.conn.commit();
            this.conn.setAutoCommit(true);
            if (callback) callback(null, "Committed Successfully");
        } catch (err) {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        }
    }

    public setAutoCommitToFalse(callback?: CallBackInterface) {
        try {
            this.conn.setAutoCommit(false);
            if (callback)
                callback(null, "Set Autocommit to false successfully");
        } catch (err) {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        }
        // this.conn.setAutoCommit(false);
    }

    /**
     * Parses resultset, only converting null column values to 'NoValue'. Not converting the
     * other types since there is NO resultset metadata available.
     * @param resultSet - result set from db call
     * @param metadata - not required, can be null
     */
    public parseResults(result: any, metadata: any) {
        function formatResult(columnKey: string, value: any) {
            if (!metadata) {
                return value;
            }

            switch (getType(columnKey, value)) {
                case 1: //TINYINT
                case 2: //SMALLINT
                case 3: //INTEGER
                case 4: //BIGINT
                case 5: //DECIMAL
                case 6: //REAL
                    return Number(value) * 1;
                case 14: //DATE
                    return `${value}T00:00:00.000Z`;
                case 16: //TIMESTAMP
                    if (value.indexOf(".") > -1) {
                        return `${value}Z`;
                    } else {
                        return `${value}.000Z`;
                    }
                case 62: //SECONDDATE
                    return `${value}.000Z`;
                case 15: //TIME
                    return value;
                case 13: //VARBINARY
                    return value.toString("hex").toUpperCase();
                case 26: // LOB
                    return value.toString();
                default:
                    return value;
            }
        }

        function getType(columnKey: string, value: any) {
            for (const md of metadata) {
                if (md.columnDisplayName === columnKey) {
                    logger.debug(
                        `${md.columnDisplayName} ---- ${md.dataType} ---- value: ${value}`
                    );
                    return md.dataType;
                }
            }
        }

        Object.keys(result).map((rowId) => {
            Object.keys(result[rowId]).map((colKey) => {
                if (
                    result[rowId][colKey] === null ||
                    typeof result[rowId][colKey] === "undefined"
                ) {
                    result[rowId][colKey] = DBValues.NOVALUE;
                } else {
                    result[rowId][colKey] = formatResult(
                        colKey,
                        result[rowId][colKey]
                    );
                }
            });
        });

        return result;
    }

    public close() {
        if (this.conn.close) {
            this.conn.close.apply(this.conn, arguments);
        }
    }

    public executeBulkUpdate(
        _sql: string,
        _parameters: ParameterInterface[][],
        _callback: CallBackInterface
    ) {
        throw new Error("executeBulkUpdate is not yet implemented");
    }

    public executeBulkInsert(
        sql: string,
        parameters: null[][],
        callback: CallBackInterface
    ) {
        // hdb-node module cannot accept empty strings for input into datetime columns, so replace all empty string with null values
        parameters = parameters.map((row) => {
            return row.map((val) => {
                return val === "" ? null : val;
            });
        });

        try {
            logger.debug(`Sql: ${sql}`);
            this.conn.prepare(sql, (err: Error, statement: any) => {
                if (err) {
                    logger.error(
                        `Execute error: ${JSON.stringify(err)})
             => sql: ${sql}
             => parameters: ${JSON.stringify(parameters)}`
                    );
                    callback(err, null);
                } else {
                    //Run bulk insert statement in chunks as hdb-node module will hang if doing bulk insert on large amounts of rows
                    const rowCount: number = parameters.length;
                    const chunkSize: number = 50000;
                    const chunkCount: number = Math.ceil(rowCount / chunkSize);

                    for (let j = 0; j < chunkCount; j++) {
                        const start = j * chunkSize;
                        const end =
                            start > rowCount ? rowCount : (j + 1) * chunkSize;
                        statement.exec(
                            parameters.slice(start, end),
                            (err: Error, affectedRows: any) => {
                                if (err) {
                                    logger.error(
                                        `Error inserting chunk ${j + 1}`
                                    );
                                    callback(err, null);
                                } else {
                                }
                                // Get number of rows inserted from affectedRows as it can either be array or number
                                let rowsInserted = Array.isArray(affectedRows)
                                    ? affectedRows.length
                                    : affectedRows;
                                logger.info(
                                    `Inserted ${rowsInserted} rows for chunk ${
                                        j + 1
                                    }/${chunkCount}`
                                );

                                // After successfully loading all chunks
                                if (j + 1 == chunkCount) {
                                    callback(null, true);
                                }
                            }
                        );
                    }
                }
            });
        } catch (err) {
            callback(err, null);
        }
    }

    /**
     * This methods sets the current application user to the DB session (i.e. SESSION_CONTEXT).
     * This method must be called in the respective endpoints before performing any queries involving the guarded patients.
     */
    public setCurrentUserToDbSession(user: string, cb: CallBackInterface) {
        try {
            const query = `SET '${DBValues.DB_APPUSER_KEY}' = '${user}'`;
            this.executeUpdate(query, [], cb);
        } catch (e) {
            cb(e, null);
        }
    }

    /**
     * This methods sets the current session with incoming date to query versioned tables (History tables)
     */
    public setTemporalSystemTimeToDbSession(
        systemTimeAsOf: string,
        cb: CallBackInterface
    ) {
        try {
            let query: string;
            if (systemTimeAsOf == "") {
                var d = new Date(),
                    month = "" + d.getMonth(),
                    day = "" + (d.getDate() + 1),
                    year = d.getFullYear();
                query = `SET 'TEMPORAL_SYSTEM_TIME_AS_OF' = '${[
                    year,
                    month,
                    day,
                ].join("-")}'`;
            } else
                query = `SET 'TEMPORAL_SYSTEM_TIME_AS_OF' = ${systemTimeAsOf}`;

            this.executeUpdate(query, [], cb);
        } catch (e) {
            cb(e, null);
        }
    }

    public rollback(callback: CallBackInterface) {
        this.conn.rollBack((err: any) => {
            if (err) {
                err.code = "ECOMMIT";
                return callback(err, null);
            } else {
                callback(null, true);
            }
        });
    }
}
