import os
import json
import datetime
from uuid import UUID
from sqlalchemy import create_engine, text
from utils.types import (DBCredentialsType, DatabaseDialects,
                         PG_TENANT_USERS, HANA_TENANT_USERS)


def GetDBConnection(database_code: str, user_type: str):
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
                f"?encrypt={encrypt}?sslValidateCertificate={validateCertificate}"
        elif conn_details['dialect'] == DatabaseDialects.POSTGRES:
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
            case _:
                raise ValueError(
                    f"User type {user_type} supplied for database code {database_code} not found")

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


def _CreateConnectionString(dialect_driver: str, user: str, pw: str,
                            host: str, port: int, db: str) -> str:
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
        return db_credentials["dialect"]


def extract_db_credentials(database_code: str):
    dbs = json.loads(os.environ["DATABASE_CREDENTIALS"])

    if dbs == []:
        raise ValueError(
            f"Database credentials environment variable is empty")
    else:
        _db = next(filter(lambda x: x["values"]
                          ["code"] == database_code and "alp-dataflow-gen" in x["tags"], dbs), None)
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

        match self.values["dialect"]:
            case DatabaseDialects.HANA:
                values["readRole"] = os.environ["HANA__READ_ROLE"]
            case DatabaseDialects.POSTGRES:
                values["readRole"] = os.environ["PG__READ_ROLE"]
            case _:
                dialect_err = f"Dialect {self.values['dialect']} not supported. Unable to find corresponding dialect read role."
                raise ValueError(dialect_err)

        # validate
        DBCredentialsType(**values)

        return values
