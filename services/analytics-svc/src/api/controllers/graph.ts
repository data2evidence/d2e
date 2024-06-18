import { MriConfigConnection } from "@alp/alp-config-utils";
import { IMRIRequest } from "../../types";
import { Logger, getUser } from "@alp/alp-base-utils";
import CreateLogger = Logger.CreateLogger;
let logger = CreateLogger("analytics-log");
import { getDuckdbDirectPostgresWriteConnection } from "../../utils/DuckdbConnection";

import { env } from "../../env";
const language = "en";

const mriConfigConnection = new MriConfigConnection(
    env.SERVICE_ROUTES?.portalServer
);

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

    res.send(data);
}
