import { env } from "../../env";
import {
    Connection,
    CachedbDBConnectionUtil,
    getCachedbDatabaseFormatProtocolA,
} from "@alp/alp-base-utils";
import { DB } from "../DBSvcConfig";

export const getCachedbDbConnections = async ({
    analyticsCredentials,
    userObj,
    token,
    studyId,
    replacePostgresWithDuckdb = true,
}): Promise<{
    analyticsConnection: Connection.ConnectionInterface;
}> => {
    // Define defaults for both analytics & Vocab connections
    let analyticsConnectionPromise;

    let cachedbDatabase = getCachedbDatabaseFormatProtocolA(
        analyticsCredentials.dialect,
        studyId
    );

    // IF use duckdb is true change dialect from postgres -> duckdb
    if (
        replacePostgresWithDuckdb &&
        env.USE_DUCKDB === "true" &&
        analyticsCredentials.dialect !== DB.HANA
    ) {
        cachedbDatabase = cachedbDatabase.replace(
            analyticsCredentials.dialect,
            "duckdb"
        );
    }

    // Overwrite analyticsCrendential values to connect to cachedb
    analyticsCredentials.host = env.CACHEDB__HOST;
    analyticsCredentials.port = env.CACHEDB__PORT;
    analyticsCredentials.database = cachedbDatabase;
    analyticsCredentials.user = token;

    analyticsConnectionPromise =
        CachedbDBConnectionUtil.CachedbDBConnectionUtil.getDBConnection({
            credentials: analyticsCredentials,
            schemaName: analyticsCredentials.schema,
            vocabSchemaName: analyticsCredentials.vocabSchema,
            userObj,
        });

    const [analyticsConnection] = await Promise.all([
        analyticsConnectionPromise,
    ]);

    return {
        analyticsConnection,
    };
};
