import { Response } from "express";
import { MriConfigConnection } from "@alp/alp-config-utils";
import {
    IMRIRequest,
    CohortType,
    CohortDefinitionTableType,
} from "../../types";
import MRIEndpointErrorHandler from "../../utils/MRIEndpointErrorHandler";
import { Logger, getUser, User } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
let logger = CreateLogger("analytics-log");
import { CohortEndpoint } from "../../mri/endpoint/CohortEndpoint";
import { generateQuery } from "../../utils/QueryGenSvcProxy";
import { createEndpointFromRequest } from "../../mri/endpoint/CreatePluginEndpoint";
import { PluginEndpointResultType } from "../../types";
import PortalServerAPI from "../PortalServerAPI";
import { convertIFRToExtCohort } from "../../ifr-to-extcohort/main";
import { dataflowRequest } from "../../utils/DataflowMgmtProxy";
import { getDuckdbDirectPostgresWriteConnection } from "../../utils/DuckdbConnection";
import { getCachedbDbConnections } from "../../utils/cachedb/cachedb";
import { env } from "../../env";
const language = "en";

const mriConfigConnection = new MriConfigConnection(
    env.SERVICE_ROUTES?.portalServer
);

export async function getCohortAnalyticsConnection(req: IMRIRequest) {
    // If USE_CACHEDB is true, return early with cachedb connection
    if (env.USE_CACHEDB === "true") {
        let userObj: User;
        try {
            userObj = getUser(req);
            logger.debug(
                `req.headers: ${JSON.stringify(req.headers)}\n
                    currentUser: ${JSON.stringify(userObj)}\n
                    url is: ${req.url}`
            );
        } catch (err) {
            logger.debug(`No user found in request:${err.stack}`);
        }

        // For cohorts, when using cachedb connection, connect to postgres instead of duckdb
        const { analyticsConnection } = await getCachedbDbConnections({
            analyticsCredentials: req.dbCredentials.studyAnalyticsCredential,
            userObj: userObj,
            token: req.headers.authorization,
            datasetId: req.selectedstudyDbMetadata.id,
            replacePostgresWithDuckdb: false,
        });
        return analyticsConnection;
    }

    const { analyticsConnection } = req.dbConnections;
    // If dialect is DUCKDB, get direct postgres write connection instead
    if (analyticsConnection.dialect === "DUCKDB") {
        const { studyAnalyticsCredential } = req.dbCredentials;
        const credentials = {
            credentials: studyAnalyticsCredential,
            schema: studyAnalyticsCredential.schema,
        };
        return await getDuckdbDirectPostgresWriteConnection(credentials);
    }

    return analyticsConnection;
}

async function getStudyDetails(
    datasetId: string,
    res: Response
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
        const studyMatch = studies.find((el) => el.id === datasetId);
        if (!studyMatch) {
            res.status(500).send(
                MRIEndpointErrorHandler({
                    err: {
                        name: "mri-pa",
                        message: `Study metadata not found for the the given datasetId(${datasetId})!`,
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

export async function getAllCohorts(req: IMRIRequest, res: Response) {
    try {
        const analyticsConnection = await getCohortAnalyticsConnection(req);
        let cohortEndpoint = new CohortEndpoint(
            analyticsConnection,
            analyticsConnection.schemaName
        );

        const offset = req.query.offset;
        const limit = req.query.limit;

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

export async function getFilteredCohorts(req: IMRIRequest, res: Response) {
    try {
        const analyticsConnection = await getCohortAnalyticsConnection(req);
        const filterColumn = req.params.filterColumn;
        const filterValue = req.params.filterValue;
        const offset = req.query.offset;
        const limit = req.query.limit;
        const datasetId = req.query.datasetId;
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

export async function createCohort(req: IMRIRequest, res: Response) {
    try {
        const studyId = req.body.datasetId;
        const analyticsConnection = await getCohortAnalyticsConnection(req);
        const { schemaName, databaseCode, vocabSchemaName } = await getStudyDetails(datasetId, res);
        const language = getUser(req).lang;
        const requestQuery: string[] | undefined = req.body?.query?.split(",");
        // Remap mriquery for use in createEndpointFromRequest
        const { cohortDefinition } = await createEndpointFromRequest(req);

        if (env.USE_EXTENSION_FOR_COHORT_CREATION === "true") {
            const mriConfig = await mriConfigConnection.getStudyConfig(
                {
                    req,
                    action: "getBackendConfig",
                    configId: cohortDefinition.configData.configId,
                    configVersion: cohortDefinition.configData.configVersion,
                    lang: language,
                    datasetId,
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
                datasetId
            );
            const now = +new Date();
            const { bookmarkId } = JSON.parse(req.body.syntax);
            await dataflowRequest(req, "POST", `cohort/flow-run`, {
                options: {
                    owner: req.body.owner,
                    token: req.headers.authorization,
                    datasetId,
                    cohortJson: {
                        id: 1, // Not used by us
                        name: req.body.name,
                        tags: [],
                        expression: {
                            datasetId, // required for cohort filtering
                            bookmarkId, // required for cohort filtering
                            ...ohdsiCohortDefinition,
                        },
                        createdDate: now,
                        modifiedDate: now,
                        expressionType: "SIMPLE_EXPRESSION",
                        hasWriteAccess: false,
                    },
                    description: req.body.description,
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
                datasetId,
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
            analyticsConnection.schemaName
        );
        let cohortDefinitionResult =
            await cohortEndpoint.saveCohortDefinitionToDb(cohort);
        let cohortRowCount = await cohortEndpoint.saveCohortToDb(
            cohort,
            queryResponse.queryObject
        );
        res.status(200).send(
            `Inserted ${JSON.stringify(
                cohortDefinitionResult.data
            )} rows to COHORT_DEFINITION and ${JSON.stringify(
                cohortRowCount.data
            )} rows to COHORT
            `
        );
    } catch (err) {
        logger.error(err);
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

export async function generateCohortDefinition(
    req: IMRIRequest,
    res: Response
) {
    try {
        const studyId = req.body.datasetId;
        const { vocabSchemaName } = await getStudyDetails(datasetId, res);
        const language = getUser(req).lang;
        // Remap mriquery for use in createEndpointFromRequest
        const { cohortDefinition } = await createEndpointFromRequest(req);

        const mriConfig = await mriConfigConnection.getStudyConfig(
            {
                req,    
                action: "getBackendConfig",
                configId: cohortDefinition.configData.configId,
                configVersion: cohortDefinition.configData.configVersion,
                lang: language,
                datasetId,
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
            datasetId
        );

        res.status(200).send(ohdsiCohortDefinition);
        return;
    } catch (err) {
        logger.error(err);
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

export async function createCohortDefinition(req: IMRIRequest, res: Response) {
    try {
        const analyticsConnection = await getCohortAnalyticsConnection(req);

        let cohortEndpoint = new CohortEndpoint(
            analyticsConnection,
            analyticsConnection.schemaName
        );

        const cohortDefiniton = <CohortDefinitionTableType>{
            name: req.body.name,
            description: req.body.description,
            owner: req.body.owner,
            creationTimestamp: new Date(),
            modificationTimestamp: null,
            definitionTypeConceptId: req.body.definitionTypeConceptId,
            subjectConceptId: req.body.subjectConceptId,
            syntax: req.body.syntax,
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

export async function deleteCohort(req: IMRIRequest, res: Response) {
    try {
        // Delete cohort from database
        const cohortId = req.query.cohortId;
        const analyticsConnection = await getCohortAnalyticsConnection(req);

        let cohortEndpoint = new CohortEndpoint(
            analyticsConnection,
            analyticsConnection.schemaName
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

// Takes in req object to use pluginEndpoint get patient list, extract patient ids then build and return cohort object
async function getCohortFromMriQuery(req: IMRIRequest): Promise<CohortType> {
    try {
        // Extract mriquery and use pluginEndpoint.retrieveData to get patient list
        let mriquery = req.body.cohort.mriquery;
        const { cohortDefinition, datasetId, pluginEndpoint } =
            await createEndpointFromRequest(req);
        pluginEndpoint.setRequest(req);
        const pluginResult = (await pluginEndpoint.retrieveData({
            cohortDefinition,
            datasetId,
            language,
            dataFormat: "json",
            requestQuery: mriquery,
            patientId: null,
            auditLogChannelName:
                req.usage === "EXPORT" ? "MRI Pt. List Exp" : "MRI Pt. List",
        })) as PluginEndpointResultType;

        // Extract patient id from patient list
        let patientIds = pluginResult.data[0].data.map(
            (obj) => obj["patient.attributes.pid"]
        );

        // Create cohort object
        let cohort = <CohortType>{
            patientIds,
            name: req.body.name,
            description: req.body.description,
            creationTimestamp: new Date(),
            modificationTimestamp: null,
            owner: req.body.owner,
            definitionTypeConceptId: req.body.definitionTypeConceptId,
            subjectConceptId: req.body.subjectConceptId,
            syntax: req.body.syntax,
        };

        return cohort;
    } catch (err) {
        throw err;
    }
}
