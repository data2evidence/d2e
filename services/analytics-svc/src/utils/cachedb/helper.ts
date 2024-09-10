import { Connection } from "@alp/alp-base-utils";
import { env } from "../../env";
import { CachedbDBConnectionUtil } from "./CachedbDBConnectionUtil";
import { DB } from "../DBSvcConfig";

/*
Helepr function to get cachedb database format for protocol A
*/
export const getCachedbDatabaseFormatProtocolA = (
    dialect: string,
    datasetId
) => {
    return `A|${dialect}|${datasetId}`;
};

/*
Helepr function to get cachedb database format for protocol B
*/
export const getCachedbDatabaseFormatProtocolB = (
    dialect: string,
    databaseCode: string,
    schemaName: string = "",
    vocabSchemaName: string = ""
) => {
    let cachedbDatabaseFormat = `B|${dialect}|${databaseCode}`;
    if (schemaName) {
        cachedbDatabaseFormat += `|${schemaName}`;
    }
    if (vocabSchemaName) {
        cachedbDatabaseFormat += `|${vocabSchemaName}`;
    }
    return cachedbDatabaseFormat;
};

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

    analyticsConnectionPromise = CachedbDBConnectionUtil.getDBConnection({
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
