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


class DATAMART_TYPES(Enum):
    COPY_TO_DB = "Copy to db"  # Copy to db
    PARQUET = "Parquet"  # Save as parquet file
