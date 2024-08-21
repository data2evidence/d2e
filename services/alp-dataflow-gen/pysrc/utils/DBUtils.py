import os
import json
from typing import Dict
from utils.types import *
from api.OpenIdAPI import OpenIdAPI
from sqlalchemy import create_engine


class DBUtils:
    path_to_driver = "/app/inst/drivers"

    def __init__(self, database_code: str):
        if os.getenv("DATABASE_CREDENTIALS") is None:
            raise ValueError(
                "'DATABASE_CREDENTIALS' environment variable is undefined!")
        self.database_code = database_code

    def set_db_driver_env(self) -> str:
        database_connector_jar_folder = DBUtils.path_to_driver
        set_jar_file_path = f"Sys.setenv(\'DATABASECONNECTOR_JAR_FOLDER\' = '{database_connector_jar_folder}')"
        return set_jar_file_path

    def get_database_dialect(self) -> str:
        database_credentials = self.extract_database_credentials()
        if database_credentials:
            return database_credentials.get("dialect")

    def create_database_engine(self, schema_name: str, vocab_schema_name: str = None):
        '''
        Used for SQLAlchemy 
        '''
        connection_string = self.__create_connection_string(
            schema_name, vocab_schema_name, create_engine=True)
        print(f"schema name is {schema_name}")
        print(f"vocab schema is {vocab_schema_name}")
        print(f"connection_string in create_database_engine is {connection_string}")
        engine = create_engine(connection_string)
        return engine

    def get_database_connector_connection_string(self, schema_name: str, vocab_schema_name: str = None, release_date: str = None) -> str:
        '''
        Used for Database Connector package
        '''
        dialect = self.get_database_dialect()
        match dialect:
            case DatabaseDialects.HANA:
                # Append sessionVariable to database connection string if release_date is defined
                if release_date:
                    extra_config = f"&sessionVariable:TEMPORAL_SYSTEM_TIME_AS_OF={release_date}"
                connection_string = self.__create_connection_string(schema_name=schema_name, vocab_schema_name=vocab_schema_name, 
                                                                    extra_config=extra_config, create_engine=False)
            case DatabaseDialects.POSTGRES:
                # DatabaseConnector R package uses this postgres dialect naming
                connection_string = self.__create_connection_string(schema_name=schema_name, 
                                                                    vocab_schema_name=vocab_schema_name, 
                                                                    create_engine=False)

        return connection_string

    # To filter env database_credentials by database code

    def extract_database_credentials(self) -> Dict:
        env_database_credentials = json.loads(
            os.getenv("DATABASE_CREDENTIALS"))
        if env_database_credentials == []:
            raise ValueError(
                f"'DATABASE_CREDENTIALS' environment variable is empty!")
        else:
            _db = next(filter(lambda x: x["values"]
                              ["code"] == self.database_code and "alp-dataflow-gen" in x["tags"], env_database_credentials), None)
            if not _db:
                raise ValueError(
                    f"Database code '{self.database_code}' not found in database credentials")
            else:
                database_credentials = self.__process_database_credentials(_db)
                return database_credentials

    def __process_database_credentials(self, database_credential_json: Dict) -> DBCredentialsType:
        base_values = database_credential_json.get("values")
        database_credential_values = base_values["credentials"]
        
        database_credential_values["dialect"] = base_values["dialect"] # Todo: get from cachedb db-credentials svc?
        database_credential_values["adminUser"] = "Bearer " + OpenIdAPI().getClientCredentialToken()
        database_credential_values["adminPassword"] = ""
        database_credential_values["host"] = str(os.getenv("CACHEDB__HOST"))
        database_credential_values["port"] = int(os.getenv("CACHEDB__PORT"))
        database_credential_values["databaseName"] = f"B|{base_values['dialect']}|{base_values['databaseName']}"
        
        database_credential_values["encrypt"] = base_values.get("encrypt", False)
        database_credential_values["validateCertificate"] = base_values.get(
            "validateCertificate", False)
        database_credential_values["sslTrustStore"] = base_values.get(
            "sslTrustStore", "")
        database_credential_values["hostnameInCertificate"] = base_values.get(
            "hostnameInCertificate", "")
        database_credential_values["enableAuditPolicies"] = base_values.get(
            "enableAuditPolicies", False)

        match database_credential_values.get("dialect"):
            case DatabaseDialects.HANA:
                database_credential_values["readRole"] = os.environ["HANA__READ_ROLE"]
            case DatabaseDialects.POSTGRES:
                database_credential_values["readRole"] = os.environ["PG__READ_ROLE"]
            case _:
                dialect_err = f"Dialect {self.values['dialect']} not supported. Unable to find corresponding dialect read role."
                raise ValueError(dialect_err)

        # validate schema
        DBCredentialsType(**database_credential_values)
        return database_credential_values

    def __create_connection_string(self, schema_name: str, vocab_schema_name: str, extra_config: str = "", create_engine: bool = False) -> str:
        '''
        Creates database connection string to be used for SqlAlchemy Engine and Database Connector
        '''
        database_credentials = self.extract_database_credentials()
        dialect = database_credentials.get("dialect") 
        user = database_credentials.get("adminUser")
        host = database_credentials.get("host")
        port = database_credentials.get("port")
        database_name = database_credentials.get("databaseName") + f"|{schema_name}"        
        if vocab_schema_name:
            database_name += f"|{vocab_schema_name}"
        
        if create_engine:  # for sqlalchemy
            dialect_driver = "postgresql+psycopg2"
            connection_string = f"{dialect_driver}://{user}@{host}:{port}/{database_name}"
            print(f"create engine connection_string is {connection_string}")
            return connection_string

        base_connection_string = f"jdbc:{dialect}://{host}:{port}/{database_name}"
        connection_string = f"connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = '{dialect}', connectionString = '{base_connection_string}', user = '{user}', password = '', pathToDriver = '{DBUtils.path_to_driver}')"
        return connection_string


def create_base_connection_string(dialect_driver: str, user: str, password: str,
                                  host: str, port: int, database_name: str) -> str:
    return f"{dialect_driver}://{user}:{password}@{host}:{port}/{database_name}"


def GetConfigDBConnection():
    # Connect directly to db?
    # Single pre-configured postgres database
    dialect_driver = "postgresql+psycopg2"
    db = os.getenv("PG__DB_NAME")
    user = os.getenv("PG__WRITE_USER")
    pw = os.getenv("PG__WRITE_PASSWORD")
    host = os.getenv("PG__HOST")
    port = os.getenv("PG__PORT")
    conn_string = create_base_connection_string(
        dialect_driver, user, pw, host, port, db)
    engine = create_engine(conn_string)
    return engine