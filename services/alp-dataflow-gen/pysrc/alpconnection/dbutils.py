import os
import json
from sqlalchemy import create_engine, text
import datetime
from uuid import UUID
from utils.types import DBCredentials, HANA_TENANT_USERS, PG_TENANT_USERS

# TODO: Remove after envConverter returns postgres
# catches possible pg dialect values from envConverter
POSTGRES_DIALECT_OPTIONS = ['postgres', 'postgresql', 'pg']


def GetDBConnection(database_code: str, user_type: str):
    conn_details = extract_db_credentials(database_code)

    if conn_details == {}:
        raise Exception("No DB Credentials found!")
    database_name = conn_details["databaseName"]
    if conn_details["dialect"] == "hana":
        dialect_driver = "hana+hdbcli"
        encrypt = conn_details["encrypt"]
        validateCertificate = conn_details["validateCertificate"]
        db = database_name + \
            f"?encrypt={encrypt}?validateCertificate={validateCertificate}"
    elif conn_details['dialect'] in POSTGRES_DIALECT_OPTIONS:
        dialect_driver = "postgresql+psycopg2"
        db = database_name

    match user_type:
        case HANA_TENANT_USERS.READ_USER:
            databaseUser = conn_details["readUser"]
            databasePassword = conn_details["readPassword"]
        case HANA_TENANT_USERS.ADMIN_USER:
            databaseUser = conn_details["adminUser"]
            databasePassword = conn_details["adminPassword"]
        case PG_TENANT_USERS.ADMIN_USER:
            databaseUser = conn_details["adminUser"]
            databasePassword = conn_details["adminPassword"]
        case PG_TENANT_USERS.READ_USER:
            databaseUser = conn_details["readUser"]
            databasePassword = conn_details["readPassword"]

    host = conn_details["host"]
    port = conn_details["port"]
    conn_string = _CreateConnectionString(
        dialect_driver, databaseUser, databasePassword, host, port, db)
    engine = create_engine(conn_string)
    return engine


def GetConfigDBConnection():  # Single pre-configured postgres database
    dialect_driver = "postgresql+psycopg2"
    db = os.getenv("PG__DB_NAME")
    user = os.getenv("PG__WRITE_USER")
    pw = os.getenv("PG__WRITE_PASSWORD")
    host = os.getenv("PG__HOST")
    port = os.getenv("PG__PORT")
    conn_string = _CreateConnectionString(
        dialect_driver, user, pw, host, port, db)
    engine = create_engine(conn_string)
    return engine


def _CreateConnectionString(dialect_driver: str, user: str, pw: str, host: str, port: int, db: str) -> str:
    conn_string = f"{dialect_driver}://{user}:{pw}@{host}:{port}/{db}"
    return conn_string


def FetchOneRow(dbconn, sqlquery: str):
    with dbconn.connect():
        res = dbconn.execute(text(sqlquery)).fetchone()
        return to_json(res)


def FetchAllRows(dbconn, sqlquery: str):
    with dbconn.connect():
        res = dbconn.execute(text(sqlquery)).fetchall()
        return to_json(res)


def ExecuteSql(dbconn, sqlquery: str):
    with dbconn.connect():
        res = dbconn.execute(text(sqlquery))


def to_json(result):
    def extended_encoder(obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        if isinstance(obj, bool):
            return str(obj)
        if isinstance(obj, UUID):
            return obj.hex
        if isinstance(obj, dict):
            return [{key: extended_encoder(value) for key, value in obj.items()}]
        return obj
    res = [{key: extended_encoder(value)
            for key, value in row.items()} for row in result]
    return (res)


def get_db_svc_endpoint_dialect(database_code: str) -> str:
    db_credentials = extract_db_credentials(database_code)
    if db_credentials:
        return db_svc_dialect_mapper(db_credentials["dialect"])
    else:
        raise Exception(
            f"No database credentials found for database code:{database_code}")

# TODO: Remove after envConverter returns postgres
# Maps dialect configured in database_credentials to db-svc endpoint dialect route parameter


def db_svc_dialect_mapper(dialect: str) -> str:
    if dialect == 'hana':
        return dialect
    elif dialect in POSTGRES_DIALECT_OPTIONS:
        return 'postgres'
    else:
        raise Exception(
            f"Dialect:{dialect} could not be mapped to db_svc endpoint dialect")


def extract_db_credentials(database_code: str):
    dbs = json.loads(os.environ["DATABASE_CREDENTIALS"])
    for _db in dbs:
        database_credential = DatabaseCredentials(_db)
        if "alp-dataflow-gen" in database_credential.tags:
            if database_credential.get_database_code() == database_code:
                return database_credential.get_values()


class DatabaseCredentials:
    def __init__(self, db):
        self.type = db["type"]
        self.tags = db["tags"]
        self.values = db["values"]

    def get_database_code(self) -> str:
        return self.values["code"]

    def get_encrypt(self) -> bool:
        if "encrypt" in self.values.keys():
            return self.values["encrypt"]
        else:
            return False

    def get_validate_certificate(self) -> bool:
        if "validateCertificate" in self.values.keys():
            return self.values["validateCertificate"]
        else:
            return False

    def get_values(self) -> DBCredentials:
        values = self.values["credentials"]
        values["databaseName"] = self.values["databaseName"]
        values["dialect"] = self.values["dialect"]
        values["host"] = self.values["host"]
        values["port"] = self.values["port"]
        values["encrypt"] = self.get_encrypt()
        values["validateCertificate"] = self.get_validate_certificate()
        return values
