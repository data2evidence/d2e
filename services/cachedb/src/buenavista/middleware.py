import logging
from enum import Enum
from api.OpenIdAPI import OpenIdAPI
from api.UserMgmtAPI import UserMgmtAPI
from api.PortalServerAPI import PortalServerAPI
from .database import DatabaseDialects
from config import Env

logger = logging.getLogger(__name__)


class DatabaseProtocols(str, Enum):
    A = "A"
    B = "B"


PROTOCOL_A_FORMAT = "[PROTOCOL|DIALECT|DATASETID]"
PROTOCOL_B_FORMAT = "[PROTOCOL|DIALECT|DATABASE_CODE|SCHEMA_NAME|VOCAB_SCHEMA_NAME]"


def d2e_database_format_validation(d2e_database_format: str):
    '''
    Validates if protocol and dialect are supported in d2e_database_format from connection database param
    '''
    _protocol = _get_protocol_from_d2e_database_format(d2e_database_format)
    _dialect = _get_dialect_from_d2e_database_format(d2e_database_format)


def parse_d2e_database_format(token: str, d2e_database_format: str) -> tuple[str, str]:
    '''
    Resolves client connection database d2e format into its individual component.
    Expects database in either of two formats, PROTOCOL_A_FORMAT or PROTOCOL_B_FORMAT
    '''
    protocol = _get_protocol_from_d2e_database_format(d2e_database_format)

    if protocol == DatabaseProtocols.A:
        dialect, dataset_id = _parse_d2e_database_format_A_protocol(
            d2e_database_format)
        database_code, schema, vocab_schema = _get_dataset_info(
            token, dataset_id)

    if protocol == DatabaseProtocols.B:
        dialect, database_code, schema, vocab_schema = _parse_d2e_database_format_B_protocol(
            d2e_database_format)

    return dialect, database_code, schema, vocab_schema


def auth_check(token: str, d2e_database_format: str):
    '''
    auth check, first check if token is from client credentials, if not, move to authorization code flow.
    '''
    # Get user_id from token
    openIdAPI = OpenIdAPI()
    user_id = openIdAPI.get_user_id_from_token(token)

    # Client credentials flow
    # Allow access by returning early for client credentials flow tokens
    if _client_credentials_flow_(user_id, d2e_database_format):
        return

    # Authorization code flow
    if _authorization_code_flow(token, user_id, d2e_database_format):
        return

    raise Exception("Unexpected error occurred in auth_check()!")


def _client_credentials_flow_(user_id, d2e_database_format) -> bool:
    '''
    Check if user_id is in list of application client ids
    '''
    APPLICATION_CLIENT_IDS = [Env.IDP__ALP_DATA_CLIENT_ID]

    if user_id in APPLICATION_CLIENT_IDS:
        logger.debug(
            f"User: {user_id} allowed access for {d2e_database_format} via client credentials flow access")
        return True

    return False


def _authorization_code_flow(token, user_id, d2e_database_format) -> bool:
    '''
    Gets user_id from token, then sends a requets to user mgmt to get user group metadata.
    If user is a system admin, allow access by returning early
    Else check if user has access to dataset
    Raise error if user is not allowed
    '''
    # Get user group metadata from user mgmt
    userMgmtAPI = UserMgmtAPI(token)
    user_group_metadata = userMgmtAPI.get_user_group_metadata(user_id)

    # Guard clause against non-existent user_id
    if user_group_metadata == None:
        raise Exception(f"User with id:{user_id} does not exist")

    # Allow access by returning early if user is a system admin
    if user_group_metadata["alp_role_system_admin"]:
        logger.debug(
            f"User: {user_id} allowed access for {d2e_database_format} via system admin access")
        return True

    protocol = _get_protocol_from_d2e_database_format(d2e_database_format)

    # Access to database via Protocol B is only allowed for system admins
    if protocol == DatabaseProtocols.B:
        raise Exception(
            "Access to database via Protocol B is only allowed for system admins")

    if protocol == DatabaseProtocols.A:
        _dialect, dataset_id = _parse_d2e_database_format_A_protocol(
            d2e_database_format)
        # Check if user is authorized to access dataset
        allowed_dataset_ids = user_group_metadata["alp_role_study_researcher"]
        if dataset_id not in allowed_dataset_ids:
            error_msg = "User does not have access to dataset"
            logger.exception(error_msg)
            raise Exception(error_msg)

        logger.debug(
            f"User: {user_id} allowed access for {d2e_database_format} via dataset access")
        return True

    return False


def _get_protocol_from_d2e_database_format(d2e_database_format: str):
    protocol = d2e_database_format[0]

    if protocol not in [e.value for e in DatabaseProtocols]:
        error_msg = f"Protocol:{protocol} is invalid! Supported database protocols are:{DatabaseProtocols}"
        logger.exception(error_msg)
        raise Exception(error_msg)

    return protocol


def _get_dialect_from_d2e_database_format(d2e_database_format: str):
    dialect = d2e_database_format.split("|")[1]

    # Guard clause against invalid dialects
    if dialect not in [e.value for e in DatabaseDialects]:
        raise Exception(
            f"Dialect:{dialect} not support! Supported dialects are: {', '.join([e.value for e in DatabaseDialects])}")
    return dialect


def _parse_d2e_database_format_A_protocol(d2e_database_format) -> tuple[str, str]:
    databaseComponents = d2e_database_format.split("|")[1:]
    # Simple conditional check to check if database param has two components separated by "|" excluding protocol
    if len(databaseComponents) != 2:
        raise Exception(
            f"Database param:{d2e_database_format} for protocol A is invalid! Database has to be in the format of {PROTOCOL_A_FORMAT}")
    return databaseComponents


def _parse_d2e_database_format_B_protocol(d2e_database_format) -> tuple[str, str, str, str]:
    databaseComponents = d2e_database_format.split("|")[1:]

    dialect = _get_dialect_from_d2e_database_format(d2e_database_format)

    if dialect == DatabaseDialects.DUCKDB:
        # Simple conditional check to check if database param has four compoenents separated by "|" excluding protocol
        if len(databaseComponents) != 4:
            raise Exception(
                f"Database param:{d2e_database_format} for protocol B is invalid! Database has to be in the format of {PROTOCOL_B_FORMAT}")

    if dialect == DatabaseDialects.POSTGRES or dialect == DatabaseDialects.HANA:
        # When dialect is postgresql or hana, SCHEMA_NAME and VOCAB_SCHEMA_NAME are optional.
        if len(databaseComponents) < 2 or len(databaseComponents) > 4:
            raise Exception(
                f"Database param:{d2e_database_format} for protocol B is invalid! Database has to be in the format of {PROTOCOL_B_FORMAT}")

    # Pad databaseComponents with empty strings until it is a list of length 4
    databaseComponents += [''] * (4 - len(databaseComponents))
    return databaseComponents


def _get_dataset_info(token: str, dataset_id: str) -> tuple[str, str, str]:
    '''
    Sends a request to portal server to get dataset with dataset_id to
    resolve dataset_code, schema and vocab_schema from dataset_id
    '''
    portalServerAPI = PortalServerAPI(token)
    dataset = portalServerAPI.get_dataset(dataset_id)
    return dataset["databaseCode"], dataset["schemaName"], dataset["vocabSchemaName"]
