import {
    Connection,
    CachedbDBConnectionUtil,
    getCachedbDatabaseFormatProtocolA,
} from "@alp/alp-base-utils";
import axios, { AxiosRequestConfig } from "axios";
import https from "https";

export const getCachedbDbConnections = async (studyId): Promise<Connection.ConnectionInterface> => {
    let cachedbDatabase = getCachedbDatabaseFormatProtocolA(
        'duckdb',
        studyId
    );
    interface IDBCredentialsType {
        schema?: string;
        dialect: string;
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        vocabSchema: string;
      }

    let credentials: IDBCredentialsType
    credentials.host = process.env.CACHEDB__HOST;
    credentials.port = Number(process.env.CACHEDB__PORT);
    credentials.database = cachedbDatabase;
    const accessToken = await getClientCredentialsToken();

    credentials.user = accessToken;

    const duckdbConnection =
        await CachedbDBConnectionUtil.CachedbDBConnectionUtil.getDBConnection({
            credentials: credentials,
            schemaName: credentials.schema,
            vocabSchemaName: credentials.vocabSchema
        });

    return duckdbConnection;
};

const getClientCredentialsToken = async () => {
    const params = {
        grant_type: "client_credentials",
        client_id: process.env.IDP__ALP_SVC__CLIENT_ID,
        client_secret: process.env.IDP__ALP_SVC__CLIENT_SECRET,
    };

    const options: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    const data = Object.keys(params)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    params[key]
                )}`
        )
        .join("&");

    const result = await axios.post(process.env.ALP_GATEWAY_OAUTH__URL, data, options);

    return result.data.access_token;
}
