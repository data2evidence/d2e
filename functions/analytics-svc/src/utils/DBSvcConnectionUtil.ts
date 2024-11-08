import pg from "pg";
import hdb  from "hdb";
import { NodePgConnection } from "./DBSvcNodePgConnection";
import { NodeHDBConnection } from "./DBSvcNodeHDBConnection";
import { IDBCredentialsType } from "./DBSvcTypes";
import { Logger, User } from "@alp/alp-base-utils";
import { DBSvcConnectionInterface, CallBackInterface } from "./DBSvcConnection";
import { DB } from "./DBSvcConfig";

const logger = Logger.CreateLogger("DBConnectionUtil");

export class DBConnectionUtil {
    /**
     * @param cb Callback is typically used by tests
     */
    public static async getDbClient(
        credentials: IDBCredentialsType,
        cb?: CallBackInterface
    ) {
        return new Promise((resolve, reject) => {
            // Get postgres client
            if (credentials.dialect === DB.POSTGRES) {
                const client = new pg.Client(credentials);
                client.connect((err: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (cb) {
                            cb(null, client);
                        }
                        resolve(client);
                    }
                });
            }
            // Get hdb client
            const client = hdb.createClient(credentials);
            if (cb) {
                cb(null, client);
            }
            client.on("error", (err: any) => {
                console.error("Network connection error", err);
            });
            client.connect(function (err: any) {
                if (err) {
                    reject(err);
                } else {
                    logger.debug(
                        `After connection creation, DB connection state: ${client.readyState}`
                    );
                    resolve(client);
                }
            });
        });
    }

    public static getConnection(
        dialect: string,
        client: any,
        cb?: CallBackInterface | null,
        userObj?: User
    ): Promise<DBSvcConnectionInterface> {
        return new Promise((resolve, reject) => {
            const callback =
                cb ||
                ((err, connection) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(connection);
                });
            if (dialect === DB.POSTGRES) {
                NodePgConnection.createConnection(client, callback);
            } else {
                NodeHDBConnection.createConnection(
                    client,
                    async (err, connection: DBSvcConnectionInterface) => {
                        if (err) {
                            return callback(err, null);
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
                            connection.execute(`SET 'APPLICATIONUSER' = '${currentUser}'`, [], () => {
                                callback(null, connection);
                            })
                        } catch (err: any) {
                            callback(err, null);
                        }
                    }
                );
            }
        });
    }

    public static getDBConnection({
        credentials,
        userObj,
    }: {
        credentials: IDBCredentialsType;
        schema: string;
        userObj?: User;
    }) {
        return new Promise<DBSvcConnectionInterface>(async (resolve, reject) => {
            try {
                const client = await DBConnectionUtil.getDbClient(credentials);
                const connection = await DBConnectionUtil.getConnection(
                    credentials.dialect,
                    client,
                    null,
                    userObj
                );
                return resolve(connection);
            } catch (err: any) {
                logger.error(err);
                reject(err);
            }
        });
    }
}
