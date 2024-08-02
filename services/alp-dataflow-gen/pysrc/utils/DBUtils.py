import os
import json
from typing import Dict
from utils.types import *
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

    def create_database_engine(self, user_type):
        '''
        Used for SQLAlchemy 
        '''
        connection_string = self.__create_connection_string(
            user_type, create_engine=True)
        engine = create_engine(connection_string)
        return engine

    def get_database_connector_connection_string(self, user_type: str, release_date: str = None) -> str:
        '''
        Used for Database Connector package
        '''
        dialect = self.get_database_dialect()
        match dialect:
            case DatabaseDialects.HANA:
                # Append sessionVariable to database connection string if release_date is defined
                if release_date:
                    extra_config = f"&sessionVariable:TEMPORAL_SYSTEM_TIME_AS_OF={release_date}"
                connection_string = self.__create_connection_string(user_type=user_type, extra_config=extra_config,
                                                                    create_engine=False)
            case DatabaseDialects.POSTGRES:
                # DatabaseConnector R package uses this postgres dialect naming
                connection_string = self.__create_connection_string(
                    user_type=user_type, create_engine=False)

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
        database_credential_values["databaseName"] = base_values["databaseName"]
        database_credential_values["dialect"] = base_values["dialect"]
        database_credential_values["host"] = base_values["host"]
        database_credential_values["port"] = base_values["port"]
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

    def __create_connection_string(self, user_type: UserType, extra_config: str = "", create_engine: bool = False) -> str:
        '''
        Creates database connection string to be used for SqlAlchemy Engine and Database Connector
        '''
        database_credentials = self.extract_database_credentials()
        dialect = database_credentials.get("dialect")
        database_name = database_credentials.get("databaseName")
        host = database_credentials.get("host")
        port = database_credentials.get("port")

        match user_type:
            case UserType.ADMIN_USER:
                user = database_credentials.get("adminUser")
                password = database_credentials.get("adminPassword")
            case UserType.READ_USER:
                user = database_credentials.get("readUser")
                password = database_credentials.get("readPassword")

        if create_engine:  # for sqlalchemy
            match dialect:
                case DatabaseDialects.HANA:
                    dialect_driver = "hana+hdbcli"
                    encrypt = database_credentials.get("encrypt")
                    validate_certificate = database_credentials.get(
                        "validateCertificate")
                    database_config_string = database_name + \
                        f"?encrypt={encrypt}?sslValidateCertificate={validate_certificate}"

                case DatabaseDialects.POSTGRES:
                    dialect_driver = "postgresql+psycopg2"
                    database_config_string = database_name
                case _:
                    raise ValueError(f"Dialect '{dialect}' not supported!")

            connection_string = create_base_connection_string(
                dialect_driver, user, password, host, port, database_config_string)
            return connection_string

        match dialect:
            case DatabaseDialects.HANA:
                base_connection_string = f"jdbc:sap://{host}:{port}?databaseName={database_name}{extra_config}"
            case DatabaseDialects.POSTGRES:
                dialect = "postgresql"
                base_connection_string = f"jdbc:{dialect}://{host}:{port}/{database_name}"
            case _:
                raise ValueError(f"Dialect '{dialect}' not supported!")
        connection_string = f"connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = '{dialect}', connectionString = '{base_connection_string}', user = '{user}', password = '{password}', pathToDriver = '{DBUtils.path_to_driver}')"
        return connection_string


def create_base_connection_string(dialect_driver: str, user: str, password: str,
                                  host: str, port: int, database_config_string: str) -> str:
    return f"{dialect_driver}://{user}:{password}@{host}:{port}/{database_config_string}"


def GetConfigDBConnection():
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