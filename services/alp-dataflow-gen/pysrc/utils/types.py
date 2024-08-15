from enum import Enum
from pydantic import BaseModel


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


class UserType(str, Enum):
    ADMIN_USER = "admin_user"
    READ_USER = "read_user"


class HANA_TENANT_USERS(str, Enum):
    ADMIN_USER = "TENANT_ADMIN_USER",
    READ_USER = "TENANT_READ_USER",


class PG_TENANT_USERS(str, Enum):
    ADMIN_USER = "postgres_tenant_admin_user",
    READ_USER = "postgres_tenant_read_user",


class DatabaseDialects(str, Enum):
    HANA = "hana"
    POSTGRES = "postgres"


class RequestType(str, Enum):
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
    DUCK_DB = "create_cachedb_file_plugin"
    DATAFLOW_UI = "dataflow_ui_plugin"
    MEILISEARCH = "add_search_index_plugin"
    MEILISEARCH_EMBEDDINGS = "add_search_index_with_embeddings_plugin"
    R_CDM = "r_cdm_plugin"
    DATA_LOAD = "data_load_plugin"

    @staticmethod
    def values():
        return InternalPluginType._value2member_map_
