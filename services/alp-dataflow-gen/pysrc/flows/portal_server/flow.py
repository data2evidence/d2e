from prefect import task, get_run_logger
from utils.types import (
    datasetAttributesType,
    datasetSchemaMappingType,
    portalDatasetType,
    getVersionInfoType,
    versionInfoResponseType,
    schemaVersionInfoType,
    extractDatasetSchemaType,
    PG_TENANT_USERS,
    HANA_TENANT_USERS
)
from dao.DBDao import DBDao
from api.PortalServerAPI import PortalServerAPI
from prefect.artifacts import create_table_artifact
from typing import List
from flows.alp_db_svc.flow import run_command, _db_svc_flowrun_params
from alpconnection.dbutils import get_db_svc_endpoint_dialect


def get_version_info(options: getVersionInfoType):
    logger = get_run_logger()
    token = options.token
    flow_name = options.flow_name
    changelog_filepath = options.changelog_filepath
    changelog_filepath_list = options.changelog_filepath_list

    logger.info("Fetching datasets from portal...")
    try:

        dataset_list = get_datasets_from_portal(token)  # task
    except Exception as e:
        logger.error("Failed to retrieve datasets from portal")
        raise e

    if len(dataset_list) == 0:
        logger.debug("No datasets fetched from portal")
    else:
        logger.info(
            f"Successfully fetched {len(dataset_list)} datasets from portal")

        dataset_schema_list = extract_db_schema(dataset_list)

        # extract unique db
        database_code_list = set(dataset["database_code"]
                                 for dataset in dataset_schema_list["datasets_with_schema"])

        # for database_code in database_code_list
        # create request body
        # run db-svc flow

        for _database_code in database_code_list:
            datasets_by_db = list(
                _dataset for _dataset in dataset_schema_list["datasets_with_schema"] if _dataset["database_code"] == _database_code)

            request_body = {
                "datasetListFromPortal": datasets_by_db, "token": token}

            db_dialect = get_db_svc_endpoint_dialect(_database_code)

            request_body = _db_svc_flowrun_params(
                request_body, db_dialect, flow_name, changelog_filepath
            )

            for dataset in request_body["datasetListFromPortal"]:
                data_model_changelog_filepath = changelog_filepath_list.get(
                    dataset["data_model"].split(" ")[0].replace("_", "-"), "")
                dataset["changelog_filepath"] = f'db/migrations/{db_dialect}/{data_model_changelog_filepath}'

            try:
                # task to fetch version-info for each db
                # db-svc response sent as parameter of update_dataset_attributes flow run
                run_command(
                    "post", f"/alpdb/{db_dialect}/database/{_database_code}/version-info", request_body)
            except Exception as e:
                logger.error(f"Error occurred when fetching version info: {e}")
                raise e

        create_table_artifact(
            key="dataset-attributes-updates-error",
            table=dataset_schema_list["datasets_without_schema"],
            description="Failed to updates attributes for some datasets"
        )


@task
def extract_db_schema(dataset_list: List[portalDatasetType]) -> extractDatasetSchemaType:
    datasets_with_schema = []
    datasets_without_schema = []
    for _dataset in dataset_list:
        try:
            # validate dataset
            portalDatasetType(**_dataset)
        except Exception as e:
            # dataset has no db_name and study name
            failed_record = ETLStatus(1, {"study_id": _dataset["id"]})
            datasets_without_schema.append(failed_record.get_failed_dataset())
        else:
            datasets_with_schema.append({
                "study_id": _dataset["id"],
                "database_code": _dataset["databaseCode"],
                "schema_name": _dataset["schemaName"],
                "data_model": _dataset["dataModel"],
                "vocab_schema": _dataset["vocabSchemaName"]
            })
    return {"datasets_with_schema": datasets_with_schema,
            "datasets_without_schema": datasets_without_schema}


def update_dataset_attributes(options: datasetAttributesType):
    logger = get_run_logger()

    token = options.token
    versionInfo = options.versionInfo
    datasetSchemaMapping = options.datasetSchemaMapping

    if datasetSchemaMapping == []:
        # If fetch version info is not a preceding flow, fetch studies from portal
        logger.info("Fetching datasets from portal...")
        try:
            dataset_list = get_datasets_from_portal(token)  # task
        except Exception as e:
            logger.error("Failed to retrieve datasets from portal")
            raise e

        if len(dataset_list) == 0:
            logger.debug("No datasets fetched from portal")
        else:
            logger.info(
                f"Successfully fetched {len(dataset_list)} datasets from portal")
            extracted_schema_list = extract_db_schema(dataset_list)
            dataset_schema_list = extracted_schema_list["datasets_without_schema"]
            error_list = extracted_schema_list["datasets_without_schema"]
    else:
        dataset_schema_list = datasetSchemaMapping
        compiled_error_list = []

        for _dataset in dataset_schema_list:
            # task for each dataset
            etl_status = get_and_update_attributes(
                _dataset, versionInfo, token)
            dataset_error_list = [x.get_failed_dataset().json()
                                  for x in etl_status]

            compiled_error_list.append(dataset_error_list)

        create_table_artifact(
            key="dataset-attributes-updates-error",
            table=compiled_error_list,
            description="Failed to updates attributes for some datasets"
        )


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
    "specimen": "specimen_id",
    "drug_era": "drug_era_id",
    "dose_era": "dose_era_id",
    "condition_era": "condition_era_id"
}


OMOP_DATA_MODELS = ["omop", "omop5-4", "custom-omop-ms", "custom-omop-ms-phi"]


ETL_STATUS_DESC = {
    0: "Success",
    1: "Fail - Unable to retrieve db, schema for dataset",
    2: "Fail - Schema does not exist in db",
    3: "Fail - Unable to retrieve attributes for dataset",
    4: "Fail - Unable to update data_attribute table"
}


class ETLStatus:
    def __init__(self, status_code: int, dataset: datasetSchemaMappingType, dataset_attribute=None):
        self.status_code = status_code
        self.dataset = dataset
        self.dataset_attribute = dataset_attribute

    def get_failed_dataset(self) -> datasetSchemaMappingType:
        error_details = self.dataset
        error_details.error_code = self.status_code
        error_details.error_desc = ETL_STATUS_DESC[self.status_code]
        error_details.dataset_attribute = self.dataset_attribute if self.dataset_attribute else ""
        return error_details


@task
def get_datasets_from_portal(token: str) -> List[portalDatasetType]:
    portalServerApi = PortalServerAPI(token)
    dataset_list = portalServerApi.get_datasets_from_portal()
    return dataset_list


# Todo: Handle value to persist when failed to retreive a dataset attribute
@task
def get_and_update_attributes(dataset_schema_mapping: datasetSchemaMappingType,
                              version_info_response: versionInfoResponseType,
                              token: str
                              ) -> List[ETLStatus]:
    logger = get_run_logger()
    etl_error_list = []

    dataset_id = dataset_schema_mapping.study_id
    database_code = dataset_schema_mapping.database_code
    schema_name = dataset_schema_mapping.schema_name

    try:
        # handle case of wrong db credentials
        db_dialect = get_db_svc_endpoint_dialect(database_code)

        if db_dialect == "hana":
            db_read_user = HANA_TENANT_USERS.READ_USER
        elif db_dialect == "postgres":
            db_read_user = PG_TENANT_USERS.READ_USER
        dataset_dao = DBDao(database_code, schema_name, db_read_user)
    except Exception as e:
        logger.error(f"Failed to connect to database")
        raise e
    else:
        # handle case where schema does not exist in db
        schema_exists = dataset_dao.check_schema_exists()
        if schema_exists == False:
            error_msg = f"Schema does not exist in db for dataset {dataset_id}"
            logger.error(error_msg)
            update_dataset_attributes_table(
                dataset_id, "schema_version", error_msg, token)
            update_dataset_attributes_table(
                dataset_id, "latest_schema_version", error_msg, token)
            failed_record = ETLStatus(2, dataset_schema_mapping)
            etl_error_list.append(failed_record)
            return etl_error_list

    schema_version_info = extract_version_info(
        schema_name, version_info_response)

    # return current schema version or "error"
    current_schema_version = schema_version_info["current_schema_version"]
    # return latest schema version or "error"
    latest_schema_version = schema_version_info["latest_schema_version"]
    # return data model or "error"
    data_model = schema_version_info["data_model"].split(" ")[0]

    # update current schema version with value or error
    try:
        update_dataset_attributes_table(
            dataset_id, "schema_version", current_schema_version, token)
    except Exception as e:
        logger.error(
            f"Failed updating current schema version for dataset {dataset_id}: {e}")
        failed_record = ETLStatus(
            4, dataset_schema_mapping, "current_schema_version")
        etl_error_list.append(failed_record)
    else:
        logger.info(
            f"Updated current schema version for dataset {dataset_id} with value {current_schema_version}")

    # update latest available schema version with value or error
    try:
        update_dataset_attributes_table(
            dataset_id, "latest_schema_version", latest_schema_version, token)
    except Exception as e:
        logger.error(
            f"Failed updating latest available schema version for dataset {dataset_id}: {e}")
        failed_record = ETLStatus(
            4, dataset_schema_mapping, "latest_schema_version")
        etl_error_list.append(failed_record)
    else:
        logger.info(
            f"Updated latest available schema version for dataset {dataset_id} with value {latest_schema_version}")

    if data_model in OMOP_DATA_MODELS:
        # Check case of table, col names depending on data-model version, db dialect
        is_lower_case = check_table_case(dataset_dao)

        # update patient count with value or error
        try:
            # return patient count or "error"
            patient_count = get_patient_count(dataset_dao, is_lower_case)
            update_dataset_attributes_table(
                dataset_id, "patient_count", patient_count, token)
        except Exception as e:
            logger.error(
                f"Failed updating patient count for dataset {dataset_id}: {e}")
            failed_record = ETLStatus(
                4, dataset_schema_mapping, "patient_count")
            etl_error_list.append(failed_record)
        else:
            logger.info(
                f"Updated patient count for dataset {dataset_id} with value {patient_count}")

        # update entity count with value or error
        try:
            # return entity count or error
            total_entity_count = get_total_entity_count(
                dataset_dao, is_lower_case)
            update_dataset_attributes_table(
                dataset_id, "entity_count", total_entity_count, token)
        except Exception as e:
            logger.error(
                f"Failed updating total entity count for dataset {dataset_id}: {e}")
            failed_record = ETLStatus(
                4, dataset_schema_mapping, "entity_count")
            etl_error_list.append(failed_record)
        else:
            logger.info(
                f"Updated total entity count for dataset {dataset_id} with value {total_entity_count}")

        # update cdm version with value or error
        try:
            # return cdm_version or error
            cdm_version = get_cdm_version(dataset_dao, is_lower_case)
            update_dataset_attributes_table(
                dataset_id, "cdm_version", cdm_version, token)
        except Exception as e:
            logger.error(
                f"Failed updating cdm version for dataset {dataset_id}: {e}")
            failed_record = ETLStatus(
                4, dataset_schema_mapping, "cdm_version")
            etl_error_list.append(failed_record)
        else:
            logger.info(
                f"Updated cdm version for dataset {dataset_id} with value {cdm_version}")

    return etl_error_list


def get_patient_count(dao_obj: DBDao, is_lower_case: bool) -> str:
    try:
        if is_lower_case:
            patient_count = dao_obj.get_distinct_count("person", "person_id")
        else:
            patient_count = dao_obj.get_distinct_count("PERSON", "PERSON_ID")
        return str(patient_count)
    except Exception as e:
        error_msg = f"Error retrieving patient count: {e}"
        get_run_logger().error(error_msg)
        return error_msg


def get_total_entity_count(dao_obj: DBDao, is_lower_case: bool) -> str:
    try:
        total_entity_count = 0
        # retrieve count for each entity table
        for table, unique_id_column in NON_PERSON_ENTITIES.items():
            if is_lower_case:
                entity_count = dao_obj.get_distinct_count(
                    table, unique_id_column)
            else:
                entity_count = dao_obj.get_distinct_count(
                    table.upper(), unique_id_column.upper())
            total_entity_count += entity_count
    except Exception as e:
        error_msg = f"Error retrieving entity count: {e}"
        get_run_logger().error(error_msg)
        total_entity_count = error_msg
    return str(total_entity_count)


def check_table_case(dao_obj: DBDao) -> bool:
    # works only for omop, omop5-4 data models
    table_names = dao_obj.get_table_names()
    if 'person' in table_names:
        return True
    elif 'PERSON' in table_names:
        return False


def get_cdm_version(dao_obj: DBDao, is_lower_case: bool) -> str:
    try:
        if is_lower_case:
            cdm_version = dao_obj.get_cdm_version("cdm_source", "cdm_version")
        else:
            cdm_version = dao_obj.get_cdm_version("CDM_SOURCE", "CDM_VERSION")
    except Exception as e:
        error_msg = f"Error retrieving cdm version: {e}"
        get_run_logger().error(error_msg)
        raise Exception(error_msg) 
    return cdm_version


def update_dataset_attributes_table(dataset_id: str, attribute_id: str, attribute_value: str, token: str) -> None:
    portalServerApi = PortalServerAPI(token)
    portalServerApi.update_dataset_attributes_table(
        dataset_id, attribute_id, attribute_value)


def extract_version_info(schema_name: str, version_info_response: versionInfoResponseType) -> schemaVersionInfoType:
    combined_list = version_info_response["failedSchemas"] + \
        version_info_response["successfulSchemas"]

    for _schema_response in combined_list:
        if schema_name == _schema_response["schemaName"]:
            mapped_version_info = {
                "current_schema_version": _schema_response.get("currentVersionID", "Error: currentVersionID not present in version info response."),
                "latest_schema_version":  _schema_response.get("latestVersionID", "Error: latestVersionID not present in version info response."),
                "data_model":  _schema_response.get("dataModel", "Error: dataModel not present in version info response.")
            }
    return mapped_version_info
