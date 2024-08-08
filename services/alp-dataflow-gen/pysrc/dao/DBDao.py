
import re
import pandas as pd
from datetime import datetime
from typing import Any, Callable

import sqlalchemy as sql
from sqlalchemy.sql.selectable import Select
from sqlalchemy.types import Text, UnicodeText
from sqlalchemy.sql.schema import Table, Column
from sqlalchemy.schema import CreateSchema, DropSchema

from utils.types import *
from utils.DBUtils import DBUtils


class DBDao:
    def __init__(self, database_code: str, schema_name: str, user_type: UserType):
        self.database_code = database_code
        self.schema_name = schema_name
        dbutils = DBUtils(self.database_code)
        self.db_dialect = dbutils.get_database_dialect()

        if (user_type == UserType.ADMIN_USER) or (user_type == UserType.READ_USER):
            self.user = user_type
        else:
            raise ValueError(f"User type '{user_type}' not allowed, only '{[user.value for user in UserType]}'.")

        self.engine = dbutils.create_database_engine(self.user)
        self.metadata = sql.MetaData(schema_name)  # sql.MetaData()
        self.inspector = sql.inspect(self.engine)


    def check_schema_exists(self) -> bool:
        return self.inspector.has_schema(self.schema_name)

    def check_empty_schema(self) -> bool:
        return self.inspector.get_tables(self.schema_name) > 0

    def check_table_exists(self, table) -> bool:
        return self.inspector.has_table(schema=self.schema_name, table_name=table)

    def get_table_names(self):
        table_names = self.inspector.get_table_names(schema=self.schema_name)
        return table_names
    
    def get_columns(self, table: str) -> list[dict]:
        column_list = self.inspector.get_columns(schema=self.schema_name, table_name=table)
        return column_list

    def get_table_row_count(self, table_name: str) -> int:
        with self.engine.connect() as connection:
            table = sql.Table(table_name, self.metadata, autoload_with=connection)
            select_count_stmt = sql.select(sql.func.count()).select_from(table)
            row_count = connection.execute(select_count_stmt).scalar()   
        return row_count

    def get_distinct_count(self, table_name: str, column_name: str) -> int:
        with self.engine.connect() as connection:
            table = sql.Table(table_name, self.metadata,
                              autoload_with=connection)
            distinct_count = connection.execute(sql.func.count(
                sql.func.distinct(getattr(table.c, column_name)))).scalar()
        return distinct_count

    def get_value(self, table_name: str, column_name: str) -> str:
        with self.engine.connect() as connection:
            table = sql.Table(table_name, self.metadata,
                              autoload_with=connection)
            stmt = sql.select(table.c[column_name]).select_from(table)
            value = connection.execute(stmt).scalar()
            return value

    def get_next_record_id(self, table_name: str, id_column_name: str) -> int:
        table = sql.Table(table_name, self.metadata,
                          autoload_with=self.engine)
        id_column = getattr(table.c, id_column_name.casefold())
        last_record_id_stmt = sql.select(sql.func.max(id_column))
        last_record_id = self.execute_sqlalchemy_statement(
            last_record_id_stmt, self.get_single_value)
        if last_record_id is None:
            return 1
        else:
            return int(last_record_id) + 1

    def update_cdm_version(self, cdm_version: str):
        with self.engine.connect() as connection:
            table = sql.Table("cdm_source".casefold(), self.metadata,
                              autoload_with=connection)
            cdm_source_col = getattr(table.c, "cdm_source_name".casefold())
            update_stmt = sql.update(table).where(
                cdm_source_col == self.schema_name).values(cdm_version=cdm_version)
            res = connection.execute(update_stmt)
            connection.commit()


    def update_data_ingestion_date(self):
        with self.engine.connect() as connection:
            table = sql.Table("dataset_metadata".casefold(), self.metadata,
                              autoload_with=connection)
            condition_col = getattr(table.c, "schema_name".casefold())
            update_stmt = sql.update(table).where(
                condition_col == self.schema_name).values(data_ingestion_date=datetime.now())
            print(
                f"Updating data ingestion date for schema {self.schema_name}")
            res = connection.execute(update_stmt)
            connection.commit()
            print(f"Updated data ingestion date for {self.schema_name}")

    def get_last_executed_changeset(self) -> str:
        with self.engine.connect() as connection:
            table = sql.Table("databasechangelog".casefold(), self.metadata,
                              autoload_with=connection)
            filename_col = getattr(table.c, "filename".casefold())
            dateexecuted_col = getattr(table.c, "dateexecuted".casefold())
            select_stmt = sql.select(filename_col).order_by(
                sql.desc(dateexecuted_col)).limit(1)
            latest_changeset = connection.execute(select_stmt).scalar()
            return latest_changeset

    def get_datamodel_created_date(self) -> str:
        with self.engine.connect() as connection:
            table = sql.Table("databasechangelog".casefold(), self.metadata,
                              autoload_with=connection)
            dateexecuted_col = getattr(table.c, "dateexecuted".casefold())
            select_stmt = sql.select(dateexecuted_col).order_by(
                sql.asc(dateexecuted_col)).limit(1)
            created_date = connection.execute(select_stmt).scalar()
            return created_date

    def get_datamodel_updated_date(self) -> str:
        with self.engine.connect() as connection:
            table = sql.Table("databasechangelog".casefold(), self.metadata,
                              autoload_with=connection)
            dateexecuted_col = getattr(table.c, "dateexecuted".casefold())
            select_stmt = sql.select(dateexecuted_col).order_by(
                sql.desc(dateexecuted_col)).limit(1)
            updated_date = connection.execute(select_stmt).scalar()
            return updated_date



    def create_schema(self):
        with self.engine.connect() as connection:
            connection.execute(CreateSchema(self.schema_name))
            connection.commit()

    def drop_schema(self, cascade: bool=True):
        with self.engine.connect() as connection:
            connection.execute(DropSchema(self.schema_name, cascade=cascade))
            connection.commit()

    def create_table(self, table_name: str, columns: dict):
        with self.engine.connect() as connection:
            new_table = sql.Table(table_name,
                                  self.metadata,
                                  *(sql.Column(name, dtype) for name, dtype in columns.items())
                                  )
            self.metadata.create_all(self.engine)
            connection.commit()

    def copy_table(self, source_table_name: str, target_table_name: str, target_schema_name: str, columns_to_copy: list[str], filter_conditions: str) -> int:
        with self.engine.connect() as connection:
            source_table = sql.Table(source_table_name, self.metadata, autoload_with=connection)

            # Copy column from source_table including data type
            target_columns = [source_table.c[col].copy() for col in columns_to_copy]
            target_metadata = sql.MetaData(schema=target_schema_name)
            target_table = sql.Table(target_table_name, target_metadata, *target_columns, schema=target_schema_name)
            
            # Create the new table in the database
            target_metadata.create_all(self.engine, tables=[target_table])
            
            # Construct select statements with filter conditions
            select_statement = self.create_select_statement(source_table_name, columns_to_copy, filter_conditions)
    
            # Insert into target table from source table
            insert_statement = sql.insert(target_table).from_select(columns_to_copy, select_statement)
            
            result = connection.execute(insert_statement)
            connection.commit()
            
            if self.db_dialect == DatabaseDialects.POSTGRES:
                row_count = result.rowcount
            elif self.db_dialect == DatabaseDialects.HANA:
                select_count_stmt = sql.select(
                    sql.func.count()).select_from(target_table)
                row_count = connection.execute(
                    select_count_stmt).scalar()   
        return row_count

    def create_table_from_select(self, source_table: str, target_schema: str, target_table: str, columns_to_copy: list[str], filter_conditions: list) -> int:
                               
        sanitized_source_table = self.__sanitize_inputs(source_table)
        sanitized_target_table = self.__sanitize_inputs(target_table)
        sanitized_target_schema = self.__sanitize_inputs(target_schema)

        with self.engine.connect() as connection:
            source_table = sql.Table(sanitized_source_table, self.metadata,
                                     autoload_with=connection)
            
            select_statement = self.create_select_statement(source_table, columns_to_copy, filter_conditions)

            compiled_sql_query = str(select_statement.compile(compile_kwargs={"literal_binds": True}))
            
            create_from_select_statement = sql.text(f'''CREATE TABLE {sanitized_target_schema}.{sanitized_target_table} AS ({compiled_sql_query});''')
            row_count = connection.execute(create_from_select_statement).rowcount

        return row_count

    def copy_table_as_dataframe(self, source_table_name: str, columns_to_copy: list[str], filter_conditions: str) -> pd.DataFrame:
        # Construct select statements with filter conditions
        select_statement = self.create_select_statement(source_table_name, columns_to_copy, filter_conditions)
        df = pd.read_sql_query(select_statement, self.engine)
        return df

    def create_select_statement(self, table_name: str, columns_to_select: list[str], filter_conditions: list) -> Select:
        select_from_conditions = sql.and_(*filter_conditions)
        with self.engine.connect() as connection:
            source_table = sql.Table(table_name, self.metadata,
                                     autoload_with=connection)
            
            match self.db_dialect:
                case DatabaseDialects.HANA:
                    # cast text columns to nclob
                    select_statement = sql.select(*map(lambda x: sql.cast(getattr(source_table.c, x), UnicodeText) if isinstance(source_table.c[x].type, Text) else getattr(source_table.c, x), columns_to_select)).where(select_from_conditions)

                case DatabaseDialects.POSTGRES:
                    select_statement = sql.select(*map(lambda x: getattr(source_table.c, self.__casefold(x)), columns_to_select)).where(select_from_conditions)
        
        return select_statement


    # DML
    # Todo: To support bulk insert, Currently only suports single row inserts
    def insert_values_into_table(self, table_name: str, column_value_mapping: list[dict]):
        with self.engine.connect() as connection:
            table = sql.Table(table_name, self.metadata,
                              autoload_with=connection)
            res = connection.execute(table.insert(), column_value_mapping)
            connection.commit()

    def delete_records(self, table_name: str, conditions: list):
        table = sql.Table(table_name, self.metadata, autoload_with=self.engine)
        delete_from_conditions = sql.and_(*conditions)
        delete_from_statement = table.delete().where(delete_from_conditions)
        result = self.execute_sqlalchemy_statement(
            delete_from_statement, self.return_affected_rowcounts
        )
        
        return result

    def call_stored_procedure(self, sp_name: str, sp_params: str):
        with self.engine.connect() as connection:
            call_stmt = sql.text(f'CALL "{sp_name}"({sp_params}) ')
            print(
                f"Executing stored procedure {sp_name}")
            res = connection.execute(call_stmt).fetchall()
            connection.commit()
            print(
                f"Successfully executed stored prcoedure {sp_name}")
            return res



    def get_sqlalchemy_columns(self, table_name: str, column_names: list[str]) -> dict[str, Column]:
        '''
        Returns a dictionary mapping column names to sqlalchemy Column objects
        '''
        with self.engine.connect() as connection:
            table = Table(table_name, self.metadata, autoload_with=connection)            
            return {column_name: getattr(table.c, column_name.casefold()) for column_name in column_names}

    def execute_sqlalchemy_statement(self, sqlalchemy_statement, callback: Callable) -> Any | None:
        with self.engine.connect() as connection:
            res = connection.execute(sqlalchemy_statement)
            connection.commit()
            return callback(res)

    def get_single_value(self, result) -> Any:  # Todo: Replace other dbdao function
        if result.rowcount == 0:
            raise Exception("No value returned")
        if result.rowcount > 1:
            raise Exception(f"Multiple values returned: {result.fetchall()}")
        else:
            return result.scalar()
    
    def return_affected_rowcounts(self, result) -> int:
        return result.rowcount



    def __sanitize_inputs(self, input: str):
        # Allow only alphanumeric characters, underscores, and periods
        if not all(char.isalnum() or char in ("_", ".") for char in input):
            raise ValueError("Invalid characters in idenitifier")
        return re.sub(r'[^a-zA-Z0-9_.]', '', input)

    def __casefold(self, obj_name: str) -> str:
        if not obj_name.startswith("GDM."):
            return obj_name.casefold()
        else:
            return obj_name



    def enable_auditing(self):
        with self.engine.connect() as connection:
            stmt = sql.text(
                f"ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM') set ('auditing configuration','global_auditing_state' ) = 'true' with reconfigure")
            print("Executing enable audit statement..")
            res = connection.execute(stmt)
            connection.commit()
            print(f"Altered system configuration successfully")

    def create_system_audit_policy(self):
        with self.engine.connect() as connection:
            check_audit_policy = sql.text(
                f"SELECT * from SYS.AUDIT_POLICIES WHERE AUDIT_POLICY_NAME = 'alp_conf_changes'")
            print("Executing check system audit policy statement..")
            check_audit_policy_res = connection.execute(
                check_audit_policy).fetchall()
            if check_audit_policy_res == []:
                create_audit_policy = sql.text(
                    f'''CREATE AUDIT POLICY "alp_conf_changes" AUDITING SUCCESSFUL SYSTEM CONFIGURATION CHANGE LEVEL INFO''')
                print("Executing create system audit policy statement..")
                create_audit_policy_res = connection.execute(
                    create_audit_policy)
                print("Executing alter system audit policy statement..")
                alter_audit_policy = sql.text(
                    f'''ALTER AUDIT POLICY "alp_conf_changes" ENABLE''')
                alter_audit_policy.res = connection.execute(alter_audit_policy)
                connection.commit()
                print(
                    "New audit policy for system configuration created & enabled successfully")
            else:
                print("Audit policy for system configuration Exists Already")

    def create_schema_audit_policy(self):
        with self.engine.connect() as connection:
            create_audit_policy = sql.text(f'''
                        CREATE AUDIT POLICY ALP_AUDIT_POLICY_{self.schema_name}
                        AUDITING ALL INSERT, SELECT, UPDATE, DELETE ON
                        {self.schema_name}.* LEVEL INFO
                        ''')
            print("Executing create schema audit policy statement..")
            create_audit_policy_res = connection.execute(create_audit_policy)
            alter_audit_policy = sql.text(
                f'''ALTER AUDIT POLICY ALP_AUDIT_POLICY_{self.schema_name} ENABLE''')
            print("Executing alter schema audit policy statement..")
            alter_audit_policy_res = connection.execute(alter_audit_policy)
            connection.commit()
            print(
                f"New audit policy for {self.schema_name} created & enabled successfully")