
import dask.dataframe as dd
from prefect import flow, task, get_run_logger
import pandas as pd
import numpy as np
import rpy2.robjects as ro
from rpy2.robjects import pandas2ri
from nodes.nodes import Result

def get_node_list(graph):
    nodes = {}
    sorted_nodes = []
    for node in graph["nodes"].keys():
        nodes[node] = set()
    for edge in graph["edges"].values():
        if edge["target"] in nodes.keys():
            nodes[edge["target"]].add(edge["source"])
    while nodes:
        for node in nodes.keys():
            if not nodes[node]:
                sorted_nodes.append(node)
                nodes.pop(node)
                break
            else:
                for source_node in nodes[node].copy():
                    if source_node not in nodes:
                        nodes[node].remove(source_node)               
    return sorted_nodes

def get_incoming_edges(graph, nodes, nodename):
    connected_nodes = {}
    for edge in graph["edges"].values():
        if edge["target"] == nodename:
            connected_nodes[edge["source"]] = nodes[edge["source"]]
    return connected_nodes

def convert_py_to_R(python_obj):
    # Convert python object into rpy2 robject
    if python_obj is None:
        return ro.r("NULL")
    elif isinstance(python_obj, dd.DataFrame):
        dd_to_pd_df = python_obj.compute()
        return convert_py_to_R(dd_to_pd_df)
    elif isinstance(python_obj, pd.DataFrame):
        with (ro.default_converter + pandas2ri.converter).context():
            r_df = ro.conversion.get_conversion().py2rpy(python_obj)
        return r_df
    elif isinstance(python_obj, np.ndarray):
        return ro.FloatVector(python_obj)
    elif isinstance(python_obj, (list, tuple, set, pd.Index)):
        if len(python_obj) == 0:
            return ro.r("list()")
        if isinstance(python_obj[0], float):
            return ro.FloatVector(python_obj)
        if isinstance(python_obj[0], int):
            return ro.IntVector(python_obj)
        return ro.StrVector(python_obj)
    elif isinstance(python_obj, (pd.Series)):
        return convert_py_to_R(dict(python_obj))
    elif isinstance(python_obj, dict):
        temp = {k: convert_py_to_R(v.data) for k, v in python_obj.items()
                if v.data is not None}
        temp = {k: v for k, v in temp.items() if v is not None}
        return ro.ListVector(temp)
    else:
        return python_obj

def convert_R_to_py(r_obj, name=""):
    result = r_obj
    remove_list = True
    if r_obj == ro.vectors.NULL:
        return None
    elif isinstance(r_obj, ro.vectors.DataFrame):
        with (ro.default_converter + pandas2ri.converter).context():
            pd_df = ro.conversion.get_conversion().rpy2py(r_obj)
            return pd_df
    elif isinstance(r_obj, (ro.vectors.StrVector,
                           ro.vectors.FloatVector,
                           ro.vectors.BoolVector,
                           ro.vectors.IntVector)):
        result = ro.conversion.get_conversion().rpy2py(r_obj[0])
        return result
    elif isinstance(r_obj, ro.vectors.ListVector):
        if r_obj.names == ro.vectors.NULL:
            if '__len__' in result.__dir__() and len(result) == 1 and remove_list:
                return convert_R_to_py(result[0])
        else:
            result = {}
            remove_list = False
            if len(r_obj) > 0:
                result = dict(zip(r_obj.names, list(r_obj)))
                for k, v in result.items():
                    result[k] = convert_R_to_py(v, name=k)
            return result

def serialize_result_to_json(result: Result):
    return serialize_to_json(result.data)

def serialize_to_json(data):
    if isinstance(data, dd.DataFrame):
        dd_to_pd_df = data.compute()
        json_df = dd_to_pd_df.to_json(orient="records")
        return json_df
    elif isinstance(data, pd.DataFrame):
        json_df = data.to_json(orient="records", default_handler=str)
        return json_df
    elif isinstance(data, dict):
        for key, value in data.items():
            if isinstance(data[key], dd.DataFrame) or isinstance(data[key], pd.DataFrame):
                data[key] = serialize_to_json(value)
        return data
    else:
        return data


def get_scheduler_address(graph):
    scheduler_host = graph["executor_options"]["executor_address"]["host"]
    scheduler_port = graph["executor_options"]["executor_address"]["port"]
    ssl = graph["executor_options"]["executor_address"]["ssl"]
    if ssl:
        return "https://" + scheduler_host + ":" + scheduler_port
    else:
        return "http://" + scheduler_host + ":" + scheduler_port