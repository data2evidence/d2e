import { Logger, utils } from "@alp/alp-base-utils";
import {
    IMRIRequest,
    StudyAnalyticsCredential,
    StudyDbMetadata,
} from "../types";
import { DB } from "../utils/DBSvcConfig";
import { convertZlibBase64ToJson } from "@alp/alp-base-utils";
import PortalServerAPI from "../api/PortalServerAPI";
const log = Logger.CreateLogger("analytics-log");

export default async (req: IMRIRequest, res, next) => {
    log.addRequestCorrelationID(req);
    const getSelectedStudyEntityValueFromRequest = (): string => {
        const base64EncodedMriQuery = req.query.mriquery;
        const base64DecodedMriQueryJson = base64EncodedMriQuery
            ? convertZlibBase64ToJson(base64EncodedMriQuery.toString())
            : "";
        return base64DecodedMriQueryJson
            ? base64DecodedMriQueryJson.selectedStudyEntityValue
            : "";
    };

    const getSelectedStudyIdFromRequest = (): string => {
        // Try to find studyId from request query
        // If not found, try to find from request body
        // If still not found, return empty string
        if (req.query.studyId) {
            return req.query.studyId.toString();
        } else if (req.query.selectedStudyId) {
            return req.query.selectedStudyId.toString();
        } else if (req.body.studyId) {
            return req.body.studyId.toString();
        } else if (req.query.selectedStudyEntityValue) {
            return req.query.selectedStudyEntityValue.toString();
        } else {
            return "";
        }
    };

    const getDefaultDbConnection = (): any => {
        const studyAnalyticsCredential: StudyAnalyticsCredential = {
            ...analyticsCredentials[Object.keys(analyticsCredentials)[0]],
        };

        if (studyAnalyticsCredential.dialect === DB.HANA) {
            studyAnalyticsCredential.schema =
                studyAnalyticsCredential.schema.toUpperCase();
        }
        req.dbCredentials = {
            ...req.dbCredentials,
            studyAnalyticsCredential,
        };
    };

    const getDbConnectionByStudyMetadata = (
        studyMetadata: StudyDbMetadata
    ): any => {
        // Use default db connection credentials if studyMetadata is undefined
        if (studyMetadata == null) {
            getDefaultDbConnection();
            return;
        }
        // Throw error if studyMetadata.databaseName or studyMetadata.schemaName is undefined
        if (studyMetadata.databaseName == null) {
            throw new Error("studyMetadata.databaseName is empty");
        }
        if (studyMetadata.schemaName == null) {
            throw new Error("studyMetadata.schemaName is empty");
        }
        const studyDatabaseName: string = studyMetadata.databaseName;
        const studySchemaName: string = studyMetadata.schemaName;
        const studyVocabSchemaName: string = studyMetadata.vocabSchemaName;

        log.info(`studyDatabaseName ${studyDatabaseName}`);

        const studyAnalyticsCredential: StudyAnalyticsCredential = {
            ...analyticsCredentials[studyDatabaseName],
        };

        studyAnalyticsCredential.schema = studySchemaName
            ? studySchemaName
            : studyAnalyticsCredential.probeSchema;
        studyAnalyticsCredential.vocabSchema = studyVocabSchemaName
            ? studyVocabSchemaName
            : null;

        if (studyAnalyticsCredential.dialect === DB.HANA) {
            studyAnalyticsCredential.schema =
                studyAnalyticsCredential.schema.toUpperCase();
            studyAnalyticsCredential.vocabSchema =
                studyAnalyticsCredential.vocabSchema.toUpperCase();
        }

        req.dbCredentials = {
            ...req.dbCredentials,
            studyAnalyticsCredential,
        };
    };

    const analyticsCredentials = req.dbCredentials.analyticsCredentials;

    try {
        if (req.url === "/check-readiness") {
            getDefaultDbConnection();
        } else if (utils.isClientCredReq(req)) {
            if (req.query.studyID) {
                const studyTokenCode: string = String(req.query.studyID);
                log.info(`Selected study ID ${studyTokenCode}`);

                const portalServerAPI = new PortalServerAPI();
                const accessToken =
                    await portalServerAPI.getClientCredentialsToken();
                const studies = await portalServerAPI.getStudies(accessToken);

                const studyMetadata: StudyDbMetadata = studies.find(
                    (o) => o.tokenStudyCode === studyTokenCode
                );
                log.info(
                    `Selected studyMetadata ${JSON.stringify(studyMetadata)}`
                );
                getDbConnectionByStudyMetadata(studyMetadata);
            } else {
                getDefaultDbConnection();
            }
        } else {
            // TODO: throw exact error for missing db metadata later on once mri sends in selected study entity value
            // TODO: check for selected study is in user jwt token for authorisation
            let selectedStudyEntityValue: string =
                getSelectedStudyEntityValueFromRequest();
            // If selectedStudyEntityValue is not found from mriquery, try and find studyId from request query or body
            if (!selectedStudyEntityValue) {
                selectedStudyEntityValue = getSelectedStudyIdFromRequest();
            }
            const studyMetadata: StudyDbMetadata =
                req.studiesDbMetadata.studies.find(
                    (o) => o.id === selectedStudyEntityValue
                );
            getDbConnectionByStudyMetadata(studyMetadata);
        }

        next();
    } catch (err) {
        log.enrichErrorWithRequestCorrelationID(err, req);
        log.error(err);
        res.status(500);
    }
};
