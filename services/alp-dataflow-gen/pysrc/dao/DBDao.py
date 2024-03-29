from alpconnection.dbutils import GetDBConnection, get_db_svc_endpoint_dialect
from sqlalchemy import text, MetaData, Table, select, func, inspect
from sqlalchemy.schema import CreateSchema


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
            distinct_count = connection.execute(func.count(func.distinct(getattr(table.c, column_name)))).scalar()
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
