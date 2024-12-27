import axios, { AxiosRequestConfig } from "axios";
import https from "https";
import { env } from "../env";
import { Logger } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
let logger = CreateLogger("analytics-log");
export default class PortalServerAPI {
    private readonly baseUrl: string;
    private readonly oauthUrl: string;
    private readonly httpsAgent: any;

    constructor() {
        if (env.SERVICE_ROUTES.portalServer) {
            this.baseUrl = env.SERVICE_ROUTES.portalServer;
            this.oauthUrl = env.ALP_GATEWAY_OAUTH__URL;
            this.httpsAgent = new https.Agent({
                rejectUnauthorized: true,
                ca: env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
            });
        }
        if (!this.baseUrl) {
            throw new Error("Portal Server URL is not configured!");
        }
    }

    private async getRequestConfig(token: string) {
        let options: AxiosRequestConfig = { httpsAgent: this.httpsAgent };
        if (token) {
            options = {
                ...options,
                headers: {
                    Authorization: token,
                },
            };
        }
        return options;
    }

    async getClientCredentialsToken() {
        const params = {
            grant_type: "client_credentials",
            client_id: env.IDP__ALP_SVC__CLIENT_ID,
            client_secret: env.IDP__ALP_SVC__CLIENT_SECRET,
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

        const result = await axios.post(this.oauthUrl, data, options);

        return result.data.access_token;
    }

    async getPublicStudies() {
        const result = await axios.get(`${this.baseUrl}/dataset/public/list`);
        return result.data;
    }

    async getStudy(token: string, datasetId: string) {
        const options = await this.getRequestConfig(token);
        options.params = { datasetId };
        const result = await axios.get(`${this.baseUrl}/dataset`, options);
        return result.data;
    }

    async getStudies(token: string) {
        const options = await this.getRequestConfig(token);
        const result = await axios.get(`${this.baseUrl}/dataset/list`, options);
        return result.data;
    }

    async getBookmarkById(token: string, bookmarkId: string): Promise<any> {
        try {
            const options = await this.getRequestConfig(token);
            const url = `${this.baseUrl}/user-artifact/bookmarks/${bookmarkId}`;
            const result = await axios.get(url, options);
            return result.data;
        } catch (error) {
            console.error(error);
            logger.error(`Error while getting user artifacts for Bookmarks`);
            throw new Error(`Error while getting user artifacts for Bookmarks`);
        }
    }

    async updateBookmark(token: string, input: any): Promise<any> {
        try {
            const options = await this.getRequestConfig(token);
            const url = `${this.baseUrl}/user-artifact/bookmarks`;
            const result = await axios.put(url, input, options);
            return result.data;
        } catch (error) {
            console.error(error);
            logger.error(`Error while updating Bookmark`);
            throw new Error(`Error while updating Bookmark`);
        }
    }
}
