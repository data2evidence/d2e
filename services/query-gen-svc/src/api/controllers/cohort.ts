import MRIEndpointErrorHandler from "../../utils/MRIEndpointErrorHandler";
import { IMRIRequest } from "../../types";
import { QueryGenSvc } from "../../svc/QueryGenSvc";
import * as settingsLib from "../../qe/settings/Settings";
import { Settings } from "../../qe/settings/Settings";
import { callStudyMRIConfig } from "../../proxy/ConfigSvcProxy";
import { MRIEndpointResultType } from "../../types";
import * as utilsLib from "@alp/alp-base-utils";
import { bookmarkToIFRBackend } from "../../utils/formatter/BookmarkFormatter";

const log = utilsLib.Logger.CreateLogger("query-gen-log");
const { utils } = utilsLib;

/**
 * Retrieves list of cohort definitions
 * @param req
 * @param res
 * @param next
 */
export async function generateQuery(req: IMRIRequest, res, next) {
    log.addRequestCorrelationID(req);
    try {
        const body =
            req.query && req.query.data
                ? JSON.parse(<any>req.query.data)
                : req.body;
        const queryParams = body.queryParams;
        log.debug(`Input params:\n${JSON.stringify(queryParams)}`);

        const { configId, configVersion, studyId, queryType, insert } =
            body.queryParams;

        let ifrRequest = queryParams.ifrRequest;

        const language = "en"; //(queryParams.language) ?  queryParams.language : "en";

        const pluginOptionalParams = {
            insert,
            createCohort: true,
        };

        // get backend config for the given configId, configVersion & studyId
        const configParams = {
            req,
            action: "getBackendConfig",
            configId,
            configVersion,
            lang: language,
            datasetId: studyId,
        };
        const configResponse = await callStudyMRIConfig(configParams);
        const config = configResponse.config;

        const censoringThreshold = getCensoringThreshold(config);

        // get placeholderTableMap
        let userSpecificSettings = new Settings().initAdvancedSettings(
            config.advancedSettings
        );
        let placeholderMap: settingsLib.PholderTableMapType =
            userSpecificSettings.getPlaceholderMap();

        const convertedFilter = await bookmarkToIFRBackend({
            filter: {
                cards: ifrRequest.cards,
                configMetadata: {
                    id: ifrRequest.configData.configId,
                    version: ifrRequest.configData.configVersion,
                },
            },
        });

        ifrRequest = {
            ...ifrRequest,
            ...convertedFilter,
        };

        const queryResponse = await new QueryGenSvc(
            queryType,
            ifrRequest,
            config,
            userSpecificSettings,
            placeholderMap,
            pluginOptionalParams,
            censoringThreshold
        ).generateQuery();

        const queryString = `
        INSERT
            INTO
            $$SCHEMA$$.COHORT (COHORT_DEFINITION_ID,
            SUBJECT_ID,
            COHORT_START_DATE)
        WITH cohortdata AS (
            SELECT 
            "pTable".${placeholderMap["@PATIENT.PATIENT_ID"]} AS SUBJECT_ID,
            %(cohortDefinitionId)f AS COHORT_DEFINITION_ID,
            TO_DATE(%(cohortStartDateString)s, 'YYYY-MM-DD HH24:MI:SS') AS COHORT_START_DATE
        ${queryResponse.queryObject.queryString})
		SELECT
            COHORT_DEFINITION_ID,
            SUBJECT_ID,
            COHORT_START_DATE
        FROM
		    cohortdata
        `;

        const response = {
            queryObject: {
                queryString,
                parameterPlaceholders:
                    queryResponse.queryObject.parameterPlaceholders,
            },
        };

        log.debug(`Query response:\n${JSON.stringify(response)}`);
        res.status(200).send(response);
    } catch (err) {
        log.enrichErrorWithRequestCorrelationID(err, req);
        log.error(`Error in generating query (${err.stack})!`);
        res.status(500).send(
            MRIEndpointErrorHandler({
                err: {
                    name: "query-gen-log",
                    message: `Error in generating query (${err.stack})!`,
                },
                language: "en",
            })
        );
    }
}

function getCensoringThreshold(config: any): string {
    // TODO: discuss where the censoring threshold should be stored
    return utils.isNotNullOrEmpty(config.chartOptions.minCohortSize) &&
        !Number.isNaN(Number(config.chartOptions.minCohortSize))
        ? config.chartOptions.minCohortSize
        : "10";
}
