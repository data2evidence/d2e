import json
from datetime import datetime
from typing import List, Dict
from prefect import task, get_run_logger

from utils.types import UserType
from utils.DBUtils import DBUtils

from flows.alp_db_svc.liquibase.main import Liquibase
from flows.alp_db_svc.const import OMOP_DATA_MODELS, NON_PERSON_ENTITIES, _check_table_case
from flows.alp_db_svc.types import (LiquibaseAction,
                                    PortalDatasetType, ExtractDatasetSchemaType,
                                    EntityCountDistributionType)


from dao.DBDao import DBDao
from api.PortalServerAPI import PortalServerAPI


def get_version_info_task(changelog_filepath_list: Dict,
                          plugin_classpath: str,
                          token: str,
                          dataset_list: List[PortalDatasetType]):
    logger = get_run_logger()
    if (dataset_list is None) or (len(dataset_list) == 0):
        logger.debug("No datasets fetched from portal")
    else:
        logger.info(
            f"Successfully fetched {len(dataset_list)} datasets from portal")

        dataset_schema_list = extract_db_schema(dataset_list)

        for dataset in dataset_schema_list["datasets_with_schema"]:
            get_and_update_attributes(
                dataset, token, changelog_filepath_list, plugin_classpath)


@task
def extract_db_schema(dataset_list: List[PortalDatasetType]) -> ExtractDatasetSchemaType:
    datasets_with_schema = []
    datasets_without_schema = []
    for _dataset in dataset_list:
        try:
            # validate dataset
            PortalDatasetType(**_dataset)
        except Exception as e:
            # dataset has no db_name and study name
            id = _dataset["id"]
            get_run_logger().error(
                f"Unable to validate dataset with id'{id}': {e}")
            datasets_without_schema.append(_dataset)
        else:
            datasets_with_schema.append(_dataset)
    return {"datasets_with_schema": datasets_with_schema,
            "datasets_without_schema": datasets_without_schema}


@task
def get_and_update_attributes(dataset: PortalDatasetType,
                              token: str,
                              changelog_filepath_list: Dict,
                              plugin_classpath: str
                              ):
    logger = get_run_logger()

    dataset_id = dataset.get("id")
    database_code = dataset.get("databaseCode")
    schema_name = dataset.get("schemaName")
    vocab_schema = dataset.get("vocabSchemaName")
    data_model = dataset.get("dataModel").split(" ")[0]
    changelog_file = changelog_filepath_list.get(data_model)

    try:
        # handle case of wrong db credentials
        dataset_dao = DBDao(database_code, schema_name, UserType.READ_USER)
    except Exception as e:
        logger.error(f"Failed to connect to database")
        raise e
    else:
        # handle case where schema does not exist in db
        schema_exists = dataset_dao.check_schema_exists()
        if schema_exists == False:
            error_msg = f"Schema '{schema_name}' does not exist in db {database_code} for dataset id '{dataset_id}'"
            logger.error(error_msg)
            update_dataset_attributes_table(
                dataset_id, "schema_version", error_msg, token)
            update_dataset_attributes_table(
                dataset_id, "latest_schema_version", error_msg, token)
        else:
            try:
                # update with data model creation date
                created_date = get_created_date(dataset_dao)
                update_dataset_attributes_table(
                    dataset_id, "created_date", created_date, token)
            except Exception as e:
                logger.error(
                    f"Failed to update attribute 'created_date' for dataset id '{dataset_id}' with value '{created_date}' : {e}")
            else:
                logger.info(
                    f"Updated attribute 'created_date' for dataset id '{dataset_id}' with value '{created_date}'")

            try:
                # update with data model last updated date
                updated_date = get_updated_date(dataset_dao)
                update_dataset_attributes_table(
                    dataset_id, "updated_date", updated_date, token)
            except Exception as e:
                logger.error(
                    f"Failed to update attribute 'updated_date' for dataset id '{dataset_id}' with value '{updated_date}' : {e}")
            else:
                logger.info(
                    f"Updated attribute 'updated_date' for dataset id '{dataset_id}' with value '{updated_date}'")

            try:
                # update with last fetched metadata date
                metadata_last_fetch_date = datetime.now().strftime('%Y-%m-%d')
                update_dataset_attributes_table(
                    dataset_id, "metadata_last_fetch_date", metadata_last_fetch_date, token)
            except Exception as e:
                logger.error(
                    f"Failed to update attribute 'metadata_last_fetch_date' for dataset id '{dataset_id}' with value '{metadata_last_fetch_date}' : {e}")
            else:
                logger.info(
                    f"Updated attribute 'metadata_last_fetch_date' for dataset id '{dataset_id}' with value '{metadata_last_fetch_date}'")

            try:
                # update with current version count or error msg
                current_schema_version = get_current_version(dataset_dao)
                update_dataset_attributes_table(
                    dataset_id, "schema_version", current_schema_version, token)
            except Exception as e:
                logger.error(
                    f"Failed to update attribute 'current_schema_version' for dataset id '{dataset_id}' with value '{current_schema_version}' : {e}")
            else:
                logger.info(
                    f"Updated attribute 'current_schema_version' for dataset id '{dataset_id}' with value '{current_schema_version}'")

            if data_model in OMOP_DATA_MODELS:

                is_lower_case = _check_table_case(dataset_dao)

                try:
                    # update with patient count or error msg
                    patient_count = get_patient_count(
                        dataset_dao, is_lower_case)
                    update_dataset_attributes_table(
                        dataset_id, "patient_count", patient_count, token)
                except Exception as e:
                    logger.error(
                        f"Failed to update attribute 'patient count' for dataset {dataset_id}: {e}")
                else:
                    logger.info(
                        f"Updated attribute 'patient count for dataset' {dataset_id} with value {patient_count}")

                try:
                    # update with entity distribution json string
                    entity_count_distribution = get_entity_count_distribution(
                        dataset_dao, is_lower_case)
                    update_dataset_attributes_table(
                        dataset_id, "entity_count_distribution", json.dumps(entity_count_distribution), token)
                except Exception as e:
                    logger.error(
                        f"Failed to update attribute 'entity_count_distribution' for dataset id '{dataset_id}' with value '{entity_count_distribution}' : {e}")
                else:
                    logger.info(
                        f"Updated attribute 'entity_count_distribution' for dataset id '{dataset_id}'  with value '{entity_count_distribution}'")

                try:
                    # update with entity count or error msg
                    total_entity_count = get_total_entity_count(
                        entity_count_distribution)
                    update_dataset_attributes_table(
                        dataset_id, "entity_count", total_entity_count, token)
                except Exception as e:
                    logger.error(
                        f"Failed to update attribute 'total_entity_count' for dataset id '{dataset_id}' with value '{total_entity_count}' : {e}")
                else:
                    logger.info(
                        f"Updated attribute 'total_entity_count' for dataset id '{dataset_id}'  with value '{total_entity_count}'")

                try:
                    # update cdm version with value or error
                    cdm_version = get_cdm_version(dataset_dao, is_lower_case)
                    update_dataset_attributes_table(
                        dataset_id, "version", cdm_version, token)
                except Exception as e:
                    logger.error(
                        f"Failed to update attribute 'cdm_version' for dataset id '{dataset_id}' with value '{cdm_version}' : {e}")
                else:
                    logger.info(
                        f"Updated attribute 'cdm_version' for dataset id '{dataset_id}'  with value '{cdm_version}'")

            try:
                # update with latest version or error msg
                dbutils = DBUtils(database_code)
                db_dialect = dbutils.get_database_dialect()
                tenant_configs = dbutils.extract_database_credentials()

                latest_available_schema_version = get_latest_available_version(dialect=db_dialect,
                                                                               data_model=data_model,
                                                                               changelog_file=changelog_file,
                                                                               schema_name=schema_name,
                                                                               vocab_schema=vocab_schema,
                                                                               tenant_configs=tenant_configs,
                                                                               plugin_classpath=plugin_classpath)
                update_dataset_attributes_table(
                    dataset_id, "latest_schema_version", latest_available_schema_version, token)
            except Exception as e:
                logger.error(
                    f"Failed to update attribute 'latest_available_schema_version' for dataset id '{dataset_id}' with value '{latest_available_schema_version}' : {e}")
            else:
                logger.info(
                    f"Updated attribute 'latest_available_schema_version' for dataset id '{dataset_id}'  with value '{latest_available_schema_version}'")


def get_latest_available_version(**kwargs) -> str:
    kwargs["action"] = LiquibaseAction.STATUS
    try:
        liquibase = Liquibase(**kwargs)
        liquibase_output = liquibase.get_latest_available_version()
        latest_available_schema_version = _extract_version(liquibase_output)
    except Exception as e:
        error_msg = f"Error retrieving latest available version"
        get_run_logger().error(f"{error_msg}: {e}")
        latest_available_schema_version = error_msg
    return latest_available_schema_version


def get_current_version(dao_obj: DBDao) -> str:
    try:
        latest_executed_changeset = dao_obj.get_last_executed_changeset()
        current_version = _extract_version(latest_executed_changeset)
    except Exception as e:
        error_msg = f"Error retrieving current version"
        get_run_logger().error(f"{error_msg}: {e}")
        current_version = error_msg
    return current_version


def get_created_date(dao_obj: DBDao) -> str:
    try:
        created_date = str(dao_obj.get_datamodel_created_date()).split(" ")[0]
    except Exception as e:
        error_msg = f"Error retrieving created date"
        get_run_logger().error(f"{error_msg}: {e}")
        created_date = error_msg
    return created_date


def get_updated_date(dao_obj: DBDao) -> str:
    try:
        updated_date = str(dao_obj.get_datamodel_updated_date()).split(" ")[0]
    except Exception as e:
        error_msg = f"Error retrieving updated date"
        get_run_logger().error(f"{error_msg}: {e}")
        updated_date = error_msg
    return updated_date


def get_patient_count(dao_obj: DBDao, is_lower_case: bool) -> str:
    try:
        if is_lower_case:
            patient_count = dao_obj.get_distinct_count("person", "person_id")
        else:
            patient_count = dao_obj.get_distinct_count("PERSON", "PERSON_ID")
    except Exception as e:
        error_msg = f"Error retrieving patient count"
        get_run_logger().error(f"{error_msg}: {e}")
        patient_count = error_msg
    return str(patient_count)


def get_total_entity_count(entity_count_distribution: Dict) -> str:
    try:
        total_entity_count = 0
        for entity, entity_count in entity_count_distribution.items():
            # value could be str(int) or "error"
            if entity_count == "error":
                continue
            else:
                total_entity_count += int(entity_count)
    except Exception as e:
        error_msg = f"Error retrieving entity count"
        get_run_logger().error(f"{error_msg}: {e}")
        total_entity_count = error_msg
    return str(total_entity_count)


def get_entity_count_distribution(dao_obj: DBDao, is_lower_case: bool) -> EntityCountDistributionType:
    entity_count_distribution = {}
    # retrieve count for each entity table
    for table, unique_id_column in NON_PERSON_ENTITIES.items():
        try:
            if is_lower_case:
                entity_count = dao_obj.get_distinct_count(
                    table, unique_id_column)
            else:
                entity_count = dao_obj.get_distinct_count(
                    table.upper(), unique_id_column.upper())
        except Exception as e:
            get_run_logger().error(
                f"Error retrieving entity count for {table}: {e}")
            entity_count = "error"
        entity_count_key = table.replace("_", " ").title() + " Count"
        if entity_count != "error":
            entity_count_distribution[entity_count_key] = str(entity_count)
    return entity_count_distribution


def get_cdm_version(dao_obj: DBDao, is_lower_case: bool) -> str:
    try:
        if is_lower_case:
            cdm_version = dao_obj.get_value("cdm_source", "cdm_version")
        else:
            cdm_version = dao_obj.get_value("CDM_SOURCE", "CDM_VERSION")
    except Exception as e:
        error_msg = f"Error retrieving CDM version"
        get_run_logger().error(f"{error_msg}: {e}")
        cdm_version = error_msg
    return str(cdm_version)


def update_dataset_attributes_table(dataset_id: str,
                                    attribute_id: str,
                                    attribute_value: str,
                                    token: str) -> None:
    portalServerApi = PortalServerAPI(token)
    portalServerApi.update_dataset_attributes_table(
        dataset_id, attribute_id, attribute_value)


def _extract_version(text_str: str) -> str:
    changeset_folder = text_str.split("/")[4]
    changeset_filename = text_str.split("/")[5].split("_")[0]
    version = changeset_folder + "_" + changeset_filename
    return version
