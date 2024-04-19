import os
from time import time
from prefect import flow, task, get_run_logger
import pandas as pd
from flows.testflowbrandan.types import SnapshotCopyTableConfig, SnapshotCopyConfig, DatamartBaseConfig, DATAMART_TYPES
from typing import List
from flows.testflowbrandan.const import DatamartBaseConfigList
from dao.DBDao import DBDao
from dao.MinioDao import MinioDao


def parse_snapshot_copy_config(snapshotCopyConfig: SnapshotCopyConfig | None) -> tuple[str, str, str]:
    # If snapshotCopyConfig is None
    if not snapshotCopyConfig:
        date_filter = ""
        table_config = []
        patients_to_be_copied = []
    else:
        if "timestamp" in snapshotCopyConfig:
            date_filter = snapshotCopyConfig["timestamp"]
        else:
            date_filter = ""

        if "tableConfig" in snapshotCopyConfig:
            table_config = snapshotCopyConfig["tableConfig"]
        else:
            table_config = []

        if "patientsToBeCopied" in snapshotCopyConfig:
            patients_to_be_copied = snapshotCopyConfig["patientsToBeCopied"]
        else:
            patients_to_be_copied = []

    return date_filter, table_config, patients_to_be_copied


def get_filtered_datamart_base_config_list(source_schema_tables: List[str], table_config: List[SnapshotCopyTableConfig]) -> List[DatamartBaseConfig]:
    #  Filter DatamartBaseConfigList to remove elements which are not corresponding to any tables in sourceSchema
    filtered_datamart_base_config_list = list(filter(
        lambda datamart_base_config: datamart_base_config["tableName"].casefold() in [table.casefold() for table in source_schema_tables], DatamartBaseConfigList))

    # Further filter based on tableConfig input parameter
    if table_config:
        filtered_datamart_base_config_list = list(filter(
            lambda datamart_base_config: datamart_base_config["tableName"].casefold() in [snapshot_copy_table_config["tableName"].casefold() for snapshot_copy_table_config in table_config], filtered_datamart_base_config_list))

    return filtered_datamart_base_config_list


def upload_dataframe_as_parquet_to_object_store(target_schema: str, table_name: str, df: pd.DataFrame):
    alp_system_id = os.getenv("ALP__SYSTEM_ID")
    if not alp_system_id:
        raise KeyError("ENV:ALP__SYSTEM_ID is empty")

    bucket_name = f"parquetsnapshots-{alp_system_id}"
    file_name = f"{target_schema}-{table_name}-{int(time()*1000)}.parquet"

    minio_dao = MinioDao()
    try:
        minio_dao.put_dataframe_as_parquet(bucket_name, file_name, df)
    except Exception as err:
        get_run_logger().error(
            f"""Datamart parquet uploading to object store failed at {bucket_name}/{file_name}""")
        raise err
    else:
        get_run_logger().info(f"""Succesfully uploaded parquet file at {
            bucket_name}/{file_name}""")


@task
def datamart_copy_schema(
    db: DBDao,
    sourceSchema,
    targetSchema,
    snapshotCopyConfig: SnapshotCopyConfig,
    datamart_type: DATAMART_TYPES,
) -> tuple[List[str], List[str]]:
    date_filter, table_config, patients_to_be_copied = parse_snapshot_copy_config(
        snapshotCopyConfig)

    # Gets all the tables except DATABASECHANGELOG and DATABASECHANGELOGLOCK for schema
    source_schema_tables = [column for column in db.get_table_names(
    ) if column.upper() not in ["DATABASECHANGELOG", "DATABASECHANGELOGLOCK"]]

    filtered_datamart_base_config_list = get_filtered_datamart_base_config_list(
        source_schema_tables, table_config)

    successful_tables: List[str] = []
    failed_tables: List[str] = []
    for datamart_base_config in filtered_datamart_base_config_list:
        # Get specific table config
        specific_table_config = next(filter(lambda snapshot_copy_table_config: snapshot_copy_table_config["tableName"].casefold(
        ) == datamart_base_config["tableName"].casefold(), table_config), None)

        if specific_table_config:
            columns_to_be_copied = specific_table_config["columnsToBeCopied"]
        else:
            columns_to_be_copied = ["*"]

        if datamart_type == DATAMART_TYPES.COPY_TO_DB:
            try:
                rows_inserted = db.datamart_copy_table(
                    datamart_base_config, targetSchema, columns_to_be_copied, date_filter, patients_to_be_copied)
            except Exception as err:
                get_run_logger().error(f"""Datamart copying failed from {sourceSchema} to {
                    targetSchema} for table: {datamart_base_config['tableName']} with Error:{err}""")
                failed_tables.append(datamart_base_config["tableName"])
            else:
                get_run_logger().info(f"""Succesfully copied {rows_inserted} rows from {
                    sourceSchema} to {targetSchema} for table: {datamart_base_config['tableName']}""")
                successful_tables.append(datamart_base_config["tableName"])

        elif datamart_type == DATAMART_TYPES.PARQUET:
            try:
                df = db.datamart_get_copy_as_dataframe(
                    datamart_base_config, columns_to_be_copied, date_filter, patients_to_be_copied)
                upload_dataframe_as_parquet_to_object_store(
                    targetSchema, datamart_base_config["tableName"], df)
            except Exception as err:
                get_run_logger().error(f"""Datamart parquet creation failed for {sourceSchema} to {
                    targetSchema} for table: {datamart_base_config['tableName']} with Error:{err}""")
                failed_tables.append(datamart_base_config["tableName"])
            else:
                get_run_logger().info(f"""Succesfully created parquet file for {sourceSchema} to {
                    targetSchema} for table: {datamart_base_config['tableName']}""")
                successful_tables.append(datamart_base_config["tableName"])
        else:
            error_message = f"Datamart type: {datamart_type} is not supported"
            get_run_logger().error(error_message)
            raise ValueError(error_message)

    get_run_logger().info(f"Successful Tables: {successful_tables}")
    get_run_logger().info(f"Failed Tables: {failed_tables}")
    return successful_tables, failed_tables
