import axios, { AxiosRequestConfig } from "axios";
import { env } from "../env";
export default class PortalServerAPI {
    private readonly baseUrl: string;
    private readonly oauthUrl: string;

    constructor() {
        this.baseUrl = env.SERVICE_ROUTES.portalServer;
        this.oauthUrl = env.ALP_GATEWAY_OAUTH__URL;
        if (!this.baseUrl) {
            throw new Error("Portal Server URL is not configured!");
        }
    }

    private async getRequestConfig(token: string) {
        let options: AxiosRequestConfig = { };
        if (token) {
            options = {
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
            }
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

        return `Bearer ${result.data.access_token}`;
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
