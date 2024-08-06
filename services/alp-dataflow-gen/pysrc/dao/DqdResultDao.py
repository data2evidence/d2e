from sqlalchemy import MetaData, insert, Table
from utils.DBUtils import GetConfigDBConnection


class DqdResultDao:
    def __init__(self):
        self.engine = GetConfigDBConnection()
        self.schemaName = "dataflow"
        self.tableName = "dqd_result"
        self.metadata = MetaData(schema=self.schemaName)

    def insert(self, flow_run_id: str, result: dict, error: bool, error_message: str):
        with self.engine.connect() as connection:
            table = Table(self.tableName, self.metadata,
                          autoload_with=connection, schema=self.schemaName)
            insert_stmt = insert(table).values(flow_run_id=flow_run_id,
                                               result=result, error=error, error_message=error_message)
            connection.execute(insert_stmt)
            connection.commit()
