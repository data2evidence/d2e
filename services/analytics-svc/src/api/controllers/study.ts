import { Logger } from "@alp/alp-base-utils";
import { getUser } from "@alp/alp-base-utils";
import { AlpMetadataTypes } from "@alp/alp-metadata";
import PortalServerAPI from "../PortalServerAPI";

const log = Logger.CreateLogger("analytics-log");

export async function userStudies(req, res) {
    log.addRequestCorrelationID(req);
    try {
        const user = getUser(req);

        const userRoles = [
            ...new Set([
                ...(user.userObject.alpRoleMap.STUDY_RESEARCHER_ROLE
                    ? user.userObject.alpRoleMap.STUDY_RESEARCHER_ROLE
                    : []),
                ...(user.userObject.alpRoleMap.STUDY_MANAGER_ROLE
                    ? user.userObject.alpRoleMap.STUDY_MANAGER_ROLE
                    : []),
            ]),
        ];

        const result = await new PortalServerAPI().getStudies(
            req.headers.authorization
        );
        const userAssignedStudies = result
            .filter(
                (study: AlpMetadataTypes.StudyName) =>
                    study.studyDetail !== null
            )
            .map((study: AlpMetadataTypes.StudyName) => ({
                id: study.id,
                name: study.studyDetail.name,
            }))
            .filter(
                (study: { id: string; name: string }) =>
                    userRoles.findIndex((role) => role === study.id) > -1
            );

        res.send(userAssignedStudies);
    } catch (err) {
        log.enrichErrorWithRequestCorrelationID(err, req);
        log.error(err);
        return res.status(500);
    }
}
