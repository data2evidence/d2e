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


class DATAMART_ACTIONS(Enum):
    COPY_AS_DB_SCHEMA = "Copy as db schema"  # Copy as a new db schema
    COPY_AS_PARQUET_FILE = "Copy as parquet file"  # Copy as parquet file


class CreateDatamartType(BaseModel):
    target_schema: str
    source_schema: str
    data_model: str
    database_code: str
    snapshot_copy_config: SnapshotCopyConfig
    plugin_changelog_filepath: str
    plugin_classpath: str
    datamart_action: str


class TempCreateDataModelType(BaseModel):
    dialect: str
    changelog_filepath: str
    flow_name: str
    vocab_schema: str
