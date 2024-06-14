from enum import Enum
from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field, UUID4
from flows.alp_db_svc.datamart.types import SnapshotCopyConfig


class LiquibaseAction(str, Enum):
    UPDATE = "update"  # Create and update schema
    UPDATECOUNT = "updateCount"  # Create schema with count
    STATUS = "status"  # Get Version Info
    ROLLBACK_COUNT = "rollbackCount"  # Rollback on n changesets
    ROLLBACK_TAG = "rollback"  # Rollback on tag


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


class UpdateDataModelType(DataModelBase):
    vocab_schema: str = Field(...)


class RollbackCountType(DataModelBase):
    vocab_schema: str = Field(...)
    rollback_count: int = Field(...)


class RollbackTagType(DataModelBase):
    vocab_schema: str = Field(...)
    rollback_tag: str = Field(...)


class CreateSnapshotType(DataModelBase):
    source_schema: str
    vocab_schema: str
    snapshot_copy_config: SnapshotCopyConfig


class QuestionnaireResponseType(DataModelBase):
    questionnaire_id: str


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


class IItemType(BaseModel):
    id: str = ""
    linkId: str = ""
    definition: str = ""
    code: str = ""
    prefix: str = ""
    text: str = ""
    type: str
    enableWhen: str = ""
    enableBehavior: str = ""
    disabledDisplay: str = ""
    required: str = ""
    repeats: str = ""
    readOnly: str = ""
    maxLength: int = 0
    answerConstraint: str = ""
    answerValueSet: str = ""
    answerOption: str = ""
    initial: str = ""
    item: List['IItemType'] = []


IItemType.update_forward_refs()


class IQuestionnaireType(BaseModel):
    resourceType: str
    id: str
    text: Dict = {}
    url: str = ""
    identifier: str = ""
    version: str = ""
    name: str = ""
    title: str = ""
    derivedFrom: str = ""
    status: str
    experimental: bool = True
    subjectType: str = ""
    date: str = ""
    publisher: str = ""
    contact: str = ""
    description: str = ""
    useContext: str = ""
    jurisdiction: str = ""
    purpose: str = ""
    copyright: str = ""
    copyright_label: str = ""
    approvalDate: str = ""
    lastReviewDate: str = ""
    effectivePeriod: str = ""
    code: List[Dict] = []
    item: List[IItemType] = []


class IQuestionnaireColumnsType(BaseModel):
    id: str
    uri: str = ""
    identifier: str = ""
    version: str = ""
    name: str = ""
    title: str = ""
    derivedfrom: str = ""
    status: str
    experimental: str
    subjecttype: str = ""
    date: str = ""
    publisher: str = ""
    contact: str = ""
    description: str = ""
    use_context: str = ""
    jurisdiction: str = ""
    purpose: str = ""
    copyright: str = ""
    copyright_label: str = ""
    approval_date: str = ""
    last_review_date: str = ""
    effective_period: str = ""
    code: str
    created_at: datetime


class QuestionnaireDefinitionType(DataModelBase):
    questionnaire_definition: IQuestionnaireType


class IItemColumnsType(BaseModel):  # Postgres
    id: UUID4
    gdm_questionnaire_id: str
    gdm_item_quesionnaire_parent_id: str
    linkid: str
    definition: str
    code: str
    prefix: str
    text: str
    type: str
    type: str
    enable_when: str
    enable_behavior: str
    disabled_display: str
    required: str
    repeats: str
    readonly: str
    maxlength: str
    answer_constraint: str
    answer_option: str
    answer_valueset: str
    initial_value: str
    created_at: datetime
