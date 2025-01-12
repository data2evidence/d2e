import { Constants, Logger, utils } from "@alp/alp-base-utils";
import * as http from "http";
import * as qs from "querystring";
import { URL } from "url";
import { StudyMriConfigMetaDataType } from "../types";
import * as https from "https";
const log = Logger.CreateLogger("config-util-log");

export default class MriConfigConnection {
    private portalServerUrl: string;

    constructor(portalServerUrl: string) {
        this.portalServerUrl = portalServerUrl;
    }

    public async getMriConfig(req, payload) {
        return new Promise(async (resolve, reject) => {
            const { hostname, port, protocol } = new URL(
                this.portalServerUrl,
            );

            let authorizationValue = req.headers.authorization;
            const { action, datasetId } = payload;
            log.debug(`payload: ${qs.stringify(payload)}`);
            const sourceOrigin = req.headers["x-source-origin"];

            let urlPath: string;
            switch (action) {
              case "getBackendConfig":
                urlPath = "backend";
                break;
              case "getMyConfig":
                urlPath = "me";
                break;
              default:
                urlPath = "me";
            }

            const options = {
              headers: {
                authorization: authorizationValue, // Replace user JWT (req.headers.authorization) with CCF
                "user-agent": "ALP Service",
                "x-source-origin": sourceOrigin,                
              },
              "rejectUnauthorized": false,
              "ca": Deno.env.get("TLS__INTERNAL__CA_CRT")?.replace(/\\n/g, '\n'),
              "params": { "datasetId":datasetId }
            };

            const getReq = await fetch(`${this.portalServerUrl}/dataset/pa-config/${urlPath}?datasetId=${datasetId}`, options);
            resolve(await getReq.json());
        });
    }

    public async getStudyConfig(
        opts,
        isAccessTokenRequired = false,
    ): Promise<StudyMriConfigMetaDataType> {
        const params = this.extractReqAndPayload(opts);
        const configObj: StudyMriConfigMetaDataType = this.emptyStudyMriConfigMetaDataType();
        const configResp = await this.getMriConfig(params.req, params.payload);
        Object.keys(configResp).forEach((k) => configObj[k] = configResp[k]);
        const replaceFn = (mapping: Map<string, string>, replacement: string) => {
            for (const [key, value] of Object.entries(mapping)) {
                mapping[key] = value.replace(/\$\$SCHEMA\$\$./g, `${replacement}.`);
            }
        };
        log.debug(`configObj.schemaName: ${configObj.schemaName}`);
        if (configObj.schemaName) {
            replaceFn(
                configObj.config.advancedSettings.guardedTableMapping,
                configObj.schemaName,
            );
            replaceFn(
                configObj.config.advancedSettings.tableMapping,
                configObj.schemaName,
            );
        }

        return configObj;
    }

    public async getScoreConfig(
        opts,
    ): Promise<StudyMriConfigMetaDataType> {
        const params = this.extractReqAndPayload(opts);
        const configObj: StudyMriConfigMetaDataType = this.emptyStudyMriConfigMetaDataType();
        const configResp = await this.getMriConfig(params.req, params.payload);
        Object.keys(configResp).forEach((k) => configObj[k] = configResp[k]);
        return configObj;
    }

    private emptyStudyMriConfigMetaDataType() {
        return {
                config: {},
                meta: {
                    configId: "",
                    configVersion: "",
                    configStatus: "",
                    configName: "",
                    dependentConfig: {
                        configId: "",
                        configVersion: "",
                    },
                    creator: "",
                    created: "",
                    modifier: "",
                    modified: "",
                },
                schemaName: "",
            };
    }

    private extractReqAndPayload(opts) {
      const { req, action, configId, configVersion, lang, datasetId } = opts;
      log.info(`action: ${action}`);
      log.info(`configId: ${configId}`);
      log.info(`configVersion: ${configVersion}`);
      log.info(`lang: ${lang}`);
      log.info(`datasetId: ${datasetId}`);
      return {
        req,
        payload: {
          action,
          configId,
          configVersion,
          lang,
          datasetId,
        },
      };
    }
}
