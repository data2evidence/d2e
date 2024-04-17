from prefect import flow, task, get_run_logger
from flows.testflowbrandan.types import SnapshotCopyTableConfig, SnapshotCopyConfig, DatamartBaseConfig
from typing import List
from flows.testflowbrandan.const import DatamartBaseConfigList


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
        lambda datamart_base_config: datamart_base_config["name"].casefold() in [table.casefold() for table in source_schema_tables], DatamartBaseConfigList))

    # Further filter based on tableConfig input parameter
    if table_config:
        filtered_datamart_base_config_list = list(filter(
            lambda datamart_base_config: datamart_base_config["name"].casefold() in [snapshot_copy_table_config["tableName"].casefold() for snapshot_copy_table_config in table_config], filtered_datamart_base_config_list))

    return filtered_datamart_base_config_list


@task
def saveSnapshotToDb(
    db,
    sourceSchema,
    targetSchema,
    snapshotCopyConfig: SnapshotCopyConfig
) -> List[List[str], List[str]]:
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
        ) == datamart_base_config["name"].casefold(), table_config), None)

        if specific_table_config:
            columns_to_be_copied = specific_table_config["columnsToBeCopied"]
        else:
            columns_to_be_copied = ["*"]

        try:
            rows_inserted = db.datamart_copy_table(
                datamart_base_config, targetSchema, columns_to_be_copied, date_filter, patients_to_be_copied)
            get_run_logger().info(f"""Succesfully copied {rows_inserted} rows from {
                sourceSchema} to {targetSchema} for table: {datamart_base_config['name']}""")
            successful_tables.append(datamart_base_config["name"])
        except Exception as err:
            get_run_logger().error(f"""Datamart copying failed from {sourceSchema} to {
                targetSchema} for table: {datamart_base_config['name']} with Error:{err}""")
            failed_tables.append(datamart_base_config["name"])

    get_run_logger().info(f"Successful Tables: {successful_tables}")
    get_run_logger().info(f"Failed Tables: {failed_tables}")
    return [successful_tables, failed_tables]
