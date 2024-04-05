import { UserMgmtAPI } from "../api/UserMgmtAPI";
import * as config from "../utils/config";

const logger = config.getLogger();
const userMgmtApi = new UserMgmtAPI();

export const isUserSystemAdmin = async (token, idpUserId) => {
  // Get all user groups
  const userGroupMetadata = await userMgmtApi.getUserGroups(token, idpUserId);
  if (!userGroupMetadata) {
    logger.info(`User with idpUserId: ${idpUserId} not found`);
    return false;
  }
  // Check if user is in system admin group
  const alp_role_system_admin = userGroupMetadata.alp_role_system_admin;

  if (alp_role_system_admin) {
    logger.info("User has D2E System Admin role");
    return true;
  }
  logger.error("User has no D2E System Admin role");
  return false;
};

export const getUserIdByIdpUserId = async (token, idpUserId) => {
  // Get all user groups
  const userGroupMetadata = await userMgmtApi.getUserGroups(token, idpUserId);
  if (!userGroupMetadata) {
    logger.info(`User with idpUserId: ${idpUserId} not found`);
    return "";
  }
  return userGroupMetadata.userId;
};
