/**
 * Request processor for the aggregation endpoint (e.g. for the bar-chart).
 */
import {
    QueryObject as qo,
    DBConnectionUtil as dbConnectionUtil,
    getUser,
    User,
    Logger,
} from "@alp/alp-base-utils";
import { MriConfigConnection } from "@alp/alp-config-utils";
import QueryObject = qo.QueryObject;
import { QuerySvcResultType } from "../../types";
import { BaseQueryEngineEndpoint } from "./BaseQueryEngineEndpoint";
import { Connection as connLib } from "@alp/alp-base-utils";
import ConnectionInterface = connLib.ConnectionInterface;
import * as utilsLib from "@alp/alp-base-utils";
import { generateQuery } from "../../utils/QueryGenSvcProxy";
import { env } from "../../env";
const log = Logger.CreateLogger("analytics-log");
const mriConfigConnection = new MriConfigConnection(
    env.SERVICE_ROUTES?.portalServer
);

export class PatientCountEndpoint extends BaseQueryEngineEndpoint {
    constructor(connection: ConnectionInterface, unitTestMode?: boolean) {
        super(connection, unitTestMode ? unitTestMode : false);
    }

    public getAnnotationPath(config, annotation) {
        let jsonWalker = utilsLib.getJsonWalkFunction(config);
        let elements = jsonWalker("**.interactions.*.attributes.*");
        let path;
        elements.forEach((element) => {
            if (
                element.obj.annotations &&
                element.obj.annotations.indexOf(annotation) !== -1
            ) {
                path = element.path.split(".attributes.").join(".attributes.");
            }
        });
        if (path) {
            return path;
        } else {
            throw new Error(
                "Error finding annotation in MRI PA configuration."
            );
        }
    }

    public processRequest(
        req,
        configId,
        configVersion,
        studyId,
        bookmarkInputStr: string,
        language
    ) {
        log.addRequestCorrelationID(req);
        return new Promise(async (resolve, reject) => {
            const querySvcParams = {
                queryParams: {
                    configId,
                    configVersion,
                    studyId,
                    queryType: "totalpcount",
                    bookmarkInputStr,
                    language,
                },
            };
            let queryResponse: QuerySvcResultType = await generateQuery(
                req,
                querySvcParams
            );
            let finalQueryObject = queryResponse.queryObject;
            let nql: QueryObject = new QueryObject(
                finalQueryObject.queryString,
                finalQueryObject.parameterPlaceholders,
                finalQueryObject.sqlReturnOn
            );
            let fast: any = queryResponse.fast;

            nql.executeQuery(this.connection, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    // if nothing is returned set the result to 0
                    if (result.data.length !== 1) {
                        result.data = [{ "patient.attributes.pcount": 0 }];
                    }

                    this.responseDbgInfo(result, {
                        FAST: fast.statement,
                        nql,
                    });

                    resolve(result);
                }
            });
        });
    }

    // Theres a chance that this might be done by unauth user
    public async processMultipleStudyRequest(
        req,
        studyIds: string[],
        bookmarkInputStr: string,
        language
    ) {
        log.addRequestCorrelationID(req);
        const promises = [];

        // Get all available Configs
        const payload = {
            action: "getMyConfigList",
            language: "en",
        };
        const myConfigs = (await mriConfigConnection.getMriConfig(
            req,
            payload
        )) as any[];
        if (!myConfigs) {
            log.error("Unable to get any default config");
            throw Error("No Configs found");
        }
        log.info(
            "(PatientCountEndpoint) Retrieve the following configs: " +
                JSON.stringify(myConfigs)
        );

        const DEFAULT_ASSIGNMENT_NAME =
            process.env.ANALYTICS_SVC__DEFAULT_ASSIGNMENT_NAME;
        const selectedConfig = myConfigs?.find(
            ({ meta }) => meta.assignmentName === DEFAULT_ASSIGNMENT_NAME
        );

        log.info(
            "(PatientCountEndpoint) Using assignment name: " +
                DEFAULT_ASSIGNMENT_NAME
        );
        log.info(
            "(PatientCountEndpoint) Found assignment: " +
                JSON.stringify(selectedConfig)
        );

        const configId = selectedConfig.meta.configId;
        const configVersion = selectedConfig.meta.configVersion;

        // Generate DB Credentials for each studyID
        const dbCreds = {};
        const analyticsCredentials = req.dbCredentials.analyticsCredentials;

        let userObj: User;
        userObj = getUser(req);

        studyIds.forEach(async (studyId) => {
            // Get metadata for studyID
            const currMetadata = req.studiesDbMetadata.studies.find(
                (metadata) => metadata.id === studyId
            );
            // Retrieve dbName from metadata or default to first db
            const currStudyDBname: string =
                currMetadata?.databaseName ||
                analyticsCredentials[Object.keys(analyticsCredentials)[0]]
                    .databaseName;
            // Retrieve schema from metadata or default to empty string
            const currStudySchemaName: string = currMetadata
                ? currMetadata.schemaName
                : "";

            // Create StudyAnalyticsCredential for study
            const studyAnalyticsCredential = {
                ...analyticsCredentials[currStudyDBname],
            };
            studyAnalyticsCredential.schemaName = currStudySchemaName
                ? currStudySchemaName.toUpperCase()
                : studyAnalyticsCredential.probeSchemaName.toUpperCase();

            dbCreds[studyId] = studyAnalyticsCredential;
        });

        // Get Config
        studyIds.forEach((studyId) => {
            promises.push(
                new Promise(async (resolve, reject) => {
                    const querySvcParams = {
                        queryParams: {
                            configId,
                            configVersion,
                            studyId,
                            queryType: "totalpcount",
                            bookmarkInputStr,
                            language,
                        },
                    };

                    let queryResponse: QuerySvcResultType = await generateQuery(
                        req,
                        querySvcParams
                    );
                    let finalQueryObject = queryResponse.queryObject;
                    let nql: QueryObject = new QueryObject(
                        finalQueryObject.queryString,
                        finalQueryObject.parameterPlaceholders,
                        finalQueryObject.sqlReturnOn
                    );

                    let fast: any = queryResponse.fast;
                    const ac = dbCreds[studyId];
                    const analyticsConnection =
                        await dbConnectionUtil.DBConnectionUtil.getDBConnection(
                            {
                                credentials: ac,
                                schemaName: ac.schemaName,
                                vocabSchemaName: ac.vocabSchemaName,
                                userObj,
                            }
                        );

                    nql.executeQuery(analyticsConnection, (err, result) => {
                        if (err) {
                            log.enrichErrorWithRequestCorrelationID(err, req);
                            reject(err);
                        } else {
                            // if nothing is returned set the result to 0
                            if (result.data.length !== 1) {
                                result.data = [
                                    { "patient.attributes.pcount": 0 },
                                ];
                            }

                            this.responseDbgInfo(result, {
                                FAST: fast.statement,
                                nql,
                            });

                            // Attach studyID to result
                            result.studyId = studyId;

                            resolve(result);
                        }
                    });
                })
            );
        });
        return Promise.all(promises);
    }
}
