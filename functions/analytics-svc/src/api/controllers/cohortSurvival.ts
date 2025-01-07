import { IMRIRequest } from "../../types";
import { Logger } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
let logger = CreateLogger("analytics-log");
import * as Minio from "minio";

import { env } from "../../env";
import { dataflowRequest } from "../../utils/DataflowMgmtProxy";
import MRIEndpointErrorHandler from "../../utils/MRIEndpointErrorHandler";
import PortalServerAPI from "../PortalServerAPI";

const language = "en";

const minioClient = new Minio.Client({
    endPoint: env.MINIO__ENDPOINT,
    port: env.MINIO__PORT,
    useSSL: env.MINIO__SSL === "true",
    accessKey: env.MINIO__ACCESS_KEY,
    secretKey: env.MINIO__SECRET_KEY,
});

async function getStudyDetails(
    datasetId: string,
    res,
    accessToken: string
): Promise<{
    databaseCode: string;
    schemaName: string;
    vocabSchemaName: string;
}> {
    try {
        const portalServerAPI = new PortalServerAPI();
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

export async function getKmData(req: IMRIRequest, res) {
    const timeoutMs = 20 * 60 * 1000;
    const retryIntervalMs = 10 * 1000;
    let startTimeMs = +new Date();

    const wait = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, retryIntervalMs);
        });
    };

    const checkFlowRunState = async () => {
        if (+new Date() < startTimeMs + timeoutMs) {
            const result = await dataflowRequest(
                req,
                "GET",
                `jobplugins/cohort-survival/results/${req.query.flowRunId}`,
                null
            );
            if (result.parameters.options.datasetId !== req.query.datasetId) {
                throw new Error("Not authorized to view this flow run.");
            }
            if (
                ["CANCELLING", "CANCELLED", "FAILED", "CRASHED"].includes(
                    result.state.type
                )
            ) {
                throw new Error(
                    "Cohort survival results could not be retrieved as flow run was unsuccessful"
                );
            }

            if (result.state.type === "COMPLETED") {
                return;
            }
            await wait();
            await checkFlowRunState();
        } else {
            throw new Error(
                "Check flow run state for Kaplan Meier analysis timeout"
            );
        }
    };
    await checkFlowRunState();

    const bucketName = "flows";
    const objectKey = `results/${req.query.flowRunId}_km.json`;
    try {
        console.info("Checking for Kapler-Meier Data");
        minioClient.getObject(
            bucketName,
            objectKey,
            async (err, dataStream) => {
                if (err) {
                    // if (typeof error === )
                    console.error("Error fetching object:", err);
                    return res
                        .status(500)
                        .send("Error fetching object from MinIO");
                }

                // Set appropriate headers
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="${objectKey}"`
                );
                res.setHeader("Content-Type", "application/json"); // Adjust based on your file type

                // Pipe the object data directly to the response
                dataStream.pipe(res);

                dataStream.on("end", () => {
                    console.log("Object successfully streamed to response");
                });

                dataStream.on("error", (err) => {
                    console.error("Stream error:", err);
                    res.status(500).send("Error streaming object data");
                });
            }
        );
    } catch (error) {
        console.error("Error in handling request:", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function analyzeCohortsKm(req: IMRIRequest, res) {
    const datasetId = req.query.datasetId as string;
    const accessToken = req.headers.authorization as string;
    const { schemaName, databaseCode } = await getStudyDetails(datasetId, res, accessToken);
    const result = await dataflowRequest(
        req,
        "POST",
        `jobplugins/cohort-survival/flow-run`,
        {
            options: {
                schemaName,
                databaseCode,
                targetCohortDefinitionId: req.body.targetCohortId,
                outcomeCohortDefinitionId: req.body.outcomeCohortId,
                datasetId: datasetId,
            },
        }
    );
    res.json(result);
}
