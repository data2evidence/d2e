import logging
from api.OpenIdAPI import OpenIdAPI
from api.UserMgmtAPI import UserMgmtAPI
from api.PortalServerAPI import PortalServerAPI

logger = logging.getLogger(__name__)


def dataset_auth_check(token: str, dataset_id: str):
    '''
    Sends a requets to user mgmt to get allowed datasets based on the user_id in the token, and checks if input dataset_id is in the allowed_dataset list
    Raise error if user is not allowed
    '''
    # Get user from token
    openIdAPI = OpenIdAPI()
    user_id = openIdAPI.get_user_id_from_token(token)
    # Ensure user is authorized to access dataset
    userMgmtAPI = UserMgmtAPI(token)
    allowed_dataset_ids = userMgmtAPI.get_user_allowed_dataset_ids(user_id)

    logger.debug(f"User: {user_id} allowed for dataset: {dataset_id}")
    if dataset_id not in allowed_dataset_ids:
        error_msg = "User does not have access to dataset"
        logger.exception(error_msg)
        raise Exception(error_msg)


def get_dataset_info(token: str, dataset_id: str) -> tuple[str, str, str]:
    '''
    Sends a request to portal server to get dataset with dataset_id to
    resolve dataset_code, schema and vocab_schema from dataset_id
    '''
    portalServerAPI = PortalServerAPI(token)
    dataset = portalServerAPI.get_dataset(dataset_id)
    return dataset["databaseCode"], dataset["schemaName"], dataset["vocabSchemaName"]
