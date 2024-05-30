from prefect.context import TaskRunContext, FlowRunContext
from prefect import flow, task, get_run_logger
import json
from nodes.flowutils import *
from nodes.nodes import generate_nodes_flow

import sys

from sqlalchemy import create_engine, MetaData, insert, Table, text
import traceback
import os
from alpconnection.dbutils import *
from prefect.task_runners import SequentialTaskRunner
from collections import OrderedDict
from prefect_dask import DaskTaskRunner


def execute_subflow_cluster(node_graph, input, test):
    scheduler_address = get_scheduler_address(node_graph)
    executor_type = node_graph["nodeobj"].executor_type

    @flow(task_runner=DaskTaskRunner(cluster_kwargs={"processes": False}), log_prints=True)
    def execute_local_cluster(node_graph, input, test):
       return submit_tasks_to_runner(node_graph, input, test)

    @flow(task_runner=DaskTaskRunner(address=scheduler_address), log_prints=True)
    def execute_kube_cluster(node_graph, input, test):
       return submit_tasks_to_runner(node_graph, input, test)

    @flow(task_runner=DaskTaskRunner(address=scheduler_address), log_prints=True)
    def execute_mpi_cluster(node_graph, input, test):
       return submit_tasks_to_runner(node_graph, input, test)

    def submit_tasks_to_runner(node_graph, input, test):
        subflow_results = OrderedDict()
        count = 0
        for nodename in node_graph["nodeobj"].sorted_nodes:
            # if it is the first node in the subflow
            if count == 0:
                _input = input
            else:
                _input = get_incoming_edges(node_graph["graph"], subflow_results, nodename)

            node = node_graph["graph"]["nodes"][nodename]
            subflow_results[nodename] = execute_node_task.submit(nodename, node["type"], node["nodeobj"], _input, test).result() # Result Obj
            count += 1
        return subflow_results        

    match executor_type:
        case "kubernetes":
            return execute_kube_cluster(node_graph, input, test)
        case "mpi":
            return execute_mpi_cluster(node_graph, input, test)
        case "default":
            return execute_local_cluster(node_graph, input, test)


@flow(name="execute-nodes", flow_run_name="execute-nodes-flowrun", log_prints=True)
def execute_nodes_flow(graph, sorted_nodes, test):
    nodes = {}
    try:
        for nodename in sorted_nodes:
            node = graph["nodes"][nodename]
            _input = get_incoming_edges(graph, nodes, nodename)
            if node["type"] not in [
                "csv_node", 
                "db_reader_node", 
                "sql_node", 
                "python_node", 
                "db_writer_node", 
                "sql_query_node",
                "r_node",
                "data_mapping_node",
                "subflow", 
                "time_at_risk_node",
                "cohort_generator_node",
                "cohort_diagnostic_node",
                "characterization_node", 
                "negative_control_outcome_cohort_node",
                "target_comparator_outcomes_node",
                "cohort_method_analysis_node",
                "default_covariate_settings_node",
                "study_population_settings_node",
                "cohort_incidence_target_cohorts_node",
                "cohort_incidence_node",
                "cohort_definition_set_node",
                "outcomes_node",
                "cohort_method_node",
                "era_covariate_settings_node",
                "seasonality_covariate_settings_node",
                "calendar_time_covariate_settings_node",
                "study_population_settings_node",
                "nco_cohort_set_node",
                "self_controlled_case_series_analysis_node",
                "self_controlled_case_series_node",
                "patient_level_prediction_node",
                "exposure_node",
                "strategus_node"
            ]:
                get_run_logger().error(f"gen.py: execute_nodes: {node['type']} Node Type not known")
            else: 
                if node["type"] == "subflow":
                    # execute as a subflow with runner
                    result_of_subflow = execute_subflow_cluster(node, _input, test)

                    # output of subflow
                    nodes[nodename] = result_of_subflow.popitem(True)[1] # result is an ordered dict

                    # also save results of tasks in subflow
                    for subflow_node in result_of_subflow:
                        nodes[subflow_node] = result_of_subflow[subflow_node]
                else:
                    nodes[nodename] = execute_node_task(nodename, node["type"], node["nodeobj"], _input, test)
    except Exception as e:
        get_run_logger().error(traceback.format_exc())
    return nodes

@task(task_run_name="execute-nodes-taskrun-{nodename}", log_prints=True)
def execute_node_task(nodename, node_type, node, input, test):
    #Get task run context
    task_run_context = TaskRunContext.get().task_run.dict()

    _node = node
    result = None
    if test:
        result = _node.test(task_run_context)
    else:
        match node_type:
            case ('db_reader_node' | 'csv_node' | 'cohort_diagnostic_node' | 'calendar_time_covariate_settings_node' |
                'cohort_generator_node' | 'time_at_risk_node' | 'default_covariate_settings_node' | 
                'study_population_settings_node' | 'cohort_incidence_target_cohorts_node' | 'cohort_definition_set_node' | 
                'era_covariate_settings_node' | 'seasonality_covariate_settings_node' | 'nco_cohort_set_node'):
                result = _node.task(task_run_context)
            case _:
                result = _node.task(input, task_run_context)
    return result


@task(task_run_name="persist-result-taskrun-{nodename}", log_prints=True)
def persist_node_task(nodename, result, trace_db, root_flow_run_id):
    result_json = {}
    result_json["result"] = serialize_to_json(result.data)
    results_db_engine = GetConfigDBConnection()

    with results_db_engine.connect() as connection:
        try:
            metadata = MetaData(schema="dataflow")
            result_table = Table("dataflow_result", metadata, autoload_with=connection, schema="dataflow")
            insert_stmt = insert(result_table).values(
                node_name=nodename,
                flow_run_id=result.flow_run_id, 
                task_run_id=result.task_run_id, 
                root_flow_run_id=root_flow_run_id, 
                task_run_result=result_json, 
                created_by="xyz",
                modified_by="xyz",
                error=True if isinstance(result.error, BaseException) else False,
                error_message=result.data if isinstance(result.error, BaseException) else None
            )
            connection.execute(insert_stmt)
            connection.commit()
        except Exception as e:
            get_run_logger().error(f"Failed to persist results for task run '{result.task_run_name}': {e}")
        else:
            get_run_logger().info(f"Successfully persisted results for task run '{result.task_run_name}'")


@flow(name="persist-results", flow_run_name="persist-results-flowrun", log_prints=True)
def persist_results_flow(nodes, trace, root_flow_run_id):
    get_run_logger().debug(f"To check results nodes: {nodes}")
    try:
        for name in nodes:

            # unpack ordered dict
            if isinstance(nodes[name], OrderedDict):
                ordered_dict_result = nodes[name]
                for node in ordered_dict_result:
                    result = ordered_dict_result[node].data
                    persist_node_task(name, result, trace["trace_db"], root_flow_run_id) # task
            else:
                result = nodes[name]
                persist_node_task(name, result, trace["trace_db"], root_flow_run_id) # task
    except Exception as e:
        get_run_logger().error(e)

def exec_flow(json_graph, options):
   # Grab root flow id
    root_flow_run_context = FlowRunContext.get().flow_run.dict()
    root_flow_run_id = str(root_flow_run_context.get("id"))

    _options = options
    graph = json_graph
    sorted_nodes = get_node_list(graph) # array of nodes that is sorted
    get_run_logger().debug(f"Total number of nodes: {len(sorted_nodes)}")
    nodes_out = {}
    testmode = _options["test_mode"]
    trace_config = _options["trace_config"]
    tracemode = trace_config["trace_mode"]

    # Generate nodes in a subflow
    generated_nodes = generate_nodes_flow(graph, sorted_nodes) # flow

    get_run_logger().debug(f"Graph with nodes: {generated_nodes}")

    # Execute nodes
    n = execute_nodes_flow(generated_nodes, sorted_nodes, testmode) # flow

    # Persist nodes' results in following cases
    # 1. On test mode when trace is enabled
    # 2. Executions in non-test mode
    if((testmode is False) 
       or (testmode is True and tracemode is True)):
        persist_results_flow(n, trace_config, root_flow_run_id)

    if _options["trace_config"]["trace_mode"]:
        for k in n.keys():
            nodes_out[k] = n[k]
    #return json.dumps(nodes_out) # use return if persisting prefect flow results