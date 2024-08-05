import os
from enum import Enum
import duckdb
import json
from pydantic import BaseModel
from sqlalchemy import create_engine

from .core import Connection
from .backends.duckdb import DuckDBConnection
from .backends.postgres import PGConnection


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
    POSTGRES = "postgres"
    DUCKDB = "duckdb"


def extract_db_credentials(database_code: str):
    dbs = json.loads(os.environ["DATABASE_CREDENTIALS"])

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
        print("findme, conn_details", conn_details)
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
        engine = create_engine(conn_string)

        return engine


def _CreateConnectionString(dialect_driver: str, user: str, pw: str,
                            host: str, port: int, db: str) -> str:
    conn_string = f"{dialect_driver}://{user}:{pw}@{host}:{port}/{db}"
    return conn_string


def get_db_conn_from_connection_params(dialect: str, database_code: str, schema: str) -> Connection:
    # TODO: Get vocab schema dynamically
    vocab_schema = "cdmvocab"

    # Guard clause against invalid dialects
    if dialect not in [e.value for e in DatabaseDialects]:
        raise Exception(
            f"Dialect:{dialect} not support! Supported dialects are: {', '.join([e.value for e in DatabaseDialects])}")

    if dialect == DatabaseDialects.DUCKDB:
        db = duckdb.connect()

        # Attach cdm schema
        cdm_schema_duckdb_file_path = os.path.join(
            os.environ["DUCKDB__DATA_FOLDER"], f"{database_code}_{schema}")
        db.execute(
            f"ATTACH '{cdm_schema_duckdb_file_path}' AS {schema} (READ_ONLY);")

        # Attach vocab schema
        vocab_schema_duckdb_file_path = os.path.join(
            os.environ["DUCKDB__DATA_FOLDER"], f"{database_code}_{vocab_schema}")
        db.execute(
            f"ATTACH '{vocab_schema_duckdb_file_path}' AS {vocab_schema} (READ_ONLY);")

        return DuckDBConnection(db)

    if dialect == DatabaseDialects.POSTGRES:
        db = GetDBConnection(database_code)
        return PGConnection(db)

    if dialect == DatabaseDialects.HANA:
        raise NotImplementedError


def parse_connection_param_database(database: str) -> tuple[str, str, str]:
    '''
    Resolves client connection database d2e format into its individual component.
    Expects database in the format of {DIALECT}-{DATABASE_CODE}-{SCHEMA}
    '''
    databaseComponents = database.split("-")
    if len(databaseComponents) != 3:
        raise Exception(
            f"Database param:{database} is in the wrong format! Database has to be in the format of [DIALECT-DATABASE_CODE-SCHEMA]")
    return databaseComponents


# import duckdb
# db = duckdb.connect()
# db.execute(f"ATTACH '/home/docker/duckdb_data/alpdev_pg_cdmdefault'  (READ_ONLY);")