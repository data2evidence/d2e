from enum import Enum
from pydantic import BaseModel, Field, UUID4
from typing import Optional, List, Dict


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
    sslTrustStore: str
    hostnameInCertificate: str
    enableAuditPolicies: bool
    readRole: str


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


class StrategusAnalysisType(BaseModel):
    sharedResources: List
    moduleSpecifications: List


class StrategusOptionsType(BaseModel):
    workSchema: str
    cdmSchema: str
    databaseCode: str
    vocabSchemaName: str


class DatabaseDialects(str, Enum):
    HANA = "hana"
    POSTGRES = "postgres"


class requestType(str, Enum):
    GET = "get"
    POST = "post"
    PUT = "put"
    DELETE = "delete"


class internalPluginType(str, Enum):
    DATAMODEL_PLUGIN = "data_management_plugin"
    DATA_CHARACTERIZATION = "data_characterization_plugin"
