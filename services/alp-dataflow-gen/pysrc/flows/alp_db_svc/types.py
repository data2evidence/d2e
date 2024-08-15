from enum import Enum
from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field, UUID4


class LiquibaseAction(str, Enum):
    UPDATE = "update"  # Create and update schema
    UPDATECOUNT = "updateCount"  # Create schema with count
    STATUS = "status"  # Get Version Info
    ROLLBACK_COUNT = "rollbackCount"  # Rollback on n changesets
    ROLLBACK_TAG = "rollback"  # Rollback on tag
    CHANGELOG_SYNC = "changelog-sync" # mark all changesets in databasechangelog table as executed


class DataModelBase(BaseModel):
    database_code: str = Field(...)
    data_model: str = Field(...)
    schema_name: str = Optional[str]
    dialect: str = Field(...)
    flow_name: str = Field(...)
    changelog_filepath: Optional[str]
    changelog_filepath_list: Dict


class CreateDataModelType(DataModelBase):
    cleansed_schema_option: Optional[bool]
    vocab_schema: str = Field(...)
    update_count: Optional[int]


class UpdateFlowActionType(str, Enum):
    UPDATE = "update_datamodel"
    CHANGELOG_SYNC = "changelog_sync"
    

class UpdateDataModelType(DataModelBase):
    flow_action_type: UpdateFlowActionType
    vocab_schema: str = Field(...)


class RollbackCountType(DataModelBase):
    vocab_schema: str = Field(...)
    rollback_count: int = Field(...)


class RollbackTagType(DataModelBase):
    vocab_schema: str = Field(...)
    rollback_tag: str = Field(...)


class CreateSchemaType(DataModelBase):
    vocab_schema: str


class EntityCountDistributionType(BaseModel):
    OBSERVATION_PERIOD_COUNT: str
    DEATH_COUNT: str
    VISIT_OCCURRENCE_COUNT: str
    VISIT_DETAIL_COUNT: str
    CONDITION_OCCURRENCE_COUNT: str
    DRUG_EXPOSURE_COUNT: str
    PROCEDURE_OCCURRENCE_COUNT: str
    DEVICE_EXPOSURE_COUNT: str
    MEASUREMENT_COUNT: str
    OBSERVATION_COUNT: str
    NOTE_COUNT: str
    EPISODE_COUNT: str
    SPECIMEN_COUNT: str


class PortalDatasetType(BaseModel):
    id: UUID4 = Field(...)
    databaseName: str = Field(...)
    databaseCode: str = Field(...)
    schemaName: str = Field(...)
    visibilityStatus: Optional[str]
    vocabSchemaName: Optional[str]
    dialect: Optional[str]
    type: Optional[str]
    dataModel: Optional[str]
    paConfigId: Optional[UUID4]
    dashboards: Optional[List]
    tags: Optional[List]
    attributes: Optional[List]
    tenant: Optional[Dict]
    tokenStudyCode: Optional[str]
    studyDetail: Optional[Dict]


class GetVersionInfoType(DataModelBase):
    token: str
    datasets: List


class ExtractDatasetSchemaType(BaseModel):
    datasets_with_schema: List[PortalDatasetType]
    datasets_without_schema: List[PortalDatasetType]

