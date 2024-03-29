import axios, { AxiosRequestConfig } from "axios";
import https from "https";
import {
    ALP_MINERVA_PS_CONFIG_SERVER__URL,
    ALP_GATEWAY_OAUTH__URL,
    IDP_ALP_SVC_CLIENT_ID,
    IDP_ALP_SVC_CLIENT_SECRET,
} from "../config";

export default class PsConfigServerAPI {
    private readonly baseUrl: string;
    private readonly oauthUrl: string;
    private readonly httpsAgent: any;

    constructor() {
        if (ALP_MINERVA_PS_CONFIG_SERVER__URL) {
            this.baseUrl = ALP_MINERVA_PS_CONFIG_SERVER__URL;
            this.oauthUrl = ALP_GATEWAY_OAUTH__URL;
            this.httpsAgent = new https.Agent({
                rejectUnauthorized:
                    this.baseUrl.startsWith("https://localhost:") ||
                    this.baseUrl.startsWith("https://alp-minerva-gateway-")
                        ? false
                        : true,
            });
        }
        if (!this.baseUrl) {
            throw new Error("PS Config Server URL is not configured!");
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
            client_id: IDP_ALP_SVC_CLIENT_ID,
            client_secret: IDP_ALP_SVC_CLIENT_SECRET,
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

    async getCDWConfig({action, configId, configVersion, lang}, token) {
        const options = await this.getRequestConfig(token);
        const body = {
            action,
            configId,
            configVersion,
            lang,
        }
        const result = await axios.post(`${this.baseUrl}/hc/hph/patient/app/services/config.xsjs`, body, options);
        return result.data;
    }
}
