import os
import logging
from enum import Enum
from typing import Optional, Dict
import duckdb
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from .backends.duckdb import DuckDBConnection
from .backends.postgres import PGConnection
from .backends.hana import HANAConnection
from buenavista import bv_dialects, rewrite
from config import Env

logger = logging.getLogger(__name__)


class DBCredentialsType(BaseModel):
    user: str
    password: str
    dialect: str
    databaseName: str
    host: str
    port: int
    encrypt: bool
    validateCertificate: bool
    sslTrustStore: str
    hostnameInCertificate: str
    enableAuditPolicies: bool


class DatabaseDialects(str, Enum):
    HANA = "hana"
    POSTGRES = "postgresql"
    DUCKDB = "duckdb"


class CachedbDatabaseClients(BaseModel):
    hana: Optional[Dict[str, Engine]] = {}
    postgresql: Optional[Dict[str, Engine]] = {}

    class Config:
        arbitrary_types_allowed = True


def get_database_code_and_dialect_from_db_creds():
    dbs = Env.DATABASE_CREDENTIALS
    return [[db["values"]["code"], db["values"]["dialect"]] for db in dbs]


def extract_db_credentials(database_code: str):
    dbs = Env.DATABASE_CREDENTIALS
    if dbs == []:
        raise ValueError(
            f"Database credentials environment variable is empty")
    else:
        _db = next(filter(lambda x: x["values"]
                          ["code"] == database_code and "analytics" in x["tags"], dbs), None)
        if not _db:
            raise ValueError(
                f"Database code '{database_code}' not found in database credentials")
        else:
            database_credential = DatabaseCredentials(_db)
            return database_credential.get_values()


class DatabaseCredentials:
    def __init__(self, db):
        self.type = db["type"]
        self.tags = db["tags"]
        self.values = db["values"]

    def get_values(self) -> DBCredentialsType:
        values = self.values["credentials"]
        values["databaseName"] = self.values["databaseName"]
        values["dialect"] = self.values["dialect"]
        values["host"] = self.values["host"]
        values["port"] = self.values["port"]
        values["encrypt"] = self.values.get("encrypt", False)
        values["validateCertificate"] = self.values.get(
            "validateCertificate", False)
        values["sslTrustStore"] = self.values.get("sslTrustStore", "")
        values["hostnameInCertificate"] = self.values.get(
            "hostnameInCertificate", "")
        values["enableAuditPolicies"] = self.values.get(
            "enableAuditPolicies", False)

        # validate
        DBCredentialsType(**values)

        return values


def GetDBConnection(database_code: str):
    try:
        conn_details = extract_db_credentials(database_code)
    except Exception as e:
        raise ValueError(
            f"Failed to extract database credential values for database code '{database_code}'") from e
    else:
        database_name = conn_details["databaseName"]
        if conn_details["dialect"] == DatabaseDialects.HANA:
            dialect_driver = "hana+hdbcli"
            encrypt = conn_details["encrypt"]
            validateCertificate = conn_details["validateCertificate"]
            db = database_name + \
                f"?encrypt={encrypt}?validateCertificate={validateCertificate}"
        elif conn_details['dialect'] == DatabaseDialects.POSTGRES:
            dialect_driver = "postgresql+psycopg2"
            db = database_name
        host = conn_details["host"]
        port = conn_details["port"]
        user = conn_details["user"]
        password = conn_details["password"]
        conn_string = _CreateConnectionString(
            dialect_driver, user, password, host, port, db)
        engine = create_engine(
            conn_string, pool_size=Env.CACHEDB__POOL_SIZE)

        return engine


def _CreateConnectionString(dialect_driver: str, user: str, pw: str,
                            host: str, port: int, db: str) -> str:
    conn_string = f"{dialect_driver}://{user}:{pw}@{host}:{port}/{db}"
    return conn_string


def get_db_connection(clients: CachedbDatabaseClients, dialect: str, database_code: str, schema: str, vocab_schema: str):
    connection = None

    if dialect == DatabaseDialects.POSTGRES:
        connection = PGConnection(
            clients[dialect][database_code])

    if dialect == DatabaseDialects.HANA:
        connection = HANAConnection(
            clients[dialect][database_code])

    if dialect == DatabaseDialects.DUCKDB:
        # In order for FTS to work, vocab schema cannot be using ATTACH
        # TODO: Revert back to using _get_duckdb_connection after issue has been fixed
        # https://github.com/duckdb/duckdb/issues/13523
        connection = _temp_workaround_get_duckdb_connection(
            database_code, schema, vocab_schema)

        '''
        connection = _get_duckdb_connection(
            database_code, schema, vocab_schema)
        '''

    if connection:
        return connection
    else:
        # If no connection can be found
        raise Exception(
            f"Database connection not found for connection with dialect:{dialect}, database_code:{database_code}, schema:{schema}, ")


def _temp_workaround_get_duckdb_connection(database_code: str, schema: str, vocab_schema: str) -> DuckDBConnection:
    '''
    Temp workaround function to get duckdb connection due to issue with duckdb FTS.
    Refer to ticket issue below.
    https://github.com/duckdb/duckdb/issues/13523
    '''

    vocab_schema_duckdb_file_path = os.path.join(
        Env.DUCKDB__DATA_FOLDER, f"{database_code}_{vocab_schema}")

    db = duckdb.connect(vocab_schema_duckdb_file_path, read_only=True)
    # Attach cdm schema
    try:
        cdm_schema_duckdb_file_path = os.path.join(
            Env.DUCKDB__DATA_FOLDER, f"{database_code}_{schema}")
        db.execute(
            f"ATTACH '{cdm_schema_duckdb_file_path}' AS {schema} (READ_ONLY);")
    except Exception as err:
        if type(err) == duckdb.duckdb.BinderException and str(err).startswith("Binder Error: Unique file handle conflict: Database"):
            logger.warn(
                f"Ignoring error due to unique file handle conflict for {vocab_schema_duckdb_file_path} and {cdm_schema_duckdb_file_path} ")
        else:
            raise err

    return DuckDBConnection(db)


def _get_duckdb_connection(database_code: str, schema: str, vocab_schema: str) -> DuckDBConnection:
    db = duckdb.connect()

    # Attach cdm schema
    cdm_schema_duckdb_file_path = os.path.join(
        Env.DUCKDB__DATA_FOLDER, f"{database_code}_{schema}")
    db.execute(
        f"ATTACH '{cdm_schema_duckdb_file_path}' AS {schema} (READ_ONLY);")

    # Attach vocab schema
    vocab_schema_duckdb_file_path = os.path.join(
        Env.DUCKDB__DATA_FOLDER, f"{database_code}_{vocab_schema}")
    db.execute(
        f"ATTACH '{vocab_schema_duckdb_file_path}' AS {vocab_schema} (READ_ONLY);")

    return DuckDBConnection(db)


def parse_connection_param_database(database: str) -> tuple[str, str]:
    '''
    Resolves client connection database d2e format into its individual component.
    Expects database in the format of {DIALECT}_{DATASETID}
    '''
    databaseComponents = database.split("_")
    # Simple conditional check to check if database param has two compoenents separated by "_"
    if len(databaseComponents) != 2:
        raise Exception(
            f"Database param:{database} is in the wrong format! Database has to be in the format of [DIALECT_DATASETID]")
    dialect, _dataset_id = databaseComponents

    # Guard clause against invalid dialects
    if dialect not in [e.value for e in DatabaseDialects]:
        raise Exception(
            f"Dialect:{dialect} not support! Supported dialects are: {', '.join([e.value for e in DatabaseDialects])}")

    return databaseComponents


def get_rewriter_from_dialect(dialect: str) -> Optional[rewrite.Rewriter]:
    class DefaultRewriterForPostgres(rewrite.Rewriter):
        def rewrite(self, sql: str) -> str:
            if sql.lower() == "select pg_catalog.version()":
                return "SELECT 'PostgreSQL 9.3' as version"
            else:
                return super().rewrite(sql)

    if dialect == DatabaseDialects.DUCKDB:
        return DefaultRewriterForPostgres(
            bv_dialects.BVPostgres(), bv_dialects.BVDuckDB()
        )

    if dialect == DatabaseDialects.POSTGRES:
        return DefaultRewriterForPostgres(
            bv_dialects.BVPostgres(), bv_dialects.BVPostgres()
        )

    return None


def initialize_db_clients() -> CachedbDatabaseClients:
    cachedb_database_clients = {
        "hana": {},
        "postgresql": {}
    }

    # Dynamically fill up cachedb_database_clients with connection based on each entry in database_credentials
    database_codes_and_dialects = get_database_code_and_dialect_from_db_creds()

    for database_code, dialect in database_codes_and_dialects:
        if dialect == DatabaseDialects.HANA or dialect == DatabaseDialects.POSTGRES:
            cachedb_database_clients[dialect] = {
                database_code: GetDBConnection(database_code)}

    return cachedb_database_clients
