import dask_sql
from prefect import task, flow, get_run_logger
import dask.dataframe as dd
from dask.utils import tmpfile
from nodes.flowutils import *
import logging
import traceback as tb
import sqlalchemy
from sqlalchemy.sql import select
from sqlalchemy import MetaData, Table, create_engine
import pandas as pd
import json
import rpy2.robjects as ro
from rpy2.robjects import conversion, default_converter
import alpconnection.dbutils as dbutils
from prefect.task_runners import SequentialTaskRunner
from utils.types import PG_TENANT_USERS

class Flow:
    def __init__(self, _node):
        self.graph = _node["graph"]
        self.executor_type = _node["executor_options"]["executor_type"]
        self.executor_host = _node["executor_options"]["executor_address"]["host"]
        self.executor_port = _node["executor_options"]["executor_address"]["port"]
        self.ssl = _node["executor_options"]["executor_address"]["ssl"]
        self.sorted_nodes = get_node_list(self.graph)


class Result:
    def __init__(self, error, data, task_run_context) -> None:
        self.error = error
        self.data = data
        self.task_run_id = str(task_run_context.get("id"))
        self.task_run_name = str(task_run_context.get("name"))
        self.flow_run_id = str(task_run_context.get("flow_run_id"))


class SqlNode:
    def __init__(self, _node):
        c = dask_sql.Context()
        self.context = c
        self.tables = _node["tables"]
        self.sql = _node["sql"]

    def task(self, _input, task_run_context):
        try:
            for tablename in self.tables.keys():
                input_element = _input
                for path in self.tables[tablename]:
                    input_element = input_element[path].data
                self.context.create_table(tablename, input_element)
            ddf = self.context.sql(self.sql).compute()
            return Result(None, ddf, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

    def test(self, _input, task_run_context):
        return self.task(_input, task_run_context)


class PythonNode:
    def __init__(self, _node):
        source_code = _node["python_code"] + '\noutput = exec(myinput)'
        test_source_code = _node["python_code"]+'\noutput = test_exec(myinput)'
        self.code = compile(source_code, '<string>', 'exec')
        self.testcode = compile(test_source_code, '<string>', 'exec')

    def test(self, _input, task_run_context):
        params = {"myinput": _input, "output": {}}
        e = exec(self.testcode, params)
        return params["output"]

    def task(self, _input, task_run_context):
        params = {"myinput": _input, "output": {}}
        try:
            data = exec(self.code, params)
            return Result(None, params["output"], task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)


class RNode:
    def __init__(self, _node):
        self.r_code = ''''''+_node["r_code"]+''''''

    def test(self, _input, task_run_context):
        with conversion.localconverter(default_converter):
            r_inst = ro.r(self.r_code)
            r_test_exec = ro.globalenv['test_exec']
            global_params = {"r_test_exec": r_test_exec, "convert_R_to_py": convert_R_to_py,
                             "myinput": convert_py_to_R(_input), "output": {}}
            e = exec(
                f'output = convert_R_to_py(r_test_exec(myinput))', global_params)
        output = global_params["output"]
        return output

    def task(self, _input, task_run_context):
        try:
            with conversion.localconverter(default_converter):
                r_inst = ro.r(self.r_code)
                r_exec = ro.globalenv['exec']
                global_params = {"r_exec": r_exec, "convert_R_to_py": convert_R_to_py,
                                 "myinput": convert_py_to_R(_input), "output": {}}
                e = exec(f'output = convert_R_to_py(r_exec(myinput))',
                         global_params)
            output = global_params["output"]
            return Result(None, output, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)


class CsvNode:
    def __init__(self, _node):
        self.file = _node["file"]
        self.name = _node["name"]
        self.delimiter = _node["delimiter"]
        self.names = _node["columns"]
        self.hasheader = _node["hasheader"]
        # self.types = _node["datatypes"]

    def _load_dask_dataframe(self):
        if self.hasheader:
            # dtype=self.types
            dd_df = dd.read_csv(self.file, delimiter=self.delimiter)
            return dd_df
        else:
            dd_df = dd.read_csv(self.file, header=None, names=self.names,
                                delimiter=self.delimiter)  # dtype=self.types
            return dd_df

    def test(self, task_run_context):
        ddf = self._load_dask_dataframe()
        return ddf

    def task(self, task_run_context):
        try:
            ddf = self._load_dask_dataframe()
            return Result(None, ddf, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)


class DbWriter:
    def __init__(self, _node):
        self.tablename = _node["dbtablename"]
        self.dbconn = dbutils.GetDBConnection(_node["database"], PG_TENANT_USERS.ADMIN_USER)
        self.dataframe = _node["dataframe"]

    def test(self, _input, task_run_context):
        return False

    def task(self, _input, task_run_context):
        input_element = _input
        try:
            for path in self.dataframe:
                input_element = input_element[path].data
            result = input_element.to_sql(
                self.tablename, self.dbconn, if_exists='replace')
            return Result(None, result, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)


class DbQueryReader:
    def __init__(self, _node):
        self.sqlquery = _node["sqlquery"]
        self.dbconn = dbutils.GetDBConnection(_node["database"], PG_TENANT_USERS.READ_USER)
        self.testdata = {
            "columns": _node["columns"], "data": _node["testdata"]}

    def test(self, task_run_context):
        return Result(None, dd.from_pandas(pd.read_json(json.dumps(self.testdata), orient="split"), npartitions=1), task_run_context)

    def task(self, task_run_context):
        # return dd.read_sql_query(sqlalchemy.select(sqlalchemy.text(self.sqlquery)), self.dbconn, self.index_col, divisions=self.divisions)
        try:
            ddf = dd.from_pandas(pd.read_sql_query(
                self.sqlquery, self.dbconn), npartitions=1)
            return Result(None, ddf, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)


class SqlQueryNode:
    def __init__(self, _node):
        self.sqlquery = _node["sqlquery"]
        if "testsqlquery" in _node:
            self.testsqlquery = _node["testsqlquery"]
        else:
            self.testsqlquery = _node["sqlquery"]
        self.params = {}
        self._is_select = _node["is_select"]
        if "params" in _node:
            self.params = _node["params"]
        self.dbconn = dbutils.GetDBConnection(_node["database"], PG_TENANT_USERS.ADMIN_USER)

    def _map_input(self, _input):
        _params = {}
        for paramname in self.params.keys():
            input_element = _input
            for path in self.params[paramname]:
                input_element_a = input_element[path].data
            _params[paramname] = input_element_a
        return _params

    def _exec(self, _input, sqlquery):
        _params = self._map_input(_input)
        res = None
        with self.dbconn.connect() as connection:
            if self._is_select:
                res = self.dbconn.execute(sqlalchemy.text(sqlquery), _params)
            else:
                self.dbconn.execute(sqlalchemy.text(sqlquery), _params)
            if res:
                rows = res.fetchall()
                query_results = [dict(row) for row in rows]
                return query_results
        return None

    def test(self, _input, task_run_context):
        return self._exec(_input, self.testsqlquery, task_run_context)

    def task(self, _input, task_run_context):
        try:
            df = self._exec(_input, self.sqlquery)
            return Result(None, df, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)


# To do: link up with JSON from UI
class DataMappingNode:
    def __init__(self, _node):
        self.context = dask_sql.Context()
        self.data_mapping = _node["data_mapping"]
        self.parent_table = _node["parent_table"]
        self.table_joins = _node["table_joins"]
        self.source_node_dfs = _node["tables"]

    def _create_query(self, _input):
        with tmpfile() as f:
            db = "sqlite:///%s" % f

            engine = create_engine(db, echo=False)
            metadata = MetaData()

            sqlalchemy_source_tables_dict = {}
            table_join_params = None
            select_params = []

            for mapping in self.data_mapping:
                source_table_name = mapping["input_table"]
                source_node_df = self.source_node_dfs[source_table_name]

                try:  # insert df into sqlite db
                    source_df = _input[source_node_df].data
                    source_df.to_sql(source_table_name,
                                     db,
                                     if_exists="replace",
                                     index=False)
                except Exception as e:
                    print(
                        f"Error inserting {source_node_df} df into sqlite db: {e}")

                # Create sqlalchemy table obj by autoloading from sqlite db
                sqlalchemy_table_obj = Table(
                    source_table_name, metadata, autoload_with=engine)

                if source_table_name == self.parent_table:
                    table_join_params = sqlalchemy_table_obj

                sqlalchemy_source_tables_dict[source_table_name] = sqlalchemy_table_obj

                # chain field mappings
                field_mappings = mapping["fields"]
                for field_mapping in field_mappings:
                    source_field_name = field_mapping["source_field"]
                    target_field_name = field_mapping["target_field"]
                    sqlalchemy_field_obj = getattr(
                        sqlalchemy_table_obj.c, source_field_name).label(target_field_name)
                    select_params.append(sqlalchemy_field_obj)

            # chain join mappings
            for join in self.table_joins:
                if join["right_table_name"] != self.parent_table:  # need to determine order of join
                    table_to_join = sqlalchemy_source_tables_dict[join["right_table_name"]]
                    table_join_against = sqlalchemy_source_tables_dict[join["left_table_name"]]
                    col_to_join_on = getattr(
                        table_to_join.c, join["right_table_join_on"])
                    col_to_join_against = getattr(
                        table_join_against.c, join["left_table_join_on"])
                    table_join_params = table_join_params.join(
                        table_to_join, col_to_join_on == col_to_join_against)
            query = select(*select_params).select_from(table_join_params)
            compiled_sql_query = str(query.compile(
                compile_kwargs={"literal_binds": True}))
            return str(compiled_sql_query)

    def test(self, _input, task_run_context):
        return self.task(_input, task_run_context)

    def task(self, _input, task_run_context):  # executes the retrieved sql query
        try:
            sql_query = self._create_query(_input)
            for table_name in self.source_node_dfs.keys():
                self.context.create_table(
                    table_name, _input[self.source_node_dfs[table_name]].data)
            # temporarily log sql query because no UI
            result_df = self.context.sql(sql_query).compute()
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)
        else:
            return Result(None, result_df, task_run_context)


@flow(name="generate-nodes", flow_run_name="generate-nodes-flowrun", log_prints=True)
def generate_nodes_flow(graph, sorted_nodes):
    for nodename in sorted_nodes:
        node = graph["nodes"][nodename]
        nodetype = node["type"]

        # check if node is a subflow
        if nodetype == "subflow":
            subflow_obj = Flow(node)
            graph["nodes"][nodename]["nodeobj"] = subflow_obj
            for subflow_nodename in subflow_obj.sorted_nodes:
                subflow_nodegraph = subflow_obj.graph["nodes"][subflow_nodename]
                subflow_nodetype = subflow_nodegraph["type"]
                # create task run to generate node obj for each subflow node
                subflow_node_obj = generate_node_task(
                    subflow_nodename, subflow_nodegraph, subflow_nodetype)
                graph["nodes"][nodename]["graph"]["nodes"][subflow_nodename]["nodeobj"] = subflow_node_obj
        else:
            # directly create task run to generate node obj
            nodeobj = generate_node_task(nodename, node, nodetype)
            graph["nodes"][nodename]["nodeobj"] = nodeobj
    return graph


@task(task_run_name="generate-node-taskrun-{nodename}", log_prints=True)
def generate_node_task(nodename, node, nodetype):
    nodeobj = None
    match nodetype:
        case "csv_node":
            nodeobj = CsvNode(node)
        case "sql_node":
            nodeobj = SqlNode(node)
        case "python_node":
            nodeobj = PythonNode(node)
        case "r_node":
            nodeobj = RNode(node)
        case "db_writer_node":
            nodeobj = DbWriter(node)
        case "db_reader_node":
            nodeobj = DbQueryReader(node)
        case "sql_query_node":
            nodeobj = SqlQueryNode(node)
        case "data_mapping_node":
            nodeobj = DataMappingNode(node)
        case _:
            logging.error("ERR: Unknown Node"+node["type"])
            logging.error(tb.StackSummary())
    return nodeobj
