import axios, { AxiosRequestConfig } from "axios";
import https from "https";
import { env } from "../env";
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
}
