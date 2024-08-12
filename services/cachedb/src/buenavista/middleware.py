import logging
from api.OpenIdAPI import OpenIdAPI
from api.UserMgmtAPI import UserMgmtAPI
from api.PortalServerAPI import PortalServerAPI

logger = logging.getLogger(__name__)


def auth_check(token: str, dataset_id: str):
    '''
    Gets user_id from token, then sends a requets to user mgmt to get user group metadata.
    If user is a system admin, allow access by returning early
    Else check if user has access to dataset
    Raise error if user is not allowed
    '''
    # Get user_id from token
    openIdAPI = OpenIdAPI()
    user_id = openIdAPI.get_user_id_from_token(token)

    # Get user group metadata from user mgmt
    userMgmtAPI = UserMgmtAPI(token)
    user_group_metadata = userMgmtAPI.get_user_group_metadata(user_id)

    # Allow access by returning early if user is a system admin
    if user_group_metadata["alp_role_system_admin"]:
        logger.debug(
            f"User: {user_id} allowed for dataset: {dataset_id} via system admin access")
        return

    # Check if user is authorized to access dataset
    allowed_dataset_ids = user_group_metadata["alp_role_study_researcher"]
    if dataset_id not in allowed_dataset_ids:
        error_msg = "User does not have access to dataset"
        logger.exception(error_msg)
        raise Exception(error_msg)
    logger.debug(
        f"User: {user_id} allowed for dataset: {dataset_id} via dataset access")


def get_dataset_info(token: str, dataset_id: str) -> tuple[str, str, str]:
    '''
    Sends a request to portal server to get dataset with dataset_id to
    resolve dataset_code, schema and vocab_schema from dataset_id
    '''
    portalServerAPI = PortalServerAPI(token)
    dataset = portalServerAPI.get_dataset(dataset_id)
    return dataset["databaseCode"], dataset["schemaName"], dataset["vocabSchemaName"]
