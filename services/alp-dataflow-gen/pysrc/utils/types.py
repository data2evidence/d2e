from enum import Enum
from pydantic import BaseModel, Field, UUID4
from typing import Optional, List, Dict
from flows.alp_db_svc.datamart.types import SnapshotCopyConfig


class DBCredentialsType(BaseModel):
    adminPassword: str
    adminUser: str
    readPassword: str
    readUser: str
    dialect: str
    databaseName: str
    host: str
    port: int
    encrypt: bool
    validateCertificate: bool


class HANA_TENANT_USERS(str, Enum):
    ADMIN_USER = "TENANT_ADMIN_USER",
    READ_USER = "TENANT_READ_USER",


class PG_TENANT_USERS(str, Enum):
    ADMIN_USER = "postgres_tenant_admin_user",
    READ_USER = "postgres_tenant_read_user",


class dqdBaseOptionsType(BaseModel):
    schemaName: str
    databaseCode: str
    cdmVersionNumber: str
    vocabSchemaName: str
    releaseDate: str


class dqdOptionsType(dqdBaseOptionsType):
    cohortDefinitionId: Optional[str]
    checkNames: Optional[List[str]]


class dcOptionsType(dqdBaseOptionsType):
    resultsSchema: str
    excludeAnalysisIds: str
    flowName: str
    changelogFilepath: str


class cohortJsonType(BaseModel):
    id: int
    name: str
    createdDate: int
    modifiedDate: int
    hasWriteAccess: bool
    tags: list
    expressionType: str
    expression: dict


class cohortGeneratorOptionsType(BaseModel):
    databaseCode: str
    schemaName: str
    vocabSchemaName: str
    cohortJson: cohortJsonType
    datasetId: str
    description: str
    owner: str
    token: str


class cohortSurvivalOptionsType(BaseModel):
    databaseCode: str


class omopCDMOptionsType(BaseModel):
    databaseCode: str
    schemaName: str
    cdmVersion: str


class AlpDBSvcOptionsType(BaseModel):
    requestType: str
    requestUrl: str
    requestBody: Optional[Dict]


class meilisearchAddIndexType(BaseModel):
    databaseCode: str
    vocabSchemaName: str
    tableName: str
    chunk_size: int
    meilisearch_index_config: Dict
    
class meilisearchAddIndexWithEmbeddingsType(BaseModel):
    databaseCode: str
    vocabSchemaName: str
    tableName: str
    token: str
    chunk_size: int
    meilisearch_index_config: Dict


class portalDatasetType(BaseModel):
    id: UUID4 = Field(...)
    databaseName: str = Field(...)
    databaseCode: str = Field(...)
    schemaName: str = Field(...)
    dialect: str
    visibilityStatus: Optional[str]
    vocabSchemaName: Optional[str]
    type: Optional[str]
    dataModel: Optional[str]
    paConfigId: Optional[UUID4]
    dashboards: Optional[List]
    tags: Optional[List]
    attributes: Optional[List]
    tenant: Optional[Dict]
    tokenStudyCode: Optional[str]
    studyDetail: Optional[Dict]


class extractDatasetSchemaType(BaseModel):
    datasets_with_schema: List[portalDatasetType]
    datasets_without_schema: List[portalDatasetType]


class datasetSchemaMappingType(BaseModel):
    study_id: UUID4 = Field(...)
    database_code: Optional[str]
    schema_name: Optional[str]
    error_code: Optional[int]
    error_desc: Optional[str]
    dataset_attribute: Optional[str]


class getVersionInfoType(BaseModel):
    token: str
    flow_name: str = Field(...)
    changelog_filepath: Optional[str]
    changelog_filepath_list: Dict


class datasetVersionInfoType(BaseModel):
    dataModel: str
    schemaName: str
    currentVersionID: str
    latestVersionID: str
    updatesAvailable: bool


class versionInfoResponseType(BaseModel):
    message: str
    function: str
    errorOccurred: bool
    failedSchemas: List
    successfulSchemas: List[datasetVersionInfoType]


class datasetAttributesType(BaseModel):
    token: str
    versionInfo: Dict
    datasetSchemaMapping: List[datasetSchemaMappingType]


class schemaVersionInfoType(BaseModel):
    current_schema_version: str
    latest_schema_version: str


class StrategusAnalysisType(BaseModel):
    sharedResources: List
    moduleSpecifications: List


class StrategusOptionsType(BaseModel):
    workSchema: str
    cdmSchema: str
    databaseCode: str
    vocabSchemaName: str


class DATABASE_DIALECTS(str, Enum):
    HANA = "hana"
    POSTGRES = "postgres"

class entityCountDistributionType(BaseModel):
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


class requestType(str, Enum):
    GET = "get"
    POST = "post"
    PUT = "put"
    DELETE = "delete"


class internalPluginType(str, Enum):
    DATAMODEL_PLUGIN = "data_management_plugin"
    DATA_CHARACTERIZATION = "data_characterization_plugin"


class dataModelBase(BaseModel):
    database_code: str = Field(...)
    data_model: str = Field(...)
    schema_name: str = Optional[str]
    dialect: str = Field(...)
    flow_name: str = Field(...)
    changelog_filepath: Optional[str]


class createDataModelType(dataModelBase):
    cleansed_schema_option: bool = Field(default=False)
    vocab_schema: str = Field(...)
    update_count: int = Field(default=0)


class updateDataModelType(dataModelBase):
    vocab_schema: str = Field(...)


class rollbackCountType(dataModelBase):
    rollback_count: int = Field(...)


class rollbackTagType(dataModelBase):
    rollback_tag: str = Field(...)


class createSnapshotType(dataModelBase):
    source_schema: str
    vocab_schema: str
    snapshot_copy_config: SnapshotCopyConfig


class questionnaireDefinitionType(dataModelBase):
    questionnaire_definition: Dict


class questionnaireResponseType(dataModelBase):
    questionnaire_id: str
