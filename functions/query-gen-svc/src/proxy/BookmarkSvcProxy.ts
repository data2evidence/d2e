import { Logger, EnvVarUtils } from "@alp/alp-base-utils";
const envVarUtils = new EnvVarUtils(Deno.env.toObject());
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";
import { URL } from "url";
import { IMRIRequest, BookmarkCMDType } from "../types";
import { env } from "../env";
import axios, { AxiosRequestConfig } from "axios";

dotenv.config();
const log = Logger.CreateLogger();

export async function loadBookmarks(
    req: IMRIRequest,
    queryParams,
    bookmark_cmd: BookmarkCMDType
) {
    let hostname;
    let port;
    let protocol;
    let protocolLib;
    let urlParams;

    if (envVarUtils.isTestEnv() && !envVarUtils.isHttpTestRun()) {
        // this flow is only for integration test
        urlParams = new URL(`http://localhost:41005`);
        protocolLib = http;
    } else {
        urlParams = new URL(env.SERVICE_ROUTES.bookmark);
        protocolLib = http;
    }

    hostname = urlParams.hostname;
    port = urlParams.port;
    protocol = urlParams.protocol;
    const sourceOrigin = req.headers["x-source-origin"];

    const username_response = await axios.get(
        `${new URL(env.SERVICE_ROUTES.usermgmt)}/me`,
        {
            headers: {
                Authorization: req.headers.authorization,
            },
        }
    );

    if (!username_response.data || !username_response.data.username) {
        throw new Error("Invalid username")
    }

    let options: http.RequestOptions = {
        hostname,
        port,
        protocol,
        headers: {
            "Content-Type": "application/json",
            "auth-type": "azure-ad",
            "authorization": req.headers.authorization,
            "user-agent": "ALP Service",
            "x-source-origin": sourceOrigin,
        },
        rejectUnauthorized: true,
        ca: Deno.env.get("TLS__INTERNAL__CA_CRT")?.replace(/\\n/g, "\n"),
    };

    switch (bookmark_cmd) {
        case BookmarkCMDType.LOAD_BOOKMARKS:
            const bookmarkIds = queryParams.bmkIds;
            const paConfigId = queryParams.configId;
            const fullPath = `/analytics-svc/api/services/bookmark/bookmarkIds?ids=${bookmarkIds}&paConfigId=${paConfigId}&username=${username_response.data.username}`;
            options.path = fullPath;
            options.method = "GET";
            break;
        default:
            console.log("Invalid request!");
            throw new Error("Invalid request!");
    }

    return new Promise((resolve, reject) => {
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
                log.error(JSON.stringify(err));
                reject(err);
            });
        post_req.end();
    });
}
