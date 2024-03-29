from enum import Enum
from pydantic import BaseModel, Field, UUID4
from typing import Optional, List, Dict


class DBCredentials(BaseModel):
    adminPassword: str
    adminUser: str
    adminPasswordSalt: str
    readPassword: str
    readUser: str
    readPasswordSalt: str
    dialect: str
    databaseName: str
    host: str
    port: int
    encrypt: bool
    validateCertificate: bool


class HANA_TENANT_USERS(Enum):
    ADMIN_USER = "TENANT_ADMIN_USER",
    READ_USER = "TENANT_READ_USER",


class PG_TENANT_USERS(Enum):
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


class omopCDMOptionsType(BaseModel):
    databaseCode: str
    schemaName: str
    cdmVersion: str


class AlpDBSvcOptionsType(BaseModel):
    requestType: str
    requestUrl: str
    requestBody: Optional[Dict]


class meilisearchAddIndexType(BaseModel):
    token: str
    databaseCode: str
    vocabSchemaName: str
    tableName: str


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


class fetchVersionInfoType(BaseModel):
    token: str


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


class DATABASE_DIALECTS(Enum):
    HANA = "hana"
    POSTGRES = "postgres"
