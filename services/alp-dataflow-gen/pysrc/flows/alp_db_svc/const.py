from os import getcwd
from dao import DBDao
from re import sub, compile
from utils.types import InternalPluginType
from utils.DBUtils import DBUtils

OMOP_DATA_MODELS = ["omop", "omop5-4", "custom-omop-ms", "custom-omop-ms-phi"]

# List of tables linked to person table
NON_PERSON_ENTITIES = {
    "observation_period": "observation_period_id",
    "death": "person_id",
    "visit_occurrence": "visit_occurrence_id",
    "visit_detail": "visit_detail_id",
    "condition_occurrence": "condition_occurrence_id",
    "drug_exposure": "drug_exposure_id",
    "procedure_occurrence": "procedure_occurrence_id",
    "device_exposure": "device_exposure_id",
    "measurement": "measurement_id",
    "observation": "observation_id",
    "note": "note_id",
    "episode": "episode_id",
    "specimen": "specimen_id"
}

# Todo: Move to plugin
DATAMODEL_CDM_VERSION = {
    "omop": "5.3",
    "omop5-4": "5.4",
    "custom-omop-ms": "5.3",
    "custom-omop-ms-phi": "5.3"
}


def get_plugin_classpath(flow_name: str) -> str:
    return f'{getcwd()}/{flow_name}/'


def hana_to_postgres(table_name: str) -> str:
    return table_name.lower().replace(".", "_")


def get_db_dialect(options):
    if options.flow_name in InternalPluginType.values():
        return DBUtils(options.database_code).get_database_dialect()
    else:
        return options.dialect


def _check_table_case(dao_obj: DBDao) -> bool:
    # works only for omop, omop5-4 data models
    table_names = dao_obj.get_table_names()
    if 'person' in table_names:
        return True
    elif 'PERSON' in table_names:
        return False


CHANGESET_AVAILABLE_REGEX = compile(r"db/migrations/\S+")
LB_ERROR_MESSAGE_REGEX = compile(r"Unexpected error running Liquibase:")
PASSWORD_REGEX = compile(r"password=\S+")
SSL_TRUST_STORE_REGEX = compile(
    r"&sslTrustStore=-----BEGIN CERTIFICATE-----[a-zA-Z0-9\+\/]+-----END CERTIFICATE-----")
