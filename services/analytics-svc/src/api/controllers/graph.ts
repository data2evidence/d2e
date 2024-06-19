import { IMRIRequest } from "../../types";
import { Logger } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
let logger = CreateLogger("analytics-log");
import * as Minio from "minio";

import { env } from "../../env";

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO__ENDPOINT,
    port: parseInt(process.env.MINIO__PORT),
    useSSL: process.env.MINIO__SSL === "true",
    accessKey: process.env.MINIO__ACCESS_KEY,
    secretKey: process.env.MINIO__SECRET_KEY,
});

export async function getKmData(req: IMRIRequest, res) {
    // await dataflowRequest(req, "POST", `cohort/flow-run`, {
    //     options: {
    //         owner: req.swagger.params.cohort.value.owner,
    //         token: req.headers.authorization,
    //         datasetId: studyId,
    //         cohortJson: {
    //             id: 1, // Not used by us
    //             name: req.swagger.params.cohort.value.name,
    //             tags: [],
    //             expression: {
    //                 datasetId: studyId, // required for cohort filtering
    //                 bookmarkId, // required for cohort filtering
    //                 ...ohdsiCohortDefinition,
    //             },
    //             createdDate: now,
    //             modifiedDate: now,
    //             expressionType: "SIMPLE_EXPRESSION",
    //             hasWriteAccess: false,
    //         },
    //         description: req.swagger.params.cohort.value.description,
    //         schemaName,
    //         databaseCode,
    //         vocabSchemaName,
    //     },
    // });
    const bucketName = "flows";
    const objectKey = "results/395d0d0d-fda1-4d3c-bd93-f6375e7868de_km.json";

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
