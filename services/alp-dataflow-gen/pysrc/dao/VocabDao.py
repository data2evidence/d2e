from typing import List

from sqlalchemy.engine import Connection
from sqlalchemy.engine.cursor import CursorResult
from sqlalchemy import MetaData, Table, select, func, text

from utils.types import UserType
from utils.DBUtils import DBUtils


class VocabDao:
    def __init__(self, database_code, schema_name):
        dbutils = DBUtils(database_code)
        self.engine = dbutils.create_database_engine(UserType.READ_USER)
        self.schema_name = schema_name
        self.metadata = MetaData(schema=schema_name)

    def get_stream_connection(self, yield_per: int) -> Connection:
        return self.engine.connect().execution_options(yield_per=yield_per)

    def get_stream_result_set(self, connection, table_name: str) -> CursorResult:
        table = Table(table_name, self.metadata, autoload_with=connection)
        stmt = select(table)
        stream_result_set = connection.execute(stmt)
        return stream_result_set

    def get_stream_result_set_concept_synonym(self, connection, table_name: str) -> CursorResult:
        stmt = text('''select c.concept_name as concept_name, STRING_AGG (cs.concept_synonym_name , ',') as synonym_name from cdmvocab.concept_synonym cs join cdmvocab.concept c on cs.concept_id = c.concept_id group by concept_name''')
        stream_result_set = connection.execute(stmt).all()
        return stream_result_set

    # Get total number of rows for table
    def get_table_length(self, table_name: str) -> int:
        with self.engine.connect() as connection:
            table = Table(table_name, self.metadata,
                          autoload_with=connection)
            stmt = select(func.count()).select_from(table)
            table_count = connection.execute(stmt).scalar()
            return table_count

    # Get table column names
    def get_column_names(self, table_name: str) -> List[str]:
        with self.engine.connect() as connection:
            table = Table(table_name, self.metadata,
                          autoload_with=connection)
            return list(table.columns.keys())
