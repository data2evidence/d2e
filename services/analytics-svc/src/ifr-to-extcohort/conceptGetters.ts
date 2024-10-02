import _ from "lodash";
import { ExtCohortConcept } from "./types";
import { terminologyRequest } from "../utils/TerminologySvcProxy";
import { IMRIRequest } from "../types";

export const getConceptByName = async ({
    conceptName,
    req,
    datasetId,
}: {
    conceptName: string;
    req: IMRIRequest;
    datasetId: string;
}): Promise<ExtCohortConcept | null> => {
    const concept = await terminologyRequest(
        req,
        "POST",
        `concept/searchByName`,
        { conceptName, datasetId }
    );

    function upperCaseKeys(obj: ExtCohortConcept): ExtCohortConcept {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const upperKey = key.toUpperCase() as keyof ExtCohortConcept; // Convert the key to uppercase
                result[upperKey as keyof ExtCohortConcept] =
                    obj[key as keyof ExtCohortConcept];
            }
        }

        return result as ExtCohortConcept;
    }

    return concept[0] ? upperCaseKeys(concept[0]) : null;
};
