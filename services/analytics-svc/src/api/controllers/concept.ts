import * as conceptRepository from "../../terminology/concept";
import { Logger } from "@alp/alp-base-utils";
import { IMRIRequest } from "../../types";

const log = Logger.CreateLogger("analytics-log");

export function getStandardConcept(req: IMRIRequest, res) {
    log.addRequestCorrelationID(req);
    const { vocabConnection } = req.dbConnections;
    let conceptCode: string;
    let vocabularyId: string;
    if (req.swagger.params.conceptCode.value) {
        conceptCode = req.swagger.params.conceptCode.value;
    }
    if (req.swagger.params.vocabularyId.value) {
        vocabularyId = req.swagger.params.vocabularyId.value;
    }
    conceptRepository.getStandardConcept(
        vocabConnection,
        conceptCode,
        vocabularyId,
        (err, resultSet) => {
            if (err) {
                log.enrichErrorWithRequestCorrelationID(err, req);
                log.error(err);
                return res.status(500).send({ message: err.message });
            } else if (resultSet.length === 0) {
                return res
                    .status(204)
                    .send({ message: "No standard concept found" });
            }
            res.send({ concept_id: resultSet });
        }
    );
}

export function getDescendantConcepts(req: IMRIRequest, res) {
    log.addRequestCorrelationID(req);
    const { vocabConnection } = req.dbConnections;
    let conceptId: string;
    if (req.swagger.params.conceptId.value) {
        conceptId = req.swagger.params.conceptId.value;
    }
    conceptRepository.getDescendantConcepts(
        vocabConnection,
        conceptId,
        (err, resultSet) => {
            if (err) {
                log.enrichErrorWithRequestCorrelationID(err, req);
                log.error(err);
                return res.status(500).send({ message: err.message });
            }
            res.send({ descendants: resultSet });
        }
    );
}
