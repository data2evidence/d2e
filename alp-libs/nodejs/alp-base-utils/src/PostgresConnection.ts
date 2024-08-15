import {
  ConnectionInterface,
  CallBackInterface,
  ParameterInterface,
  flattenParameter,
  DBValues,
} from "./Connection";
import { Pool } from "pg";
import { DBError } from "./DBError";
import { CreateLogger } from "./Logger";
import QueryStream from "pg-query-stream";
import { translateHanaToPostgres } from "./helpers/hanaTranslation";
import { EnvVarUtils } from "./EnvVarUtils";
const logger = CreateLogger("Postgres Connection");

function _getRows(result) {
  if ("rows" in result) {
    return result.rows;
  }
  return null;
}

export class PostgresConnection implements ConnectionInterface {
  constructor(
    public conn: Pool,
    public schemaName,
    public vocabSchemaName,
    public dialect = "POSTGRES",
  ) {}

  public static createConnection(
    pool: Pool,
    schemaName,
    vocabSchemaName = schemaName,
    callback,
  ) {
    try {
      const conn = new PostgresConnection(pool, schemaName, vocabSchemaName);
      callback(null, conn);
    } catch (err) {
      callback(err, null);
    }
  }

  public parseResults(result: any, metadata: any) {
    function formatResult(columnKey: string, value: any) {
      if (!metadata) {
        return value;
      }

      switch (getType(columnKey, value)) {
        case 20: //INT8
        case 21: //INT2
        case 23: //INT4
          return Number(value) * 1;
        case 1082: //DATE
        case 1114: //TIMESTAMP
          return value.toISOString();
        case 1560: //BIT
          return value.toString("hex").toUpperCase();
        default:
          return value;
      }
    }

    function getType(columnKey: string, value: any) {
      for (const md of metadata) {
        if (md.name === columnKey) {
          logger.debug(`${md.name} ---- ${md.dataTypeID} ---- value: ${value}`);
          return md.dataTypeID;
        }
      }
    }
    Object.keys(result).forEach(rowId => {
      Object.keys(result[rowId]).forEach(colKey => {
        if (
          result[rowId][colKey] === null ||
          typeof result[rowId][colKey] === "undefined"
        ) {
          result[rowId][colKey] = DBValues.NOVALUE;
        } else {
          result[rowId][colKey] = formatResult(colKey, result[rowId][colKey]);
        }
      });
    });
    return result;
  }

  public async execute(
    sql,
    parameters: ParameterInterface[],
    callback: CallBackInterface,
  ) {
    try {
      logger.debug(`Sql: ${sql}`);
      logger.debug(
        `parameters: ${JSON.stringify(flattenParameter(parameters))}`,
      );
      let temp = sql;
      temp = this.parseSql(temp);
      this.conn.connect((err, client, release) => {
        if (err) {
          logger.error(err);
          callback(err, null);
        }
        logger.debug("PG client created");
        client.query(temp, flattenParameter(parameters), (err, result) => {
          if (err) {
            release(true); // Will destroy this client, instead of releasing back to pool
          } else {
            release();
          }
          logger.debug("PG client released");
          callback(err, result);
        });
      });
    } catch (err) {
      callback(new DBError(logger.error(err), err.message), null);
    }
  }

  parseSql(temp: string): string {
    return translateHanaToPostgres(temp, this.schemaName, this.vocabSchemaName);
  }

  public getTranslatedSql(sql: string): string {
    return this.parseSql(sql);
  }

  public executeQuery(
    sql,
    parameters: ParameterInterface[],
    callback: CallBackInterface,
  ) {
    try {
      this.execute(sql, parameters, (err, resultSet) => {
        if (err) {
          logger.error(err);
          callback(err, null);
        } else {
          logger.debug(`${JSON.stringify(resultSet, null, 2)}`);
          const result = this.parseResults(
            _getRows(resultSet),
            resultSet.fields,
          );
          callback(null, result);
        }
      });
    } catch (err) {
      callback(new DBError(logger.error(err), err.message), null);
    }
  }

  public executeStreamQuery(
    sql,
    parameters: ParameterInterface[],
    callback: CallBackInterface,
    schemaName: string = "",
  ) {
    try {
      sql = this.getSqlStatementWithSchemaName(schemaName, sql);
      sql = this.parseSql(sql);

      this.conn.connect((err, client, release) => {
        if (err) {
          logger.error(`Execute error: ${JSON.stringify(err)}
            =>sql: ${sql}
            =>parameters: ${JSON.stringify(parameters)}`);
          callback(new DBError(logger.error(err), err.message), null);
        }
        const query = new QueryStream(sql, flattenParameter(parameters));
        const stream = client.query(query);

        stream.on("end", async () => {
          release(true); // true will destroy the client, removing the temp table at the same time
        });

        stream.on("error", (err: any) => {
          logger.error(err);
        });

        callback(null, stream);
      });
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
    callback: CallBackInterface,
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
    callback: CallBackInterface,
  ) {
    try {
      const params = parameters.map(param => "?");
      const sql = `select count(*) from \"${procedure}\"(${params.join()})`;
      logger.debug(`Sql: ${sql}`);
      let temp = sql;
      temp = this.parseSql(temp);
      this.conn.query(temp, parameters, (err, result) => {
        if (err) {
          return callback(new DBError(logger.error(err), err.stack), null);
        }
        callback(null, result.rowCount);
      });
    } catch (err) {
      callback(new DBError(logger.error(err), err.message), null);
    }
  }

  public commit(callback?: CallBackInterface) {
    this.conn.query("COMMIT", commitError => {
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

  public close() {
    const envVarUtils = new EnvVarUtils(process.env);
    // Only integration tests require ending the connection as the code is run directly, and the tests will hang.
    if (
      envVarUtils.isTestEnv() &&
      !envVarUtils.isHttpTestRun() &&
      this.conn.end
    ) {
      this.conn.end.apply(this.conn, arguments);
    } else {
      logger.debug(
        "PostgresConnection is using a pool. Connection is not closed",
      );
    }
  }

  public executeBulkUpdate(
    sql: string,
    parameters: ParameterInterface[][],
    callback: CallBackInterface,
  ) {
    throw "executeBulkUpdate is not yet implemented";
  }

  public executeBulkInsert(
    sql: string,
    parameters: null[][],
    callback: CallBackInterface,
  ) {
    throw "executeBulkInsert is not yet implemented";
  }
  /**
   * This methods sets the current application user to the DB session (i.e. XS.APPLICATIONUSER).
   * This method must be called in the respective endpoints before performing any queries involving the guarded patients.
   */
  public setCurrentUserToDbSession(user: string, callback: CallBackInterface) {
    try {
      const sql = `set session.application_user = "${user}"`;
      this.conn.query(sql, [], callback);
    } catch (error) {
      callback(error, null);
    }
  }

  public setTemporalSystemTimeToDbSession(
    systemTime: string,
    cb: CallBackInterface,
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
