from alpconnection.dbutils import GetDBConnection, get_db_svc_endpoint_dialect
from sqlalchemy import text, MetaData, Table, select, func, inspect, insert
from sqlalchemy.schema import CreateSchema
from typing import List


class DBDao:
    def __init__(self, database_code, schema_name, user_type):
        self.database_code = database_code
        self.engine = GetDBConnection(database_code, user_type)
        self.schema_name = schema_name
        self.metadata = MetaData(schema=schema_name)
        self.inspector = inspect(self.engine)

    def check_schema_exists(self):
        db_dialect = get_db_svc_endpoint_dialect(self.database_code)
        match db_dialect:
            case 'postgres':
                sql_query = text(
                    "select * from information_schema.schemata where schema_name = :x;")
            case 'hana':
                sql_query = text(
                    "select * from SYS.SCHEMAS where SCHEMA_NAME = :x;")
        with self.engine.connect() as connection:
            res = connection.execute(
                sql_query, {"x": self.schema_name}).fetchone()
            if res is None:
                return False
            else:
                return True

    def check_empty_schema(self):
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
        sql_query = text("create schema :x;")
        with self.engine.connect() as connection:
            # connection.execute(sql_query, {"x": self.schema_name})
            connection.execute(CreateSchema(self.schema_name))
            connection.commit()

    # Get distinct count of column
    def get_distinct_count(self, table_name: str, column_name: str) -> int:
        with self.engine.connect() as connection:
            table = Table(table_name, self.metadata,
                          autoload_with=connection)
            distinct_count = connection.execute(func.count(
                func.distinct(getattr(table.c, column_name)))).scalar()
        return distinct_count

    # Get cdm version
    def get_cdm_version(self, table_name: str, column_name: str) -> int:
        with self.engine.connect() as connection:
            table = Table(table_name, self.metadata,
                          autoload_with=connection)
            stmt = select(table.c[column_name]).select_from(table)
            cdm_version = connection.execute(stmt).scalar()
            return cdm_version

    def get_table_names(self):
        table_names = self.inspector.get_table_names(schema=self.schema_name)
        return table_names

    def datamart_copy_table(self, datamart_table_config, target_schema: str, columns_to_be_copied: List[str], date_filter: str = "", patients_to_be_copied: List[str] = []) -> int:
        table_name = datamart_table_config['name'].casefold()
        timestamp_column = datamart_table_config['timestamp_column'].casefold()
        personId_column = datamart_table_config['personId_column'].casefold()

        with self.engine.connect() as connection:
            source_table = Table(table_name, self.metadata,
                                 autoload_with=connection)
            target_table = Table(table_name, MetaData(
                schema=target_schema), autoload_with=connection)

            if columns_to_be_copied == ["*"]:
                columns_to_be_copied = [
                    column.key for column in source_table.c]

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

            insert_stmt = insert(target_table).from_select(
                columns_to_be_copied, select_stmt)
            res = connection.execute(insert_stmt)
            connection.commit()
            return res.rowcount
