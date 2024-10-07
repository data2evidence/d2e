// tslint:disable:no-console
import * as dotenv from "dotenv";
import {
    DBConnectionUtil as dbConnectionUtil,
    getUser,
    Logger,
    QueryObject,
    EnvVarUtils,
    healthCheckMiddleware,
    User,
    utils,
    Connection,
} from "@alp/alp-base-utils";

import express from "express";
import https from "https";
import helmet from "helmet";
import path from "path";
import { access, constants } from "node:fs/promises";
import * as mri2 from "./mri/endpoint/analytics";
import * as xsenv from "@sap/xsenv";
import { AuditLogger } from "./utils/AuditLogger";
import { Settings } from "./qe/settings/Settings";
import * as swagger from "@alp/swagger-node-runner";
import MRIEndpointErrorHandler from "./utils/MRIEndpointErrorHandler";
import noCacheMiddleware from "./middleware/NoCache";
import timerMiddleware from "./middleware/Timer";
import studyDbCredentialMiddleware from "./middleware/StudyDbCredential";
import { MriConfigConnection } from "@alp/alp-config-utils";
import { StudiesDbMetadata, StudyDbMetadata, IMRIRequest } from "./types";
import PortalServerAPI from "./api/PortalServerAPI";
import { getDuckdbDBConnection } from "./utils/DuckdbConnection";
import { getCachedbDbConnections } from "./utils/cachedb/cachedb";
import { DB } from "./utils/DBSvcConfig";
import { env } from "./env";
dotenv.config();
const log = Logger.CreateLogger("analytics-log");
const mriConfigConnection = new MriConfigConnection(
    env.SERVICE_ROUTES?.portalServer
);
const envVarUtils = new EnvVarUtils(process.env);
/**
 * Declare variables
 */
let alpPortalStudiesDbMetadataCacheTTLSeconds: number;
let studiesDbMetadata: StudiesDbMetadata;
/**
 * Declare Startup Functions
 */

const initRoutes = async (app: express.Application) => {
    app.use(helmet());
    app.use(express.json({ strict: false, limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(noCacheMiddleware);

    // set request correlation ID to logger (if available)
    app.use((req, res, next) => {
        log.addRequestCorrelationID(req);
        next();
    });

    let analyticsCredentials;

    if (envVarUtils.isStageLocalDev()) {
        app.use(timerMiddleware());
    }

    alpPortalStudiesDbMetadataCacheTTLSeconds =
        +env.ANALYTICS_SVC__STUDIES_METADATA__TTL_IN_SECONDS || 600;

    analyticsCredentials = xsenv
        .filterServices({ tag: "analytics" })
        .reduce((acc, item) => {
            // Reduce credentials so that key of object is databaseCode
            acc[item.credentials.code] = item.credentials;
            return acc;
        }, {});

    // Calls Alp-Portal for studies db metadata and cache it
    // Ignore Alp-Portal check for readiness probe check
    app.use(async (req: IMRIRequest, res, next) => {
        log.debug(
            `🚀 ~ file: main.ts ~ line 107 ~ app.use ~ req.headers: ${JSON.stringify(
                req.headers,
                null,
                2
            )}`
        );
        const hasExpiredStudiesDbMetadataCache = (): boolean => {
            if (!studiesDbMetadata) {
                return true;
            }
            const timeToLiveInMilliseconds: number =
                alpPortalStudiesDbMetadataCacheTTLSeconds * 1000;
            return (
                studiesDbMetadata.cachedAt + timeToLiveInMilliseconds <
                Date.now()
            );
        };

        try {
            if (req.url !== "/check-readiness" && !utils.isClientCredReq(req)) {
                const publicEndpoint = "/analytics-svc/api/services/public";
                let studies: StudyDbMetadata[];
                // Checks if its public
                if (req.originalUrl.startsWith(publicEndpoint)) {
                    log.info("getting public studies metadata");
                    studies = await new PortalServerAPI().getPublicStudies();
                    studiesDbMetadata = {
                        studies,
                        cachedAt: Date.now(),
                    };
                } else {
                    // Get Analytics Credential for study based on selected study
                    studies = await new PortalServerAPI().getStudies(
                        req.headers.authorization
                    );
                    studiesDbMetadata = {
                        studies,
                        cachedAt: Date.now(),
                    };
                }

                req.studiesDbMetadata = studiesDbMetadata;
            }

            req.dbCredentials = {
                ...req.dbCredentials,
                analyticsCredentials,
            };

            next();
        } catch (err) {
            log.error(err);
            res.status(500);
        }
    });

    if (!envVarUtils.isTestEnv() && !envVarUtils.isHttpTestRun()) {
        // Get Analytics Credential for study based on selected study
        // Otherwise, default it to the first db connection and use default schema in the connection string
        await app.use(studyDbCredentialMiddleware);
    }

    app.use(async (req: IMRIRequest, res, next) => {
        try {
            if (!utils.isHealthProbesReq(req)) {
                let userObj: User;
                try {
                    userObj = getUser(req);
                    log.debug(
                        `req.headers: ${JSON.stringify(req.headers)}\n
                            currentUser: ${JSON.stringify(userObj)}\n
                            url is: ${req.url}`
                    );
                } catch (err) {
                    log.debug(`No user found in request:${err.stack}`);
                }

                let credentials = null;
                if (envVarUtils.isTestEnv()) {
                    credentials =
                        analyticsCredentials[EnvVarUtils.getEnvs().TESTSCHEMA];
                } else {
                    credentials = req.dbCredentials.studyAnalyticsCredential;
                }

                if (env.USE_CACHEDB === "true") {
                    req.dbConnections = await getCachedbDbConnections({
                        analyticsCredentials: credentials,
                        userObj: userObj,
                        token: req.headers.authorization,
                        studyId: req.selectedstudyDbMetadata.id,
                    });
                } else {
                    req.dbConnections = await getDBConnections({
                        analyticsCredentials: credentials,
                        userObj,
                    });
                }
            }

            next();
        } catch (err) {
            next(err);
        }
    });

    app.use((req: IMRIRequest, res, next) => {
        if (!utils.isHealthProbesReq(req)) {
            dbConnectionUtil.DBConnectionUtil.cleanupMiddleware()(
                req as any,
                res,
                next
            );
        } else {
            next();
        }
    });

    app.use("/check-readiness", healthCheckMiddleware);

    app.use((req: IMRIRequest, res, next) => {
        if (utils.isClientCredReq(req)) {
            return next();
        }
        try {
            const user = getUser(req);
            //After getting DB Connection, set it to auditlog
            AuditLogger.getAuditLogger({}).setUser(user.getUser());
            next();
        } catch (err) {
            return next(err);
        }
    });

    app.use(
        "/analytics-svc/pa/services/sessionVars",
        (req: IMRIRequest, res, next) => {
            QueryObject.QueryObject.format(
                `select 
      SESSION_CONTEXT('XS_APPLICATIONUSER') as xs_applicationuser, 
      SESSION_CONTEXT('APPLICATIONUSER') as applicationuser, 
      SESSION_CONTEXT('XS_ORGANIZATION') as orgidUser from dummy`
            ).executeQuery(
                req.dbConnections.analyticsConnection,
                (err, result) => {
                    if (err) {
                        log.error(err);
                        return next(err);
                    }
                    res.status(200).json(result);
                }
            );
        }
    );

    app.use(
        "/analytics-svc/pa/services/analytics.xsjs",
        async (req: IMRIRequest, res, next) => {
            // get user from request
            const user = getUser(req);
            const language = user.lang;
            let action = req.query.action
                ? req.query.action
                : req.method === "POST"
                ? req.body.action
                : "";
            let tmpbody =
                (req.query.data ? JSON.parse(<string>req.query.data) : null) ||
                req.body;
            let body;
            body = typeof tmpbody === "object" ? tmpbody : JSON.parse(tmpbody);
            body.language = language;
            const csvParam = req.query.csvparam
                ? JSON.parse(<string>req.query.csvparam)
                : req.body.csvParam;

            const { analyticsConnection } = req.dbConnections;

            let configResults;
            switch (action) {
                case "getMyConfig":
                case "getMyConfigList":
                case "getMyStudyConfigList":
                    let specificStudyId =
                        typeof req.query?.selectedStudyId === "string"
                            ? req.query.selectedStudyId
                            : null;
                    let queryParams = {
                        action: "getMyConfig",
                        datasetId: specificStudyId,
                    };

                    configResults = await mriConfigConnection.getMriConfig(
                        req,
                        queryParams
                    );
                    if (!configResults) {
                        res.status(500).send(
                            MRIEndpointErrorHandler({
                                err: {
                                    name: "mri-pa",
                                    message: `Error in getting the list of configs!`,
                                },
                                language,
                            })
                        );
                    } else if (configResults.statusCode) {
                        if (configResults.statusCode === 500) {
                            log.error(configResults.message);
                            res.status(500).send(
                                MRIEndpointErrorHandler({
                                    err: {
                                        name: "mri-pa",
                                        message: `Error in getting the list of configs!`,
                                    },
                                    language,
                                })
                            );
                        }
                    } else {
                        res.status(200).json(configResults);
                    }
                    break;
                case "getFrontendConfig":
                case "setDefault":
                case "clearDefault":
                    let studyId =
                        typeof req.query?.studyId === "string"
                            ? req.query.studyId
                            : null;
                    let qParams = {
                        action: "getMyConfig",
                        datasetId: studyId,
                    };
                    configResults = await mriConfigConnection.getMriConfig(
                        req,
                        qParams
                    );
                    if (!configResults) {
                        res.status(500).send(
                            MRIEndpointErrorHandler({
                                err: {
                                    name: "mri-pa",
                                    message: `Error in clearing default config!`,
                                },
                                language,
                            })
                        );
                    } else if (configResults.statusCode) {
                        if (configResults.statusCode === 500) {
                            log.error(configResults.message);
                            res.status(500).send(
                                MRIEndpointErrorHandler({
                                    err: {
                                        name: "mri-pa",
                                        message: `Error in clearing default config!`,
                                    },
                                    language,
                                })
                            );
                        }
                    } else {
                        res.status(200).json(configResults);
                    }
                    break;
                default:
                    try {
                        let configData = Array.isArray(body)
                            ? body[0].configData
                            : body.configData;
                        if (!configData) {
                            let configMetadata = Array.isArray(body)
                                ? body[0].filter.configMetadata
                                : body.filter.configMetadata;
                            configData = {
                                configId: configMetadata.id,
                                configVersion: configMetadata.version,
                            };
                        }
                        const configId = configData.configId;
                        const configVersion = configData.configVersion;
                        const studyId = req.body.selectedStudyEntityValue;
                        const mriConfig =
                            await mriConfigConnection.getStudyConfig(
                                {
                                    req,
                                    action: "getBackendConfig",
                                    configId,
                                    configVersion,
                                    lang: language,
                                    datasetId: studyId,
                                },
                                true
                            );

                        let userSpecificSettings =
                            new Settings().initAdvancedSettings(
                                mriConfig.config.advancedSettings
                            );
                        let placeholderMap =
                            userSpecificSettings.getPlaceholderMap();

                        if (
                            [
                                "aggquerycsv",
                                "boxplotcsv",
                                "kmquerycsv",
                                "patientdetailcsv",
                            ].indexOf(action) > -1
                        ) {
                            let sFilename;
                            switch (action) {
                                case "aggquerycsv":
                                    sFilename =
                                        req.query.name ||
                                        "PatientAnalytics_Bar-Chart_" +
                                            new Date().toISOString() +
                                            ".csv";
                                    break;
                                case "boxplotcsv":
                                    sFilename =
                                        req.query.name ||
                                        "PatientAnalytics_Boxplot-Chart_" +
                                            new Date().toISOString() +
                                            ".csv";
                                    break;
                                case "kmquerycsv":
                                    sFilename =
                                        req.query.name ||
                                        "PatientAnalytics_Kaplan-Meier_" +
                                            new Date().toISOString() +
                                            ".csv";
                                    break;
                                case "patientdetailcsv":
                                    sFilename =
                                        req.query.name ||
                                        "PatientAnalytics_Patient-List_" +
                                            new Date().toISOString() +
                                            ".csv";
                                    break;
                                default:
                                    break;
                            }
                            mri2.processRequestCsv(
                                action,
                                req,
                                configId,
                                configVersion,
                                studyId,
                                body,
                                language,
                                analyticsConnection,
                                csvParam,
                                (err, result) => {
                                    if (err) {
                                        return res.status(500).send(
                                            MRIEndpointErrorHandler({
                                                err,
                                                language,
                                            })
                                        );
                                    }
                                    res.set({
                                        "content-disposition":
                                            "attachment; filename=" + sFilename,
                                        "content-Type": "text/csv",
                                    });
                                    res.status(200).send(result);
                                }
                            );
                        } else {
                            mri2.processRequest(
                                req,
                                action,
                                configId,
                                configVersion,
                                studyId,
                                body,
                                language,
                                mriConfig.config,
                                analyticsConnection,
                                (err, result) => {
                                    if (err) {
                                        return res.status(500).send(
                                            MRIEndpointErrorHandler({
                                                err,
                                                language,
                                            })
                                        );
                                    }
                                    res.status(200).json(result);
                                }
                            );
                        }
                    } catch (err) {
                        return res
                            .status(500)
                            .send(MRIEndpointErrorHandler({ err, language }));
                    }
                    break;
            }
        }
    );

    /**Access rights: End User */

    log.info("Initialized express routes..");
    Promise.resolve();
};

const initSwaggerRoutes = async (app: express.Application) => {
    const config = {
        appRoot: __dirname, // required config
        swaggerFile: path.join(
            `${process.cwd()}`,
            "api",
            "swagger",
            "swagger.yaml"
        ),
    };

    swagger.create(config, (err, swaggerRunner) => {
        if (err) {
            return Promise.reject(err);
        }
        try {
            let swaggerExpress = swaggerRunner.expressMiddleware();
            swaggerExpress.register(app); // install middleware
            log.info("Swagger routes Initialized..");
            Promise.resolve();
        } catch (err) {
            log.error("Error initializing swagger routes: " + err);
            Promise.reject(err);
        }
    });
};

let initSettingsFromEnvVars = () => {
    EnvVarUtils.loadDevSettings();
};

const getDBConnections = async ({
    analyticsCredentials,
    userObj,
}): Promise<{
    analyticsConnection: Connection.ConnectionInterface;
}> => {
    // Define defaults for both analytics & Vocab connections
    let analyticsConnectionPromise;

    if (env.USE_DUCKDB === "true" && analyticsCredentials.dialect !== DB.HANA) {
        // Use duckdb as analyticsConnection if USE_DUCKDB flag is set to true
        const duckdbSchemaFileName = `${analyticsCredentials.code}_${analyticsCredentials.schema}`;
        const duckdbVocabSchemaFileName = `${analyticsCredentials.code}_${analyticsCredentials.vocabSchema}`;

        try {
            // Check duckdb dataset access
            await access(
                path.join(env.DUCKDB__DATA_FOLDER, duckdbSchemaFileName),
                constants.R_OK
            );
            await access(
                path.join(env.DUCKDB__DATA_FOLDER, duckdbVocabSchemaFileName),
                constants.R_OK
            );
            log.debug(
                `Duckdb accessible at paths ${path.join(
                    env.DUCKDB__DATA_FOLDER,
                    duckdbSchemaFileName
                )} AND ${path.join(
                    env.DUCKDB__DATA_FOLDER,
                    duckdbVocabSchemaFileName
                )}`
            );

            // resolve error from getDuckdbDBConnection so that PA screen continues to load and user is able to select other datasets.
            analyticsConnectionPromise = new Promise(
                async (resolve, _reject) => {
                    try {
                        const conn = await getDuckdbDBConnection(
                            duckdbSchemaFileName,
                            duckdbVocabSchemaFileName
                        );
                        resolve(conn);
                    } catch (err) {
                        resolve(err);
                    }
                }
            );
        } catch (e) {
            log.error(e);
            log.warn(
                `Duckdb Inaccessible at following paths ${path.join(
                    env.DUCKDB__DATA_FOLDER,
                    duckdbSchemaFileName
                )} OR ${path.join(
                    env.DUCKDB__DATA_FOLDER,
                    duckdbVocabSchemaFileName
                )}. Hence fallback to Postgres dialect connection`
            );
        }
    }

    if (!analyticsConnectionPromise) {
        //Initialize if not yet until this point
        analyticsConnectionPromise =
            dbConnectionUtil.DBConnectionUtil.getDBConnection({
                credentials: analyticsCredentials,
                schemaName: analyticsCredentials.schema,
                vocabSchemaName: analyticsCredentials.vocabSchema,
                userObj,
            });
    }

    const [analyticsConnection] = await Promise.all([
        analyticsConnectionPromise,
    ]);

    return {
        analyticsConnection,
    };
};
const main = async () => {
    /**
     * Handle Environment Variables
     */
    const mountPath =
        process.env.NODE_ENV === "production"
            ? process.env.ENV_MOUNT_PATH
            : "../../";
    const envFile = `${mountPath}default-env.json`;
    xsenv.loadEnv(envVarUtils.getEnvFile(envFile));
    const port = process.env.ANALYTICS_SVC__PORT || 3000;

    //initialize Express
    const app = express();

    app.use("/check-liveness", healthCheckMiddleware);

    //Since browser triggers this request automatically, handling this else a JWT not found error would be returned.
    app.get("/favicon.ico", (req, res) => {
        res.sendStatus(204); //HTTP status no content
    });

    /**
     * Call Startup Functions
     */

    initSettingsFromEnvVars();
    await initRoutes(app);
    await initSwaggerRoutes(app);
    utils.setupGlobalErrorHandling(app, log);

    const server = https.createServer(
        {
            key: env.TLS__INTERNAL__KEY?.replace(/\\n/g, "\n"),
            cert: env.TLS__INTERNAL__CRT?.replace(/\\n/g, "\n"),
            maxHeaderSize: 8192 * 10,
        },
        app
    );
    server.listen(port);
    log.info(
        `🚀 MRI Application started successfully!. Server listening on port ${port}`
    );
};

try {
    main();
} catch (err) {
    log.error(`
        MRI failed to start! Kindly fix the error and restart the application. ${err.message}
        ${err.stack}`);
    process.exit(1);
}
