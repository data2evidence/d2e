from alpconnection.dbutils import GetDBConnection, get_db_svc_endpoint_dialect
from sqlalchemy import *
from sqlalchemy.schema import CreateSchema, DropSchema
from sqlalchemy.sql.selectable import Select
import pandas as pd
from typing import List
from datetime import datetime
from utils.types import DatabaseDialects


class DBDao:
    def __init__(self, database_code, schema_name, user_type):
        self.database_code = database_code
        self.engine = GetDBConnection(database_code, user_type)
        self.schema_name = schema_name
        self.metadata = MetaData(schema=schema_name)
        self.inspector = inspect(self.engine)

    def check_schema_exists(self) -> bool:
        db_dialect = get_db_svc_endpoint_dialect(self.database_code)
        match db_dialect:
            case DatabaseDialects.POSTGRES:
                sql_query = text(
                    "select * from information_schema.schemata where schema_name = :x;")
            case DatabaseDialects.HANA:
                sql_query = text(
                    "select * from SYS.SCHEMAS where SCHEMA_NAME = :x;")
        with self.engine.connect() as connection:
            res = connection.execute(
                sql_query, {"x": self.schema_name}).fetchone()
            if res is None:
                return False
            else:
                return True

    def check_empty_schema(self) -> bool:
        sql_query = text(
            "select * from information_schema.tables where table_schema = :x;")
        with self.engine.connect() as connection:
            res = connection.execute(
                sql_query, {"x": self.schema_name}).fetchone()
            if res is None:
                return True
            else:
                return False

    def create_schema(self):
        with self.engine.connect() as connection:
            connection.execute(CreateSchema(self.schema_name))
            connection.commit()

    def drop_schema(self):
        with self.engine.connect() as connection:
            connection.execute(DropSchema(self.schema_name, cascade=True))
            connection.commit()

    def create_i2b2_metadata_table(self):
        with self.engine.connect() as connection:
            new_table = Table("dataset_metadata",
                              self.metadata,
                              Column('schema_name', String),
                              Column('created_date', TIMESTAMP,
                                     default=datetime.utcnow()),
                              Column('updated_date', TIMESTAMP,
                                     default=datetime.utcnow()),
                              Column('data_ingestion_date', TIMESTAMP),
                              Column('tag', String),
                              Column('release_version', String)
                              )
            self.metadata.create_all(self.engine)
            connection.commit()

    def get_distinct_count(self, table_name: str, column_name: str) -> int:
        with self.engine.connect() as connection:
            table = Table(table_name, self.metadata,
                          autoload_with=connection)
            distinct_count = connection.execute(func.count(
                func.distinct(getattr(table.c, column_name)))).scalar()
        return distinct_count

    def get_value(self, table_name: str, column_name: str) -> str:
        with self.engine.connect() as connection:
            table = Table(table_name, self.metadata,
                          autoload_with=connection)
            stmt = select(table.c[column_name]).select_from(table)
            value = connection.execute(stmt).scalar()
            return value

    def update_cdm_version(self, cdm_version: str):
        with self.engine.connect() as connection:
            table = Table("cdm_source".casefold(), self.metadata,
                          autoload_with=connection)
            cdm_source_col = getattr(table.c, "cdm_source_name".casefold())
            update_stmt = update(table).where(
                cdm_source_col == self.schema_name).values(cdm_version=cdm_version)
            print(
                f"Updating cdm version {cdm_version} for schema {self.schema_name}")
            res = connection.execute(update_stmt)
            connection.commit()
            print(f"Updated cdm version {cdm_version} for {self.schema_name}")

    def update_data_ingestion_date(self):
        with self.engine.connect() as connection:
            table = Table("dataset_metadata".casefold(), self.metadata,
                          autoload_with=connection)
            condition_col = getattr(table.c, "schema_name".casefold())
            update_stmt = update(table).where(
                condition_col == self.schema_name).values(data_ingestion_date=datetime.now())
            print(
                f"Updating data ingestion date for schema {self.schema_name}")
            res = connection.execute(update_stmt)
            connection.commit()
            print(f"Updated data ingestion date for {self.schema_name}")

    def get_last_executed_changeset(self) -> str:
        with self.engine.connect() as connection:
            table = Table("databasechangelog".casefold(), self.metadata,
                          autoload_with=connection)
            filename_col = getattr(table.c, "filename".casefold())
            dateexecuted_col = getattr(table.c, "dateexecuted".casefold())
            select_stmt = select(filename_col).order_by(
                desc(dateexecuted_col)).limit(1)
            latest_changeset = connection.execute(select_stmt).scalar()
            return latest_changeset

    def get_datamodel_created_date(self) -> str:
        with self.engine.connect() as connection:
            table = Table("databasechangelog".casefold(), self.metadata,
                          autoload_with=connection)
            dateexecuted_col = getattr(table.c, "dateexecuted".casefold())
            select_stmt = select(dateexecuted_col).order_by(
                asc(dateexecuted_col)).limit(1)
            created_date = connection.execute(select_stmt).scalar()
            return created_date

    def get_datamodel_updated_date(self) -> str:
        with self.engine.connect() as connection:
            table = Table("databasechangelog".casefold(), self.metadata,
                          autoload_with=connection)
            dateexecuted_col = getattr(table.c, "dateexecuted".casefold())
            select_stmt = select(dateexecuted_col).order_by(
                desc(dateexecuted_col)).limit(1)
            updated_date = connection.execute(select_stmt).scalar()
            return updated_date

    def get_table_names(self):
        table_names = self.inspector.get_table_names(schema=self.schema_name)
        return table_names

    def __get_datamart_select_statement(self, datamart_table_config, columns_to_be_copied: List[str], date_filter: str = "", patients_to_be_copied: List[str] = []) -> Select:
        table_name = datamart_table_config['tableName'].casefold()
        timestamp_column = datamart_table_config['timestamp_column'].casefold()
        personId_column = datamart_table_config['personId_column'].casefold()

        with self.engine.connect() as connection:
            source_table = Table(table_name, self.metadata,
                                 autoload_with=connection)

            if columns_to_be_copied == ["*"]:
                columns_to_be_copied = [
                    column.key for column in source_table.c]

            columns_to_be_copied = list(
                filter(self._system_columns, columns_to_be_copied))

            select_stmt = select(
                *map(lambda x: getattr(source_table.c, x), columns_to_be_copied))

            # Filter by patients if patients_to_be_copied is provided
            if len(patients_to_be_copied) > 0 and personId_column:
                select_stmt = select_stmt.where(
                    source_table.c[personId_column.casefold()].in_(patients_to_be_copied))

            # Filter by timestamp if date_filter is provided
            if date_filter and timestamp_column:
                select_stmt = select_stmt.where(
                    date_filter >= source_table.c[timestamp_column.casefold()])

        return select_stmt

    def datamart_copy_table(self, datamart_table_config, target_schema: str, columns_to_be_copied: List[str], date_filter: str = "", patients_to_be_copied: List[str] = []) -> int:
        table_name = datamart_table_config['tableName'].casefold()

        with self.engine.connect() as connection:
            target_table = Table(table_name, MetaData(
                schema=target_schema), autoload_with=connection)

            source_table = Table(table_name, self.metadata,
                                 autoload_with=connection)
            if columns_to_be_copied == ["*"]:
                columns_to_be_copied = [
                    column.key for column in source_table.c]

            columns_to_be_copied = list(
                filter(self._system_columns, columns_to_be_copied))

            select_stmt = self.__get_datamart_select_statement(
                datamart_table_config, columns_to_be_copied, date_filter, patients_to_be_copied)

            insert_stmt = insert(target_table).from_select(
                columns_to_be_copied, select_stmt)

            res = connection.execute(insert_stmt)
            connection.commit()
            return res.rowcount

    def datamart_get_copy_as_dataframe(self, datamart_table_config, columns_to_be_copied: List[str], date_filter: str = "", patients_to_be_copied: List[str] = []) -> pd.DataFrame:
        select_stmt = self.__get_datamart_select_statement(
            datamart_table_config, columns_to_be_copied, date_filter, patients_to_be_copied)
        df = pd.read_sql_query(select_stmt, self.engine)
        return df

    def enable_auditing(self):
        with self.engine.connect() as connection:
            stmt = text(
                f"ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM') set ('auditing configuration','global_auditing_state' ) = 'true' with reconfigure")
            print("Executing enable audit statement..")
            res = connection.execute(stmt)
            connection.commit()
            print(f"Altered system configuration successfully")

    def create_system_audit_policy(self):
        with self.engine.connect() as connection:
            check_audit_policy = text(
                f"SELECT * from SYS.AUDIT_POLICIES WHERE AUDIT_POLICY_NAME = 'alp_conf_changes'")
            print("Executing check system audit policy statement..")
            check_audit_policy_res = connection.execute(
                check_audit_policy).fetchall()
            if check_audit_policy_res == []:
                create_audit_policy = text(
                    f'''CREATE AUDIT POLICY "alp_conf_changes" AUDITING SUCCESSFUL SYSTEM CONFIGURATION CHANGE LEVEL INFO''')
                print("Executing create system audit policy statement..")
                create_audit_policy_res = connection.execute(
                    create_audit_policy)
                print("Executing alter system audit policy statement..")
                alter_audit_policy = text(
                    f'''ALTER AUDIT POLICY "alp_conf_changes" ENABLE''')
                alter_audit_policy.res = connection.execute(alter_audit_policy)
                connection.commit()
                print(
                    "New audit policy for system configuration created & enabled successfully")
            else:
                print("Audit policy for system configuration Exists Already")

    def create_schema_audit_policy(self):
        with self.engine.connect() as connection:
            create_audit_policy = text(f'''
                        CREATE AUDIT POLICY ALP_AUDIT_POLICY_{self.schema_name}
                        AUDITING ALL INSERT, SELECT, UPDATE, DELETE ON
                        {self.schema_name}.* LEVEL INFO
                        ''')
            print("Executing create schema audit policy statement..")
            create_audit_policy_res = connection.execute(create_audit_policy)
            alter_audit_policy = text(
                f'''ALTER AUDIT POLICY ALP_AUDIT_POLICY_{self.schema_name} ENABLE''')
            print("Executing alter schema audit policy statement..")
            alter_audit_policy_res = connection.execute(alter_audit_policy)
            connection.commit()
            print(
                f"New audit policy for {self.schema_name} created & enabled successfully")

    def _system_columns(self, column):
        return column.lower() not in ["system_valid_until", "system_valid_from"]

    # Todo: To support bulk insert, Currently only suuports single row inserts
    def insert_values_into_table(self, table_name: str, column_value_mapping: dict):
        columns = list(column_value_mapping.keys())
        with self.engine.connect() as connection:
            table = Table(table_name, self.metadata,
                          autoload_with=connection)
            insert_stmt = table.insert().values(column_value_mapping)

            print(
                f"Inserting into table {table_name} columns {columns}")
            res = connection.execute(insert_stmt)
            connection.commit()
            print(
                f"Successfully inserted into table {table_name} columns {columns}")

    def call_stored_procedure(self, sp_name: str, sp_params: str):
        with self.engine.connect() as connection:
            call_stmt = text(f'CALL "{sp_name}"({sp_params}) ')
            print(
                f"Executing stored procedure {sp_name}")
            res = connection.execute(call_stmt).fetchall()
            connection.commit()
            print(
                f"Successfully executed stored prcoedure {sp_name}")
            return res
