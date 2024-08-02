from subprocess import Popen, PIPE, STDOUT, run, CalledProcessError
from re import sub, compile
from typing import List
import os
from flows.alp_db_svc.types import LiquibaseAction
from flows.alp_db_svc.const import (OMOP_DATA_MODELS, CHANGESET_AVAILABLE_REGEX,
                                    LB_ERROR_MESSAGE_REGEX, PASSWORD_REGEX,
                                    SSL_TRUST_STORE_REGEX)

from utils.types import DBCredentialsType, DatabaseDialects


class Liquibase:
    def __init__(self,
                 action: str,
                 dialect: str,
                 data_model: str,
                 changelog_file: str,
                 schema_name: str,
                 vocab_schema: str,
                 tenant_configs: DBCredentialsType,
                 plugin_classpath: str,
                 count: int = 0,
                 rollback_count: int = 0,
                 rollback_tag: str = ""
                 ):
        self.changelog_file = changelog_file
        self.dialect = dialect
        self.action = action
        self.vocab_schema = vocab_schema
        self.count = count
        self.schema_name = schema_name
        self.data_model = data_model
        self.tenant_configs = tenant_configs
        self.plugin_classpath = plugin_classpath
        self.rollback_count = rollback_count
        self.rollback_tag = rollback_tag

    def create_params(self) -> List:
        changeLogFile = f"db/migrations/{self.dialect}/{self.changelog_file}"

        host = self.tenant_configs.get("host")
        port = self.tenant_configs.get("port")
        database_name = self.tenant_configs.get("databaseName")
        ssl_trust_store = self.tenant_configs.get("sslTrustStore")
        host_name_in_cert = self.tenant_configs.get("hostnameInCertificate")
        admin_user = self.tenant_configs.get("adminUser")
        admin_password = self.tenant_configs.get("adminPassword")

        liquibase_path = os.environ.get(
            "LIQUIBASE_PATH", "/app/liquibase/liquibase")
        hana_driver_class_path = os.environ.get(
            "HANA__DRIVER_CLASS_PATH", "/app/inst/drivers/ngdbc-latest.jar")
        postgres_driver_class_path = os.environ.get(
            "POSTGRES__DRIVER_CLASS_PATH", "/app/inst/drivers/postgresql-42.3.1.jar")

        match self.dialect:
            case DatabaseDialects.HANA:
                classpath = f"{hana_driver_class_path}:{self.plugin_classpath}"
                driver = "com.sap.db.jdbc.Driver"
                connection_base_url = f'jdbc:sap://{host}:{port}?'
                connection_properties = f'databaseName={database_name}&validateCertificate=false&encrypt=true&sslTrustStore={ssl_trust_store}&hostNameInCertificate={host_name_in_cert}&currentSchema={self.schema_name.upper()}'
            case DatabaseDialects.POSTGRES:
                classpath = f"{postgres_driver_class_path}:{self.plugin_classpath}"
                driver = "org.postgresql.Driver"
                connection_base_url = f'jdbc:postgresql://{host}:{port}/{database_name}?'
                connection_properties = f'user={admin_user}&password={admin_password}&currentSchema="{self.schema_name.lower()}"'

        params = [
            liquibase_path,
            self.action,
            f"--changeLogFile={changeLogFile}",
            f"--url={connection_base_url}{connection_properties}",
            f"--classpath={classpath}",
            f"--username={admin_user}",
            f"--password={admin_password}",
            f"--driver={driver}",
            f"--logLevel={os.environ.get('LB__LOG_LEVEL', 'INFO')}",
            f"--defaultSchemaName={self.schema_name}",
            f"--liquibaseSchemaName={self.schema_name}"
        ]

        match self.action:
            case LiquibaseAction.STATUS:
                params.append("--verbose")
            case LiquibaseAction.UPDATECOUNT:
                params.append(f"--count={self.count}")
            case LiquibaseAction.ROLLBACK_COUNT:
                params.append(f"--count={self.rollback_count}")
            case LiquibaseAction.ROLLBACK_TAG:
                params.append(f"--tag={self.rollback_tag}")

        if self.data_model in OMOP_DATA_MODELS:
            params.append(f"-DVOCAB_SCHEMA={self.vocab_schema}")
        return params

    def update_schema(self):
        try:
            params = self.create_params()
            result = run(params, check=True, stderr=STDOUT,
                         stdout=PIPE, text=True)
            print(self._mask_secrets(result.stdout, "***"))  # print logs
        except CalledProcessError as cpe:  # catches non-0 return code exception
            # print(f"Command ran: '{cpe.cmd}'")  # for debugging
            print(self._mask_secrets(cpe.output, "***"))  # print logs
            liquibase_msg_list = cpe.output.split("\n")
            liquibase_error_message = self._mask_secrets(self._find_error_message(
                liquibase_msg_list), "***")
            raise RuntimeError(
                f"Liquibase failed to run with return code '{cpe.returncode}': {liquibase_error_message}")  # from cpe
        else:
            print(f"Successfully ran liquibase command '{params[1]}'")

    def get_latest_available_version(self) -> str:
        try:
            params = self.create_params()
            result = run(params, check=True, stderr=STDOUT,
                         stdout=PIPE, text=True)
            liquibase_msg_masked = self._mask_secrets(result.stdout, "***")
            print(liquibase_msg_masked)
        except CalledProcessError as cpe:
            print(self._mask_secrets(cpe.output, "***"))  # print logs
            liquibase_msg_list = cpe.output.split("\n")
            liquibase_error_message = self._mask_secrets(self._find_error_message(
                liquibase_msg_list), "***")
            raise RuntimeError(
                f"Liquibase failed to run with return code '{cpe.returncode}': {liquibase_error_message}")
        else:
            print(f"Successfully ran liquibase command '{params[1]}'")
            liquibase_msg_list = liquibase_msg_masked.split("\n")
            latest_available_version_msg = self._find_latest_available_changeset(
                liquibase_msg_list)
            print(
                f"latest_available_version_msg is {latest_available_version_msg}")
            return latest_available_version_msg

    def _find_latest_available_changeset(self, liquibase_stdout: List) -> str:
        for output in reversed(liquibase_stdout):
            if CHANGESET_AVAILABLE_REGEX.search(output):
                return output

    def _find_error_message(self, liquibase_stdout: List) -> str:
        for output in liquibase_stdout:
            if LB_ERROR_MESSAGE_REGEX.search(output):
                return output

    def _mask_secrets(self, text, replacement):

        text = sub(PASSWORD_REGEX, replacement, text)  # mask password
        text = sub(SSL_TRUST_STORE_REGEX, replacement,
                   text)  # mask sslTrustStore
        return text
