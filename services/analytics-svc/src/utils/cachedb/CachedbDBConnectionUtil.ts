import { Pool } from "pg";
// Setting MAX_PACKET_SIZE in node-hdb prevents failure of large sql statements https://github.com/SAP/node-hdb/issues/19
/* tslint:disable no-var-requires */
require("hdb/lib/protocol/common/Constants").MAX_PACKET_SIZE = Math.pow(2, 30);
import { PostgresConnection, User } from "@alp/alp-base-utils/target/src/";
import { CreateLogger } from "@alp/alp-base-utils/target/src/Logger";
import { ConnectionInterface } from "@alp/alp-base-utils/target/src/Connection";
import { IDBCredentialsType } from "@alp/alp-base-utils/target/src/types";
import { DBConnectionUtil } from "@alp/alp-base-utils/target/src/";
import { NodeCleanup } from "@alp/alp-base-utils/target/src/NodeCleanup";
import { QueryObject } from "@alp/alp-base-utils/target/src/QueryObject";
import { CachedbNodeHDBConnection } from "./CachedbNodeHDBConnection";
const logger = CreateLogger("CachedbDBConnectionUtil");

export class CachedbDBConnectionUtil extends DBConnectionUtil.DBConnectionUtil {
    static pool: Pool;

    public static getDBConnection({
        credentials,
        schemaName,
        vocabSchemaName,
        userObj,
    }: {
        credentials: IDBCredentialsType;
        schemaName: string;
        vocabSchemaName?: string;
        userObj?: User;
    }) {
        return new Promise<ConnectionInterface>(async (resolve, reject) => {
            try {
                const client = await this.getDbClient(credentials);
                const connection = await this.getConnection(
                    credentials.dialect,
                    client,
                    schemaName,
                    vocabSchemaName,
                    null,
                    userObj
                );
                return resolve(connection);
            } catch (err) {
                logger.error(err);
                reject(err);
            }
        });
    }

    /**
     * @param cb Callback is typically used by tests
     */
    public static async getDbClient(credentials: IDBCredentialsType, cb?) {
        return new Promise((resolve, reject) => {
            DBConnectionUtil.DBConnectionUtil.pool = new Pool(credentials);
            DBConnectionUtil.DBConnectionUtil.pool.on("connect", (client) => {
                if (credentials.dialect === "postgresql") {
                    const sql = `SET search_path TO ${credentials.schema};`;
                    client.query(sql, [], (err) => {
                        if (err) {
                            return logger.error(err);
                        }

                        logger.info(`Schema set to: ${credentials.schema}`);
                    });
                }
            });
            DBConnectionUtil.DBConnectionUtil.pool.on(
                "error",
                (err, client) => {
                    logger.error("Postgres client error: " + err);
                    client.release(true);
                }
            );

            NodeCleanup((_, eventType) => {
                if (DBConnectionUtil.DBConnectionUtil.pool) {
                    DBConnectionUtil.DBConnectionUtil.pool
                        .end()
                        .catch((err) => logger.error(err))
                        .then(() => logger.info("PG pool has ended"))
                        .finally(() => process.exit(eventType));
                } else {
                    process.exit(eventType);
                }
            });

            if (cb) {
                cb(null, DBConnectionUtil.DBConnectionUtil.pool);
            }
            return resolve(DBConnectionUtil.DBConnectionUtil.pool);
        });
    }

    public static getConnection(
        dialect: string,
        client: any,
        schemaName: string,
        vocabSchemaName?: string,
        cb?,
        userObj?: User
    ): Promise<ConnectionInterface> {
        return new Promise((resolve, reject) => {
            const callback =
                cb ||
                ((err, connection) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(connection);
                });
            if (dialect === "postgresql") {
                PostgresConnection.PostgresConnection.createConnection(
                    client,
                    schemaName,
                    vocabSchemaName,
                    callback
                );
            } else {
                CachedbNodeHDBConnection.createConnection(
                    client,
                    schemaName,
                    vocabSchemaName,
                    async (err, connection: ConnectionInterface) => {
                        if (err) {
                            return callback(err);
                        }

                        let currentUser;

                        if (userObj) {
                            currentUser = userObj.getUser();
                        }

                        if (!currentUser) {
                            logger.debug(
                                "No user supplied. Cannot set HANA Connection APPLICATIONUSER"
                            );
                            return callback(null, connection);
                        }

                        try {
                            await QueryObject.format(
                                `SET 'APPLICATIONUSER' = '${currentUser}'`
                            ).executeUpdateAsync(connection);

                            return callback(null, connection);
                        } catch (err) {
                            callback(err);
                        }
                    }
                );
            }
        });
    }
}
