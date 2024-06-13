from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class SnapshotCopyTableConfig(BaseModel):
    tableName: str
    columnsToBeCopied: List[str]


class SnapshotCopyConfig(BaseModel):
    timestamp: Optional[str]
    tableConfig: Optional[List[SnapshotCopyTableConfig]]
    patientsToBeCopied: Optional[List[str]]


class DatamartBaseConfig(BaseModel):
    tableName: str
    timestamp_column: str
    personId_column: str


class DATAMART_FLOW_ACTIONS(str, Enum):
    CREATE_SNAPSHOT = "create_snapshot"  # Copy as a new db schema
    CREATE_PARQUET_SNAPSHOT = "create_parquet_snapshot"  # Copy as parquet file


class CreateDatamartType(BaseModel):
    dialect: str
    target_schema: str
    source_schema: str
    vocab_schema: str
    data_model: str
    database_code: str
    snapshot_copy_config: Optional[SnapshotCopyConfig]
    changelog_file: str
    plugin_classpath: str
    datamart_action: DATAMART_FLOW_ACTIONS
