import * as utilsLib from "@alp/alp-base-utils";
import MRIEndpointErrorHandler from "../../utils/MRIEndpointErrorHandler";
import { getUser } from "@alp/alp-base-utils";
import { IMRIRequest, StudyDbMetadata } from "../../types";
import * as domainValuesService from "../../mri/endpoint/domain_values_service";

export function values(req: IMRIRequest, res, next) {
    function _sendResult(err, result) {
        if (err) {
            return res
                .status(500)
                .send(MRIEndpointErrorHandler({ err, language }));
        }

        res.status(result.httpStatus).send(result.results);
        next();
    }

    const { analyticsConnection } = req.dbConnections;
    const user = getUser(req);
    const language = user.lang;
    const attributePath = req.swagger.params.attributePath.value;
    const attributeType = req.swagger.params.attributeType.value;
    const configId = req.swagger.params.configId.value;
    const configVersion = req.swagger.params.configVersion.value;
    const suggestionLimit = req.swagger.params.suggestionLimit.value;
    const selectedStudyEntityValue =
        req.swagger.params.selectedStudyEntityValue.value;
    const searchQuery = req.swagger.params.searchQuery?.value || "";
    const studies: StudyDbMetadata[] = req.studiesDbMetadata.studies;
    if (studies && studies.length > 0) {
        const studyMetadata: StudyDbMetadata = studies.find(
            (o) => o.id === selectedStudyEntityValue
        );
        if (studyMetadata && studyMetadata.vocabSchemaName) {
            analyticsConnection.schemaName = studyMetadata.vocabSchemaName;
        } else {
            throw new Error(`Vocab schema undefined for Dataset ${selectedStudyEntityValue}`)
        }
    }
    

    analyticsConnection.setCurrentUserToDbSession(
        user.getUser(),
        async (err, data) => {
            if (err) {
                return console.error(err);
            }

            try {
                if (err) {
                    return res
                        .status(500)
                        .send(MRIEndpointErrorHandler({ err, language }));
                }

                utilsLib.assert(
                    attributePath,
                    `The request must contain a property "attributePath"`
                );

                domainValuesService.processRequest(
                    req,
                    {
                        attributePath,
                        attributeType,
                        suggestionLimit,
                        searchQuery,
                        configParams: {
                            action: "getBackendConfig",
                            configId,
                            configVersion,
                            lang: language,
                            selectedStudyEntityValue,
                        },
                    },
                    analyticsConnection,
                    _sendResult
                );
            } catch (err) {
                console.error(err);
                return res.status(500).json({});
            }
        }
    );
}
