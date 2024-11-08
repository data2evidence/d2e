import axios, { AxiosRequestConfig } from "axios";
import https from "https";

import { env } from "../env";
export default class TerminologySvcAPI {
    private readonly baseUrl: string;
    private readonly httpsAgent: any;

    constructor() {
        if (env.SERVICE_ROUTES.terminology) {
            this.baseUrl = env.SERVICE_ROUTES.terminology;
            this.httpsAgent = new https.Agent({
                rejectUnauthorized: true,
                ca: env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
            });
        }
        if (!this.baseUrl) {
            throw new Error("Terminology Svc URL is not configured!");
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

    async getConceptIds(
        conceptSetIds: string[],
        datasetId: string,
        token: string
    ): Promise<number[]> {
        const options = await this.getRequestConfig(token);

        const data = { conceptSetIds, datasetId };
        const result = await axios.post(
            `${this.baseUrl}/terminology/concept-set/included-concepts`,
            data,
            options
        );
        return result.data as number[];
    }
}
