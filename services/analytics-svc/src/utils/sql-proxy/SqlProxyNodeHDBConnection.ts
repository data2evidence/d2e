import {
    ParameterInterface,
    CallBackInterface,
    flattenParameter,
} from "@alp/alp-base-utils/target/src/Connection";
import { PostgresConnection } from "@alp/alp-base-utils/target/src/";
import { Pool } from "pg";
import { DBError } from "@alp/alp-base-utils/target/src/DBError";
import { CreateLogger } from "@alp/alp-base-utils/target/src/Logger";
const logger = CreateLogger("SqlProxyNodeHDBConnection");

function _getRows(result) {
    if ("rows" in result) {
        return result.rows;
    }
    return null;
}

/* 
Extends PostgresConnection to use as a HANA connection for sql-proxy
Overwrites parseSql to remove translation from postgres->hana and adds some parsing of hana query-gen specific placeholders
*/
export class SqlProxyNodeHDBConnection extends PostgresConnection.PostgresConnection {
    public static createConnection(
        pool: Pool,
        schemaName,
        vocabSchemaName = schemaName,
        callback
    ) {
        try {
            const conn = new SqlProxyNodeHDBConnection(
                pool,
                schemaName,
                vocabSchemaName
            );
            callback(null, conn);
        } catch (err) {
            callback(err, null);
        }
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
            console.log("findme, sql", sql);
            temp = this.parseSql(temp);
            console.log("findme, temp", temp);
            this.conn.connect((err, client, release) => {
                if (err) {
                    logger.error(err);
                    callback(err, null);
                }
                logger.debug("PG client created");
                client.query(
                    temp,
                    flattenParameter(parameters),
                    (err, result) => {
                        if (err) {
                            release(true); // Will destroy this client, instead of releasing back to pool
                        } else {
                            release();
                        }
                        logger.debug("PG client released");
                        callback(err, result);
                    }
                );
            });
        } catch (err) {
            callback(new DBError(logger.error(err), err.message), null);
        }
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
                    logger.debug(`${JSON.stringify(resultSet, null, 2)}`);
                    const result = this.parseResults(
                        _getRows(resultSet),
                        resultSet.fields
                    );
                    callback(null, result);
                }
            });
        } catch (err) {
            callback(new DBError(logger.error(err), err.message), null);
        }
    }

    public parseSql(temp: string): string {
        // Replace %s or `?` with $n
        temp = temp.replace(/\$\$SCHEMA\$\$./g, `${this.schemaName}.`);
        temp = temp.replace(
            /\$\$VOCAB_SCHEMA\$\$./g,
            `${this.vocabSchemaName}.`
        );

        // Translate hana query parameter placeholders to postgres parameter placeholders
        let n = 0;
        temp = temp.replace(/\%[s]{1}(?![a-zA-Z0-9%])|%UNSAFE|\?/g, () => {
            return "$" + ++n;
        });

        return temp;
    }
}
