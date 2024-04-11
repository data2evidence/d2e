import { Constants, Logger, EnvVarUtils } from "@alp/alp-base-utils";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";
import { URL } from "url";
import { IMRIRequest, QuerySvcResultType } from "../types";
dotenv.config();
const log = Logger.CreateLogger("analytics-log");
const envVarUtils = new EnvVarUtils(process.env);

export async function generateQuery(
    req: IMRIRequest,
    payload,
    path: string = ""
): Promise<QuerySvcResultType> {
    log.addRequestCorrelationID(req);
    let reqCorrelationId: string = "DUMMY_REQ_CORRELATION_ID";
    let hostname;
    let port;
    let protocol;
    let protocolLib;
    let urlParams;
    if (envVarUtils.isTestEnv() && !envVarUtils.isHttpTestRun()) {
        // this flow is only for integation test
        urlParams = new URL(`http://localhost:41008`);
        protocolLib = http;
    } else {
        urlParams = new URL("http://alp-minerva-query-gen-svc-1:41109");
        protocolLib = http;
    }
    hostname = urlParams.hostname;
    port = urlParams.port;
    protocol = urlParams.protocol;

    const data = JSON.stringify(payload);

    let accessToken = "Bearer DUMMY_TOKEN";
    if (!envVarUtils.isTestEnv()) {
        accessToken = req.headers.authorization;
        if (log.getRequestCorrelationID(req)) {
            reqCorrelationId = log.getRequestCorrelationID(req);
        }
    }

    const defaultPath = `/analytics-svc/api/services/query`;

    const pathName = path ? defaultPath + "/" + path : defaultPath;

    const sourceOrigin = req.headers["x-source-origin"];

    const options: https.RequestOptions = {
        hostname,
        port,
        protocol,
        path: pathName,
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data),
            "auth-type": "azure-ad",
            "authorization": accessToken,
            "user-agent": "ALP Service",
            "x-source-origin": sourceOrigin,
            "x-req-correlation-id": reqCorrelationId,
            "x-alp-usersessionclaims": req.headers["x-alp-usersessionclaims"],
        },
        method: "POST",
        rejectUnauthorized:
            hostname === "localhost" || hostname === "alp-mercury-approuter"
                ? false
                : true,
        ca:
            hostname === "localhost" || hostname === "alp-mercury-approuter"
                ? null
                : process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
    };

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
}
