import { MriConfigConnection } from "@alp/alp-config-utils";
import {
    IMRIRequest,
    CohortType,
    CohortDefinitionTableType,
} from "../../types";
import MRIEndpointErrorHandler from "../../utils/MRIEndpointErrorHandler";
import { Logger, getUser } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
let logger = CreateLogger("analytics-log");
import axios, { AxiosRequestConfig } from "axios";
import { DBConnectionUtil as dbConnectionUtil } from "@alp/alp-base-utils";
import { CohortEndpoint } from "../../mri/endpoint/CohortEndpoint";
import { generateQuery } from "../../utils/QueryGenSvcProxy";
import { createEndpointFromRequest } from "../../mri/endpoint/CreatePluginEndpoint";
import PortalServerAPI from "../PortalServerAPI";
import https from "https";
import { convertIFRToExtCohort } from "../../ifr-to-extcohort/main";
import {
    ALP_MINERVA_PORTAL_SERVER__URL,
    USE_EXTENSION_FOR_COHORT_CREATION,
} from "../../config";
import { dataflowRequest } from "../../utils/DataflowMgmtProxy";

const language = "en";

const mriConfigConnection = new MriConfigConnection(
    ALP_MINERVA_PORTAL_SERVER__URL
);

export async function getCohortAnalyticsConnection(req: IMRIRequest) {
    // Get study analytics credentials
    const { studyAnalyticsCredential } = req.dbCredentials;
    // Get connection to db using study analytics credentials
    return await dbConnectionUtil.DBConnectionUtil.getDBConnection({
        credentials: studyAnalyticsCredential,
        schema: studyAnalyticsCredential.schema,
    });
}

async function getStudyDetails(
    studyId: string,
    res
): Promise<{
    databaseCode: string;
    schemaName: string;
    vocabSchemaName: string;
}> {
    try {
        const portalServerAPI = new PortalServerAPI();
        const accessToken = await portalServerAPI.getClientCredentialsToken();
        const studies = await portalServerAPI.getStudies(accessToken);

        // find the matching element and get the study schema name
        const studyMatch = studies.find((el) => el.id === studyId);
        if (!studyMatch) {
            res.status(500).send(
                MRIEndpointErrorHandler({
                    err: {
                        name: "mri-pa",
                        message: `Study metadata not found for the the given studyID(${studyId})!`,
                    },
                    language,
                })
            );
        }
        logger.debug(`Matched study details: ${JSON.stringify(studyMatch)}`);

        return studyMatch;
    } catch (err) {
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

export async function getAllCohorts(req: IMRIRequest, res, next) {
    try {
        const analyticsConnection = await getCohortAnalyticsConnection(req);
        let { schemaName } = await getStudyDetails(
            req.swagger.params.studyId.value,
            res
        );
        let cohortEndpoint = new CohortEndpoint(
            analyticsConnection,
            schemaName
        );

        const offset = req.swagger.params.offset.value;
        const limit = req.swagger.params.limit.value;

        // Send empty object to query all cohorts
        let result = await cohortEndpoint.queryCohorts({}, offset, limit);
        // Get count of all cohort definitions for pagination
        let cohortDefinitionCount =
            await cohortEndpoint.queryCohortDefinitionCount({});

        res.status(200).send({ data: result, cohortDefinitionCount });
    } catch (err) {
        logger.error(err);
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

export async function getFilteredCohorts(req: IMRIRequest, res, next) {
    try {
        const analyticsConnection = await getCohortAnalyticsConnection(req);
        const filterColumn = req.swagger.params.filterColumn.value;
        const filterValue = req.swagger.params.filterValue.value;
        const offset = req.swagger.params.offset.value;
        const limit = req.swagger.params.limit.value;
        const studyId = req.swagger.params.studyId.value;

        let cohortEndpoint = new CohortEndpoint(
            analyticsConnection,
            analyticsConnection.schemaName
        );

        let result = await cohortEndpoint.queryCohorts(
            {
                [filterColumn]:
                    filterColumn === "SYNTAX"
                        ? JSON.parse(filterValue)
                        : filterValue,
            },
            offset,
            limit
        );

        // Get count of all cohort definitions based on filter column for pagination
        let cohortDefinitionCount =
            await cohortEndpoint.queryCohortDefinitionCount({
                [filterColumn]:
                    filterColumn === "SYNTAX"
                        ? JSON.parse(filterValue)
                        : filterValue,
            });

        res.status(200).send({ data: result, cohortDefinitionCount });
    } catch (err) {
        logger.error(err);
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

export async function createCohort(req: IMRIRequest, res, next) {
    try {
        const studyId = req.swagger.params.cohort.value.studyId;
        const analyticsConnection = await getCohortAnalyticsConnection(req);

        const { schemaName, databaseCode, vocabSchemaName } =
            await getStudyDetails(studyId, res);
        const language = getUser(req).lang;
        const requestQuery: string[] | undefined =
            req.swagger.params?.query?.value?.split(",");
        // Remap mriquery for use in createEndpointFromRequest
        req.swagger.params.mriquery = {
            value: req.swagger.params.cohort.value.mriquery,
        };
        const { cohortDefinition } = await createEndpointFromRequest(req);

        if (USE_EXTENSION_FOR_COHORT_CREATION === "true") {
            const mriConfig = await mriConfigConnection.getStudyConfig(
                {
                    req,
                    action: "getBackendConfig",
                    configId: cohortDefinition.configData.configId,
                    configVersion: cohortDefinition.configData.configVersion,
                    lang: language,
                    datasetId: studyId,
                },
                true
            );
            const attributes = {
                filter: {
                    configMetadata: {
                        id: cohortDefinition.configData.configId,
                        version: cohortDefinition.configData.configVersion,
                    },
                    cards: cohortDefinition.cards,
                    sort: "",
                },
            };
            const ohdsiCohortDefinition = await convertIFRToExtCohort(
                attributes,
                mriConfig.config,
                req,
                vocabSchemaName,
                studyId
            );
            const now = +new Date();
            const { bookmarkId } = JSON.parse(
                req.swagger.params.cohort.value.syntax
            );
            await dataflowRequest(req, "POST", `cohort/flow-run`, {
                options: {
                    owner: req.swagger.params.cohort.value.owner,
                    token: req.headers.authorization,
                    datasetId: studyId,
                    cohortJson: {
                        id: 1, // Not used by us
                        name: req.swagger.params.cohort.value.name,
                        tags: [],
                        expression: {
                            datasetId: studyId, // required for cohort filtering
                            bookmarkId, // required for cohort filtering
                            ...ohdsiCohortDefinition,
                        },
                        createdDate: now,
                        modifiedDate: now,
                        expressionType: "SIMPLE_EXPRESSION",
                        hasWriteAccess: false,
                    },
                    description: req.swagger.params.cohort.value.description,
                    schemaName,
                    databaseCode,
                    vocabSchemaName,
                },
            });

            res.status(200).send();
            return;
        }

        const querySvcParams = {
            queryParams: {
                configId: cohortDefinition.configData.configId,
                configVersion: cohortDefinition.configData.configVersion,
                studyId,
                queryType: "plugin",
                ifrRequest: cohortDefinition,
                language,
                requestQuery,
                insert: false,
            },
        };
        // Request query string from query-gen-svc for inserting the cohort patients.
        // In query-gen-svc, it uses the same logic used in patient list to deal with the filters
        const queryResponse = await generateQuery(
            req,
            querySvcParams,
            "cohort"
        );
        const cohort = await getCohortFromMriQuery(req);
        const cohortEndpoint = new CohortEndpoint(
            analyticsConnection,
            schemaName
        );
        let cohortDefinitionResult =
            await cohortEndpoint.saveCohortDefinitionToDb(cohort);
        let cohortRowCount = await cohortEndpoint.saveCohortToDb(
            cohort,
            queryResponse.queryObject
        );

        res.status(200).send(
            `Inserted ${cohortDefinitionResult.data} rows to COHORT_DEFINITION and ${cohortRowCount} rows to COHORT
            `
        );
    } catch (err) {
        logger.error(err);
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

export async function createCohortDefinition(req: IMRIRequest, res, next) {
    try {
        const analyticsConnection = await getCohortAnalyticsConnection(req);

        let { schemaName } = await getStudyDetails(
            req.swagger.params.cohortDefinition.value.studyId,
            res
        );
        let cohortEndpoint = new CohortEndpoint(
            analyticsConnection,
            schemaName
        );

        const cohortDefiniton = <CohortDefinitionTableType>{
            name: req.swagger.params.cohortDefinition.value.name,
            description: req.swagger.params.cohortDefinition.value.description,
            owner: req.swagger.params.cohortDefinition.value.owner,
            creationTimestamp: new Date(),
            modificationTimestamp: null,
            definitionTypeConceptId:
                req.swagger.params.cohortDefinition.value
                    .definitionTypeConceptId,
            subjectConceptId:
                req.swagger.params.cohortDefinition.value.subjectConceptId,
            syntax: req.swagger.params.cohortDefinition.value.syntax,
        };

        await cohortEndpoint.saveCohortDefinitionToDb(cohortDefiniton);

        // Get inserted cohort definition id from cohort definition
        const cohortDefinitionId = await cohortEndpoint.queryCohortDefinitionId(
            cohortDefiniton
        );
        res.status(200).send({
            data: cohortDefinitionId,
        });
    } catch (err) {
        logger.error(err);
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

export async function deleteCohort(req: IMRIRequest, res, next) {
    try {
        // Delete cohort from database
        const cohortId = req.swagger.params.cohortId.value;
        const analyticsConnection = await getCohortAnalyticsConnection(req);

        let { schemaName } = await getStudyDetails(
            req.swagger.params.studyId.value,
            res
        );
        let cohortEndpoint = new CohortEndpoint(
            analyticsConnection,
            schemaName
        );

        // Delete cohort definition from database
        let cohortDefinitionResult =
            await cohortEndpoint.deleteCohortDefinitionFromDb(cohortId);
        // Delete cohort from database
        let cohortResult = await cohortEndpoint.deleteCohortFromDb(cohortId);

        res.status(200).send(
            `Deleted ${cohortDefinitionResult.data} rows from COHORT_DEFINITION and ${cohortResult.data} rows from COHORT with ID: ${cohortId}`
        );
    } catch (err) {
        logger.error(err);
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

// Takes in req object to send get request to get patient list, extract patient ids then build and return cohort object
async function getCohortFromMriQuery(req: IMRIRequest): Promise<CohortType> {
    try {
        // Extract mriquery and send request to analytics-svc to get patient list
        let mriquery = req.swagger.params.cohort.value.mriquery;
        let token = req.headers.authorization;

        let ALP_GATEWAY_ENDPOINT =
            process.env.ALP_PORTAL_MRI_ENDPOINT ||
            "https://alp-minerva-gateway-1:41100/analytics-svc/api/services";
        let AXIOS_TIMEOUT = 100000;

        const url = `${ALP_GATEWAY_ENDPOINT}/patient?mriquery=${encodeURIComponent(
            mriquery
        )}`;
        const options: AxiosRequestConfig = {
            headers: {
                Authorization: token,
            },
            timeout: AXIOS_TIMEOUT,
            httpsAgent: new https.Agent({
                rejectUnauthorized: true,
                ca: process.env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, "\n"),
            }),
        };

        // Send request to analytics-svc for patient list and extract patient ids
        const result = await axios.get(url, options);

        // Extract patient id from patient list
        let patientIds = result.data.data[0].data.map(
            (obj) => obj["patient.attributes.pid"]
        );

        // Create cohort object
        let cohort = <CohortType>{
            patientIds,
            name: req.swagger.params.cohort.value.name,
            description: req.swagger.params.cohort.value.description,
            creationTimestamp: new Date(),
            modificationTimestamp: null,
            owner: req.swagger.params.cohort.value.owner,
            definitionTypeConceptId:
                req.swagger.params.cohort.value.definitionTypeConceptId,
            subjectConceptId: req.swagger.params.cohort.value.subjectConceptId,
            syntax: req.swagger.params.cohort.value.syntax,
        };

        return cohort;
    } catch (err) {
        throw err;
    }
}
