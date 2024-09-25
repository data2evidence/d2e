import { getUser, Logger } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
import { PluginColumnType, IMRIRequest } from "../../types";
import { CohortCompareEndpoint } from "../../mri/endpoint/CohortCompareEndpoint";
import { Settings } from "../../qe/settings/Settings";
import MRIEndpointErrorHandler from "../../utils/MRIEndpointErrorHandler";
import PortalServerAPI from "../PortalServerAPI";
import { getCohortAnalyticsConnection } from "./cohort";

let logger = CreateLogger("mri-log: conhortCompare");

async function getSchemaName(studyId: string, language: string, res) {
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

        return studyMatch.schemaName;
    } catch (err) {
        res.status(500).send(MRIEndpointErrorHandler({ err, language }));
    }
}

export async function getmultiplecohortdata(req: IMRIRequest, res) {
    const analyticsConnection = await getCohortAnalyticsConnection(req);

    const user = getUser(req);
    const lang = user.lang;
    let settings = new Settings();
    let configId: string;
    let configVersion: string;
    let userSelectedAttributes: PluginColumnType[] = [];

    let chartType: string = req.swagger.params.chartType.value;
    let yaxis: string = req.swagger.params.yaxis.value;
    let bmkIds: string = req.swagger.params.ids.value;
    let studyId: string = req.swagger.params.selectedStudyEntityValue.value;

    if (
        req.swagger.params.xaxis.value &&
        req.swagger.params.xaxis.value !== "undefined"
    ) {
        userSelectedAttributes = (req.swagger.params.xaxis.value as string)
            .split(",")
            .map((configPath) => ({
                configPath,
                seq: null,
                order: null,
            }));
    }
    if (
        req.swagger.params.configId.value &&
        req.swagger.params.configVersion.value
    ) {
        configId = req.swagger.params.configId.value;
        configVersion = req.swagger.params.configVersion.value;
    }

    let schemaName = await getSchemaName(studyId, lang, res);

    const querySvcParams = {
        queryParams: {
            bmkIds,
            studyId,
            userSelectedAttributes,
            user,
            yaxis,
            chartType,
            configId,
            configVersion,
        },
    };

    try {
        switch (chartType) {
            case "barchart":
                const data = await new CohortCompareEndpoint(
                    analyticsConnection,
                    schemaName
                ).processStackedBarcharCohortRequest(req, querySvcParams);
                res.status(200).send(data);
                break;
            default:
                return res.status(404).send("chart not found");
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(MRIEndpointErrorHandler({ err, language: lang }));
    }
}
