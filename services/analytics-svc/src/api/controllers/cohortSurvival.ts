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
    endPoint: process.env.MINIO__ENDPOINT,
    port: parseInt(process.env.MINIO__PORT),
    useSSL: process.env.MINIO__SSL === "true",
    accessKey: process.env.MINIO__ACCESS_KEY,
    secretKey: process.env.MINIO__SECRET_KEY,
});

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

export async function getKmData(req: IMRIRequest, res) {
    // TODO: get object location from flow first
    const bucketName = "flows";
    const objectKey = "results/fe82e061-c5d8-46f5-9b0a-0e6c256ea606_km.json";

    try {
        // Get the object from MinIO
        minioClient.getObject(bucketName, objectKey, (err, dataStream) => {
            if (err) {
                console.error("Error fetching object:", err);
                return res.status(500).send("Error fetching object from MinIO");
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
        });
    } catch (error) {
        console.error("Error in handling request:", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function analyzeCohortsKm(req: IMRIRequest, res) {
    const studyId = req.query.studyId as string;
    const { schemaName, databaseCode } = await getStudyDetails(studyId, res);
    const flowRunId = await dataflowRequest(
        req,
        "POST",
        `cohort-survival/flow-run`,
        {
            options: {
                schema_name: schemaName,
                database_code: databaseCode,
                targetCohortDefinitionId: req.body.targetCohortId,
                outcomeCohortDefinitionId: req.body.outcomeCohortId,
            },
        }
    );
    res.json({ flowRunId });
}
