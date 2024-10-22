import {
    Connection,
    CachedbDBConnectionUtil,
    getCachedbDatabaseFormatProtocolB
} from "@alp/alp-base-utils";
import axios, { AxiosRequestConfig } from "axios";
import https from "https";
import { env } from "../env";

export const getCachedbDbConnections = async (studyId): Promise<Connection.ConnectionInterface> => {
    try{
        let dialect = 'duckdb'
        let cachedbDatabase = getCachedbDatabaseFormatProtocolB(
            dialect,
            'alpdev_pg',
            'cdmdefault',
            'cdmdefault'
          );
        
        const accessToken = await getClientCredentialsToken()
        let credentials = {
            dialect,
            host: env.CACHEDB__HOST? env.CACHEDB__HOST: "",
            port: Number(env.CACHEDB__PORT),
            database: cachedbDatabase,
            user: accessToken,
            schema: 'cdmdefault',
            vocabSchema: 'cdmvocab',
            password: 'dummy'
        }

        const duckdbConnection =
            await CachedbDBConnectionUtil.CachedbDBConnectionUtil.getDBConnection({
                credentials: credentials,
                schemaName: 'cdmdefault',
                vocabSchemaName: 'cdmvocab'
            });    
        return duckdbConnection;
    }catch(e){
        console.error(e)
        throw e
    }
};

const getClientCredentialsToken = async () => {
    const params = {
        grant_type: "client_credentials",
        client_id: env.IDP__ALP_DATA_CLIENT_ID,
        client_secret: env.IDP__ALP_DATA__CLIENT_SECRET,
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

    const result = await axios.post(env.ALP_GATEWAY_OAUTH__URL, data, options);
    
    return result.data.access_token;
}