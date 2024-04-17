from pydantic import BaseModel
from typing import Optional, List


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
