from enum import Enum
from pydantic import BaseModel
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
    changelogFile: str


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


class InternalPluginType(str, Enum):
    DATA_MANAGEMENT = "data_management_plugin"
    DATA_CHARACTERIZATION = "data_characterization_plugin"
    DATA_QUALITY = "dqd_plugin"
    COHORT_GENERATOR = "cohort_generator_plugin"
    I2B2 = "i2b2_plugin"
    DUCK_DB = "create_duckdb_file_plugin"
    DATAFLOW_UI = "dataflow_ui_plugin"
    MEILISEARCH = "add_search_index_plugin"
    MEILISEARCH_EMBEDDINGS = "add_search_index_with_embeddings_plugin"
    R_CDM = "r_cdm_plugin"
    DATA_LOAD = "data_load_plugin"

    @staticmethod
    def values():
        return InternalPluginType._value2member_map_
