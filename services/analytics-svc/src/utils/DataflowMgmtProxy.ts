import { Logger, EnvVarUtils } from "@alp/alp-base-utils";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";
import { URL } from "url";
import { IMRIRequest, QuerySvcResultType } from "../types";
import { DATAFLOW__BASE_URL } from "../config";
dotenv.config();
const log = Logger.CreateLogger("analytics-log");
const envVarUtils = new EnvVarUtils(process.env);

export const dataflowRequest = (
    req: IMRIRequest,
    method: "GET" | "POST",
    path: string = "",
    payload: null | any
): Promise<any> => {
    log.addRequestCorrelationID(req);
    const reqCorrelationId: string = envVarUtils.isTestEnv()
        ? "DUMMY_REQ_CORRELATION_ID"
        : log.getRequestCorrelationID(req);
    const accessToken = envVarUtils.isTestEnv()
        ? "Bearer DUMMY_TOKEN"
        : req.headers.authorization;

    const { hostname, port, protocol } = new URL(DATAFLOW__BASE_URL);
    const protocolLib = http;
    const data = JSON.stringify(payload);

    const sourceOrigin = req.headers["x-source-origin"];

    const options: https.RequestOptions = {
        hostname,
        port,
        protocol,
        path: `/${path}`,
        headers: {
            "authorization": accessToken,
            "user-agent": "ALP Service",
            "x-source-origin": sourceOrigin,
            "x-req-correlation-id": reqCorrelationId,
        },
        method,
        rejectUnauthorized: hostname === "localhost" ? false : true,
        ca:
            hostname === "localhost"
                ? null
                : process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
    };
    if (payload) {
        options.headers["Content-Type"] = "application/json";
        options.headers["Content-Length"] = Buffer.byteLength(data);
    }

    return new Promise<QuerySvcResultType>((resolve, reject) => {
        const post_req = protocolLib
            .request(options, (response) => {
                let body = "";

                response.on("data", (d) => {
                    body += d;
                });

                response.on("end", () => {
                    try {
                        if (
                            response.statusCode >= 200 &&
                            response.statusCode <= 399
                        ) {
                            resolve(JSON.parse(body));
                        } else {
                            reject(body);
                        }
                    } catch (err) {
                        log.error(`query generator error: ${body}`);
                        reject(err);
                    }
                });
            })
            .on("error", (err) => {
                log.enrichErrorWithRequestCorrelationID(err, req);
                log.error(JSON.stringify(err));
                reject(err);
            });
        post_req.write(data);
        post_req.end();
    });
};
