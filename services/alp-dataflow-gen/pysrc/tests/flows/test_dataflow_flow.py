import pytest
from main import execute_dataflow_flow
import alpconnection.dbutils as dbutils
import flows.dataflow.flow as dataflow_flow
from nodes.nodes import DbQueryReader
import nodes.nodes as nodes
import dask.dataframe as dd
import pandas as pd
from utils.types import PG_TENANT_USERS
from prefect.testing.utilities import prefect_test_harness


@pytest.fixture
def setup(monkeypatch):
    monkeypatch.setattr(dbutils, 'GetDBConnection', mock_GetDBConnection)
    monkeypatch.setattr(dataflow_flow, 'persist_results_flow',
                        mock_persist_results_flow)

    # Mock DbQueryReader to run its own test method instead of task
    monkeypatch.setattr(DbQueryReader, 'task', DbQueryReader.test)


def mock_GetDBConnection(db_name, user_type):
    return "_dummy_db_conn"


def mock_persist_results_flow(nodes, trace, root_flow_run_id):
    return "_dummy_persist_results_flow"

@pytest.fixture(autouse=True, scope="session")
def prefect_test_fixture():
    with prefect_test_harness():
        yield

def test_execute_dataflow_flow(setup, mock_dataflow):
    # results object will have 2 items, [generate_nodes_flow, execute_nodes_flow].
    # persist_results_flow is not in results as it is currently being mocked
    results = execute_dataflow_flow(
        mock_dataflow["json_graph"], mock_dataflow["options"])

    # Assert that generate_nodes_flow state is completed
    generate_nodes_flow_results = results[0]
    assert generate_nodes_flow_results.is_completed() == True

    # Assert that generate_nodes_flow state is completed
    execute_nodes_flow_results = results[1]
    assert execute_nodes_flow_results.is_completed() == True

    # Assert person_csv_node
    person_csv_node_result = execute_nodes_flow_results.result()[
        "person_csv_node"].data
    assert isinstance(person_csv_node_result, dd.DataFrame)
    assert len(person_csv_node_result.index) == 5

    # Assert person_sql_node node results
    person_sql_node_result = execute_nodes_flow_results.result()[
        "person_sql_node"].data
    assert isinstance(person_sql_node_result, pd.DataFrame)
    assert len(person_sql_node_result.index) == 5

    # Assert mysql_node node results
    mysql_node_result = execute_nodes_flow_results.result()[
        "mysql_node"].data
    assert isinstance(mysql_node_result, pd.DataFrame)
    assert mysql_node_result.values[0] == 2

    # Assert productsubflow node results
    productsubflow_result = execute_nodes_flow_results.result()[
        "productsubflow"].data
    assert productsubflow_result == 15

    # Assert dbread node results
    dbread_result = execute_nodes_flow_results.result()[
        "dbread"].data
    assert isinstance(dbread_result, dd.DataFrame)
    assert len(dbread_result.compute().index) == 2

    # Assert givethree node results
    givethree_result = execute_nodes_flow_results.result()[
        "givethree"].data
    assert givethree_result == 3

    # Assert givefive node results
    givefive_result = execute_nodes_flow_results.result()[
        "givefive"].data
    assert givefive_result == 5

    # Assert py_node node results
    py_node_result = execute_nodes_flow_results.result()[
        "py_node"].data
    assert isinstance(py_node_result["mysql_node"], nodes.Result)
    assert isinstance(py_node_result["dbread"], nodes.Result)
    assert py_node_result["dbrjson"] == '[{"name":"Mr X","size":111},{"name":"Mr Y","size":333}]'
    assert py_node_result["Hello"] == 'hello world!'

    # Assert my_r_node node results
    my_r_node_result = execute_nodes_flow_results.result()[
        "my_r_node"].data
    assert isinstance(my_r_node_result["person_csv_node"], pd.DataFrame)
    assert len(my_r_node_result["person_csv_node"].index) == 5

    # Assert my_data_mapping node results
    my_data_mapping_result = execute_nodes_flow_results.result()[
        "my_data_mapping"].data
    assert isinstance(my_data_mapping_result, pd.DataFrame)
    assert len(my_data_mapping_result.index) == 2

    # TODO: add tests for [writer_node, sqlquery nodes] nodes, but those requires more mocking / test database + remove mock from DbQueryReader.task after implementing test database
