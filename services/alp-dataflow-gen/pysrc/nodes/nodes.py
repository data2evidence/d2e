import dask_sql
import os
from prefect import task, flow
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
from typing import List, Dict
import rpy2.robjects as robjects
from rpy2.robjects import conversion, default_converter, pandas2ri
from rpy2.robjects.packages import importr
import alpconnection.dbutils as dbutils
from utils.types import PG_TENANT_USERS
from flows.dataflow.hooks import *
from functools import partial


class Node:
    def __init__(self, node):
        self.id = node["id"]
        self.type = node["type"]

class Flow(Node):
    def __init__(self, _node):
        self.graph = _node["graph"]
        self.executor_type = _node["executor_options"]["executor_type"]
        self.executor_host = _node["executor_options"]["executor_address"]["host"]
        self.executor_port = _node["executor_options"]["executor_address"]["port"]
        self.ssl = _node["executor_options"]["executor_address"]["ssl"]
        self.sorted_nodes = get_node_list(self.graph)


class Result:
    def __init__(self, error, data, node, task_run_context):
        self.error = error
        self.node = node
        self.data = data
        self.task_run_id = str(task_run_context.get("id"))
        self.task_run_name = str(task_run_context.get("name"))
        self.flow_run_id = str(task_run_context.get("flow_run_id"))


class SqlNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        c = dask_sql.Context()
        self.context = c
        self.tables = _node["tables"]
        self.sql = _node["sql"]

    def task(self, _input: Dict[str, Result], task_run_context):
        try:
            for tablename in self.tables.keys():
                input_element = _input
                for path in self.tables[tablename]:
                    input_element = input_element[path].data
                self.context.create_table(tablename, input_element)
            ddf = self.context.sql(self.sql).compute()
            return Result(None, ddf, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

    def test(self, _input: Dict[str, Result], task_run_context):
        return self.task(_input, task_run_context)


class PythonNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        source_code = _node["python_code"] + '\noutput = exec(myinput)'
        test_source_code = _node["python_code"]+'\noutput = test_exec(myinput)'
        self.code = compile(source_code, '<string>', 'exec')
        self.testcode = compile(test_source_code, '<string>', 'exec')

    def test(self, _input: Dict[str, Result], task_run_context):
        params = {"myinput": _input, "output": {}}
        e = exec(self.testcode, params)
        return params["output"]

    def task(self, _input: Dict[str, Result], task_run_context):
        params = {"myinput": _input, "output": {}}
        try:
            data = exec(self.code, params)
            return Result(None, params["output"], self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class RNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.r_code = ''''''+_node["r_code"]+''''''

    def test(self, _input: Dict[str, Result], task_run_context):
        with conversion.localconverter(default_converter):
            r_inst = robjects.r(self.r_code)
            r_test_exec = robjects.globalenv['test_exec']
            global_params = {"r_test_exec": r_test_exec, "convert_R_to_py": convert_R_to_py,
                             "myinput": convert_py_to_R(_input), "output": {}}
            e = exec(
                f'output = convert_R_to_py(r_test_exec(myinput))', global_params)
        output = global_params["output"]
        return output

    def task(self, _input: Dict[str, Result], task_run_context):
        try:
            with conversion.localconverter(default_converter):
                r_inst = robjects.r(self.r_code)
                r_exec = robjects.globalenv['exec']
                global_params = {"r_exec": r_exec, "convert_R_to_py": convert_R_to_py,
                                 "myinput": convert_py_to_R(_input), "output": {}}
                e = exec(f'output = convert_R_to_py(r_exec(myinput))',
                         global_params)
            output = global_params["output"]
            return Result(None, output, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class CsvNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
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
            return Result(None, ddf, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class DbWriter(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.tablename = _node["dbtablename"]
        self.dbconn = dbutils.GetDBConnection(
            _node["database"], PG_TENANT_USERS.ADMIN_USER)
        self.dataframe = _node["dataframe"]

    def test(self, _input: Dict[str, Result], task_run_context):
        return False

    def task(self, _input: Dict[str, Result], task_run_context):
        input_element = _input
        try:
            for path in self.dataframe:
                input_element = input_element[path].data
            result = input_element.to_sql(
                self.tablename, self.dbconn, if_exists='replace')
            return Result(None, result, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class DbQueryReader(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.sqlquery = _node["sqlquery"]
        self.dbconn = dbutils.GetDBConnection(
            _node["database"], PG_TENANT_USERS.READ_USER)
        self.testdata = {
            "columns": _node["columns"], "data": _node["testdata"]}

    def test(self, task_run_context):
        return Result(None, dd.from_pandas(pd.read_json(json.dumps(self.testdata), self, orient="split"), npartitions=1), task_run_context)

    def task(self, task_run_context):
        # return dd.read_sql_query(sqlalchemy.select(sqlalchemy.text(self.sqlquery)), self.dbconn, self.index_col, divisions=self.divisions)
        try:
            ddf = dd.from_pandas(pd.read_sql_query(
                self.sqlquery, self.dbconn), npartitions=1)
            return Result(None, ddf, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class SqlQueryNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.sqlquery = _node["sqlquery"]
        if "testsqlquery" in _node:
            self.testsqlquery = _node["testsqlquery"]
        else:
            self.testsqlquery = _node["sqlquery"]
        self.params = {}
        self._is_select = _node["is_select"]
        if "params" in _node:
            self.params = _node["params"]
        self.dbconn = dbutils.GetDBConnection(
            _node["database"], PG_TENANT_USERS.ADMIN_USER)

    def _map_input(self, _input):
        _params = {}
        for paramname in self.params.keys():
            input_element = _input
            for path in self.params[paramname]:
                input_element_a = input_element[path].data
            _params[paramname] = input_element_a
        return _params

    def _exec(self, _input: Dict[str, Result], sqlquery):
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

    def test(self, _input: Dict[str, Result], task_run_context):
        return self._exec(_input, self.testsqlquery, task_run_context)

    def task(self, _input: Dict[str, Result], task_run_context):
        try:
            df = self._exec(_input, self.sqlquery)
            return Result(None, df, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


# To do: link up with JSON from UI
class DataMappingNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
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

    def test(self, _input: Dict[str, Result], task_run_context):
        return self.task(_input, task_run_context)

    def task(self, _input: Dict[str, Result], task_run_context):  # executes the retrieved sql query
        try:
            sql_query = self._create_query(_input)
            for table_name in self.source_node_dfs.keys():
                self.context.create_table(
                    table_name, _input[self.source_node_dfs[table_name]].data)
            # temporarily log sql query because no UI
            result_df = self.context.sql(sql_query).compute()
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)
        else:
            return Result(None, result_df, self, task_run_context)


@flow(name="generate-nodes",
      flow_run_name="generate-nodes-flowrun",
      log_prints=True)
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
            node_task_generation_wo = generate_node_task.with_options(
                on_completion=[partial(
                    node_task_generation_hook, **dict(nodename=nodename, nodetype=nodetype))],
                on_failure=[partial(node_task_generation_hook,
                                    **dict(nodename=nodename, nodetype=nodetype))]
            )

            nodeobj = node_task_generation_wo(nodename, node, nodetype)

            graph["nodes"][nodename]["nodeobj"] = nodeobj
    return graph


@task(task_run_name="generate-node-taskrun-{nodename}",
      log_prints=True
      )
def generate_node_task(nodename, node, nodetype):
    nodeobj = None
    # TODO: nodetype to make global variable
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
        case "time_at_risk_node":
            nodeobj = TimeAtRiskNode(node)
        case "cohort_diagnostic_node":
            nodeobj = CohortDiagnosticsModuleSpecNode(node)
        case "cohort_generator_node":
            nodeobj = CohortGeneratorSpecNode(node)
        case "characterization_node":
            nodeobj = CharacterizationModuleSpecNode(node)
        case "negative_control_outcome_cohort_node":
            nodeobj = NegativeControlOutcomeCohortSharedResource(node)
        case "target_comparator_outcomes_node":
            nodeobj = TargetComparatorOutcomes(node)
        case "cohort_method_analysis_node":
            nodeobj = CohortMethodAnalysis(node)
        case "default_covariate_settings_node":
            nodeobj = DefaultCovariateSettingsNode(node)
        case "study_population_settings_node":
            nodeobj = StudyPopulationArgs(node)
        case "cohort_incidence_target_cohorts_node":
            nodeobj = OutcomeDef(node)
        case "cohort_incidence_node":
            nodeobj = CohortIncidenceModuleSpec(node)
        case "cohort_definition_set_node":
            nodeobj = CohortDefinitionSharedResource(node)
        case "outcomes_node":
            nodeobj = CMOutcomes(node)
        case "cohort_method_node":
            nodeobj = CohortMethodModuleSpecNode(node)
        case "era_covariate_settings_node":
            nodeobj = EraCovariateSettings(node)
        case "seasonality_covariate_settings_node":
            nodeobj = SeasonalityCovariateSettingsNode(node)
        case "calendar_time_covariate_settings_node":
            nodeobj = CalendarCovariateSettingsNode(node)
        case "nco_cohort_set_node":
            nodeobj = NegativeControlCohortSet(node)
        case "self_controlled_case_series_analysis_node":
            nodeobj = SCCSAnalysis(node)
        case "self_controlled_case_series_node": 
            nodeobj = SCCSModuleSpec(node)
        case "patient_level_prediction_node":
            nodeobj = PLPModuleSpec(node)
        case "exposure_node":
            nodeobj = ExposuresOutcome(node)
        case "strategus_node":
            nodeobj = StrategusNode(node)
        case _:
            logging.error("ERR: Unknown Node "+node["type"])
            logging.error(tb.StackSummary())
    return nodeobj


class OutcomeDef(Node):
    def __init__(self, node):
        super().__init__(node)
        self.defId = int(node["defId"])
        self.defName = node["defName"]
        self.cohortId = int(node["cohortId"])
        self.cleanWindow = node["cleanWindow"]
    
    def task(self, task_run_context):
        try:
            rCohortIncidence = importr('CohortIncidence')
            rOutcomeDef = rCohortIncidence.createOutcomeDef(
                id = convert_py_to_R(self.defId), 
                name = convert_py_to_R(self.defName), 
                cohortId = convert_py_to_R(self.cohortId), 
                cleanWindow = convert_py_to_R(self.cleanWindow), 
            )
            return Result(None, rOutcomeDef, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class TimeAtRiskNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.id = int(_node["id"])
        self.startWith = _node["startWith"]
        self.endWith = _node["endWith"]
        self.startOffset = _node.get("startOffset", 0)
        self.endOffset = _node.get("endOffset", 0)

    def task(self, task_run_context):
        conversion.set_conversion(default_converter)
        rCohortIncidence = importr('CohortIncidence')
        try:
            rTimeAtRisk = rCohortIncidence.createTimeAtRiskDef(
                id = convert_py_to_R(self.id),
                startWith = self["startWith"],
                endWith = self["endWith"],
                startOffset = convert_py_to_R(self.startOffset),
                endOffset = convert_py_to_R(self.endOffset)
            )
            return Result(None, rTimeAtRisk, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class CohortIncidenceModuleSpec(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.cohortRefs = _node['cohortRefs']
        # remove, values are part of `input` object
        # self.outcomeDef = { "id": 1, "name": "GI bleed", "cohortId": 3, "cleanWindow": 9999 } # convert to list
        self.strataSettings = _node["strataSettings"]
        self.incidenceAnalysis = _node["incidenceAnalysis"]

    def task(self, input: Dict[str, Result], task_run_context):
        pandas2ri.activate()
        try:
            rSource = robjects.r['source']
            rSource('https://raw.githubusercontent.com/OHDSI/CohortIncidenceModule/v0.4.0/SettingsFunctions.R')
            rCohortIncidence = importr('CohortIncidence')
            rTargets = []
            for o in self.cohortRefs:
                rTargets.append(rCohortIncidence.createCohortRef(id = convert_py_to_R(o['id']), name = o['name']))
            rStrataSettings = rCohortIncidence.createStrataSettings(
                byYear = convert_py_to_R(self.strataSettings["byYear"]), 
                byGender = convert_py_to_R(self.strataSettings["byGender"])
            )
            rAnalysis1 = rCohortIncidence.createIncidenceAnalysis(
                targets = convert_py_to_R([int(i) for i in self.incidenceAnalysis["targets"]]), 
                outcomes = convert_py_to_R([int(i) for i in self.incidenceAnalysis["outcomes"]]), 
                tars = convert_py_to_R([int(i) for i in self.incidenceAnalysis["tars"]])
            )
            rOutcomes = [], rTars = []
            rOutcomes = get_results_by_class_type(input, OutcomeDef)
            rTars = get_results_by_class_type(input, TimeAtRiskNode)
            rIncidenceDesign = rCohortIncidence.createIncidenceDesign(
                targetDefs = rTargets,
                outcomeDefs = rOutcomes,
                tars = rTars,
                analysisList = [rAnalysis1], # a list of rAnalyses is possible, for now UI supports just one
                strataSettings = rStrataSettings
            )
            rCreateCohortIncidenceModuleSpecifications = robjects.globalenv["createCohortIncidenceModuleSpecifications"]
            rCohortIncidenceSpec = rCreateCohortIncidenceModuleSpecifications(irDesign = rIncidenceDesign['toList']())
            return Result(None, rCohortIncidenceSpec, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)
        
    def test(self):
        return None


class CharacterizationModuleSpecNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.targetIds = [int(i) for i in _node["targetIds"]]
        self.outcomeIds = [int(i) for i in _node["outcomeIds"]]
        self.dechallengeStopInterval = int(_node["dechallengeStopInterval"])
        self.dechallengeEvaluationWindow = int(_node["dechallengeEvaluationWindow"])
        self.minPriorObservation = _node["minPriorObservation"]
        self.timeAtRisk = _node["timeAtRiskConfigs"]

    def test(self, task_run_context):
        return None

    def task(self, input: Dict[str, Result], task_run_context):
        rSource = robjects.r['source']
        try:
            rSource("https://raw.githubusercontent.com/OHDSI/CharacterizationModule/v0.5.0/SettingsFunctions.R")
            rCreateCharacterizationModuleSpecifications = robjects.globalenv['createCharacterizationModuleSpecifications']
            # ensure rCovariateSettings has at least one value
            rCovariateSettings = get_results_by_class_type(input, DefaultCovariateSettingsNode)
            rCharacterizationSpec = rCreateCharacterizationModuleSpecifications(
                targetIds = convert_py_to_R(self.targetIds), 
                outcomeIds = convert_py_to_R(self.outcomeIds), 
                covariateSettings = rCovariateSettings[0], 
                dechallengeStopInterval = self.dechallengeStopInterval, 
                dechallengeEvaluationWindow = self.dechallengeEvaluationWindow, 
                timeAtRisk = convert_py_to_R(pd.DataFrame(self.timeAtRisk)), 
                minPriorObservation = self.minPriorObservation
            )
            return Result(None, rCharacterizationSpec, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class DefaultCovariateSettingsNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        print('DefaultCovariateSettings node created')
    
    def test():
        return None
    
    def task(self, task_run_context):
        try:
            rFeatureExtraction = importr('FeatureExtraction')
            rCovariateSettings = rFeatureExtraction.createDefaultCovariateSettings()
            return Result(None, rCovariateSettings, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

class CohortDefinitionSharedResource(Node):
    def __init__(self, node):
        super().__init__(node)
    
    def task(self, task_run_context):
        try:
            rCohortGenerator = importr('CohortGenerator')
            rGetCohortDefinitionSet = rCohortGenerator.getCohortDefinitionSet
            # hardcoded to use testdata in Strategus R package
            rCohortDefinitionSet = rGetCohortDefinitionSet(
                settingsFileName = 'testdata/Cohorts.csv',
                jsonFolder = 'testdata/cohorts',
                sqlFolder = 'testdata/sql',
                packageName = 'Strategus'
            )
            rSource = robjects.r['source']
            rSource("https://raw.githubusercontent.com/OHDSI/CohortGeneratorModule/v0.3.0/SettingsFunctions.R")
            rCreateCohortSharedResourceSpecifications = robjects.globalenv['createCohortSharedResourceSpecifications']
            rCohortDefinitionSharedResource = rCreateCohortSharedResourceSpecifications(cohortDefinitionSet = rCohortDefinitionSet)
            return Result(None, rCohortDefinitionSharedResource, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

class NegativeControlOutcomeCohortSharedResource(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.occurenceType = _node["occurenceType"]
        self.detectOnDescendants = _node["detectOnDescendants"]

    def test(self, task_run_context):
        return None
    
    def task(self, _input: Dict[str, Result], task_run_context):
        rSource = robjects.r['source']
        rSource("https://raw.githubusercontent.com/OHDSI/CohortGeneratorModule/v0.3.0/SettingsFunctions.R")
        try:
            # TODO: ensure the length of rNcoCohortSet is at least 1
            rNcoCohortSet = get_results_by_class_type(_input, NegativeControlCohortSet)
            rCreateNegativeControlOutcomeCohortSharedResourceSpecifications = robjects.globalenv['createNegativeControlOutcomeCohortSharedResourceSpecifications']
            rNegativeCoSharedResource = rCreateNegativeControlOutcomeCohortSharedResourceSpecifications(
                negativeControlOutcomeCohortSet = rNcoCohortSet[0],
                occurrenceType = convert_py_to_R(self.occurenceType),
                detectOnDescendants = convert_py_to_R(self.detectOnDescendants)
            )
            return Result(None, rNegativeCoSharedResource, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class CohortGeneratorSpecNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.incremental = _node["incremental"] # Ensure boolean
        self.generate_stats = _node["generateStats"] # Ensure boolean

    def task(self, task_run_context):
        rSource = robjects.r['source']
        try: 
            rSource(os.getenv("OHDSI__R_COHORT_GENERATOR_MODULE_SETTINGS_URL"))
            rCreateCohortGeneratorModuleSpecifications = robjects.globalenv['createCohortGeneratorModuleSpecifications']
            rCohortGeneratorModuleSpecifications = rCreateCohortGeneratorModuleSpecifications(convert_py_to_R(self.incremental), convert_py_to_R(self.generate_stats))
            return Result(None, rCohortGeneratorModuleSpecifications, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)
    
    def test():
        return None


class CohortDiagnosticsModuleSpecNode(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.runInclusionStatistics = _node["runInclusionStatistics"]
        self.runIncludedSourceConcepts = _node["runIncludedSourceConcepts"]
        self.runOrphanConcepts = _node["runOrphanConcepts"]
        self.runTimeSeries = _node["runTimeSeries"]
        self.runVisitContext = _node["runVisistContext"] # TODO: typo runVisistContext, change to runVisitContext
        self.runBreakdownIndexEvents = _node["runBreakdownIndexEvents"]
        self.runIncidenceRate = _node["runIncidenceRate"]
        self.runCohortRelationship = _node["runCohortRelationship"]
        self.runTemporalCohortCharacterization = _node["runTemporalCohortCharacterization"]
        self.incremental = _node["incremental"]

    def task(self, task_run_context):
        rSource = robjects.r['source']
        try:
            rSource(os.getenv("OHDSI__R_COHORT_DIAGNOSTICS_MODULE_SETTINGS_URL"))
            rCreateCohortDiagnosticsModuleSpecifications = robjects.globalenv["createCohortDiagnosticsModuleSpecifications"]
            rCohortDiagnosticsSpec = rCreateCohortDiagnosticsModuleSpecifications(
                runInclusionStatistics = convert_py_to_R(self.runInclusionStatistics),
                runIncludedSourceConcepts = convert_py_to_R(self.runIncludedSourceConcepts),
                runOrphanConcepts = convert_py_to_R(self.runOrphanConcepts),
                runTimeSeries = convert_py_to_R(self.runTimeSeries),
                runVisitContext = convert_py_to_R(self.runVisitContext),
                runBreakdownIndexEvents = convert_py_to_R(self.runBreakdownIndexEvents),
                runIncidenceRate = convert_py_to_R(self.runIncidenceRate),
                runCohortRelationship = convert_py_to_R(self.runCohortRelationship),
                runTemporalCohortCharacterization = convert_py_to_R(self.runTemporalCohortCharacterization),
                incremental = convert_py_to_R(self.incremental)
            )
            return Result(None, rCohortDiagnosticsSpec, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class CMOutcomes(Node):
    def __init__(self, node):
        super().__init__(node)
        self.ncoCohortSetIds = [int(i) for i in node['ncoCohortSetIds']]
        self.config = {
            "trueEffectSize": node["trueEffectSize"],
            "outcomeOfInterest": node["outcomeOfInterest"],
            "priorOutcomeLookback": node["priorOutcomeLookback"]
        }

    def task(self, input: Dict[str, Result], task_run_context):
        pandas2ri.activate()
        try:
            rCohortMethod = importr('CohortMethod')
            rlapply = robjects.r['lapply']
            kwargs = {i[0]: i[1] for i in self.config.items() if (i[1] != "" or i[1] is False)}
            rOutcome = rlapply(
                X = convert_py_to_R(self.ncoCohortSetIds),
                FUN = rCohortMethod.createOutcome,
                **kwargs
            )
            return Result(None, rOutcome, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class TargetComparatorOutcomes(Node):
    
    def __init__(self, _node):
        super().__init__(_node)
        self.targetId = int(_node['targetId'])
        self.comparatorId = int(_node['comparatorId'])
        self.includedCovariateConceptIds = [int(i) for i in _node['includedCovariateConceptIds']]
        self.excludedCovariateConceptIds = [int(i) for i in _node['excludedCovariateConceptIds']]

    def test(self):
        return None

    def task(self, _input: Dict[str, Result], task_run_context):
        try:
            rappend = robjects.r['append']
            rCohortMethod = importr('CohortMethod')
            rOutcomes = get_results_by_class_type(_input, CMOutcomes)
            rCreateTargetComparatorOutcomes = rCohortMethod.createTargetComparatorOutcomes(
                targetId = convert_py_to_R(self.targetId),
                comparatorId = convert_py_to_R(self.comparatorId),
                outcomes = rappend(*rOutcomes), # append all outcomes as one list
                excludedCovariateConceptIds = convert_py_to_R(self.excludedCovariateConceptIds if len(self.excludedCovariateConceptIds) else None), # if excludedCovariateConceptIds is empty list, use None
                includedCovariateConceptIds = convert_py_to_R(self.includedCovariateConceptIds if len(self.includedCovariateConceptIds) else None) # if includedCovariateConceptIds is empty list, use None
            )
            return Result(None, rCreateTargetComparatorOutcomes, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class CohortMethodAnalysis(Node):
    def __init__(self, node):
        super().__init__(node)
        self.analysisId = int(node["analysisId"])
        self.dbCohortMethodDataArgs = node["dbCohortMethodDataArgs"]
        self.fitOutcomeModelArgs = node["fitOutcomeModelArgs"]
        self.psArgs = node["psArgs"]

    def task(self, input: Dict[str, Result], task_run_context):
        try:
            rCohortMethod = importr('CohortMethod')
            rCreateCmAnalysis = rCohortMethod.createCmAnalysis
            rCreateGetDbCohortMethodDataArgs = rCohortMethod.createGetDbCohortMethodDataArgs
            # TODO: ensure rCovarSettings length is at least 1
            rCovarSettings = get_results_by_class_type(input, DefaultCovariateSettingsNode)
            rGetDbCmDataArgs = rCreateGetDbCohortMethodDataArgs(
                washoutPeriod = convert_py_to_R(self.dbCohortMethodDataArgs["washoutPeriod"]),
                firstExposureOnly = convert_py_to_R(self.dbCohortMethodDataArgs["firstExposureOnly"]),
                removeDuplicateSubjects = convert_py_to_R(self.dbCohortMethodDataArgs["removeDuplicateSubjects"]),
                maxCohortSize = convert_py_to_R(self.dbCohortMethodDataArgs["maxCohortSize"]),
                covariateSettings = rCovarSettings[0]
            )
            rFitOutcomeModelArgs = rCohortMethod.createFitOutcomeModelArgs(modelType = convert_py_to_R(self.fitOutcomeModelArgs["modelType"]))
            studyPopulationResults = get_results_by_class_type(input, StudyPopulationArgs)
            # TODO: ensure rCreateStudyPopArgs length is at least 1
            rCreateStudyPopArgs = [r["cohortMethodArgs"] for r in studyPopulationResults if r["cohortMethodArgs"] != None]
            # matchOnPsArgs = matchOnPsArgs,
            # computeSharedCovariateBalanceArgs = computeSharedCovBalArgs,
            # computeCovariateBalanceArgs = computeCovBalArgs,
            # UI does not support above configs, therefore backend also cannot suppor them for now
            rCmAnalysis = rCreateCmAnalysis(
                analysisId = convert_py_to_R(self.analysisId),
                description = "cohort method analysis",
                getDbCohortMethodDataArgs = rGetDbCmDataArgs,
                createStudyPopArgs = rCreateStudyPopArgs[0],
                fitOutcomeModelArgs = rFitOutcomeModelArgs
            )
            return Result(None, rCmAnalysis, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class CohortMethodModuleSpecNode(Node):

    def __init__(self, _node):
        super().__init__(_node)
        self.trueEffectSize = _node["trueEffectSize"]
        self.priorOutcomeLookback = _node["priorOutcomeLookback"]
        self.analysesToExclude = _node["cohortMethodConfigs"]

    def task(self, _input: Dict[str, Result], task_run_context):
        rSource = robjects.r['source']
        rSource('https://raw.githubusercontent.com/OHDSI/CohortMethodModule/v0.3.0/SettingsFunctions.R')
        rCreateCohortMethodModuleSpecifications = robjects.globalenv["createCohortMethodModuleSpecifications"]
        # TODO: ensure rCmAnalysisList and rTargetComparatorOutcomesList are at least of length 1
        rCmAnalysisList = get_results_by_class_type(_input, CohortMethodAnalysis)
        rTargetComparatorOutcomesList = get_results_by_class_type(_input, TargetComparatorOutcomes)
        try:
            rCohortMethodSpec = rCreateCohortMethodModuleSpecifications(
                cmAnalysisList = rCmAnalysisList,
                targetComparatorOutcomesList = rTargetComparatorOutcomesList,
                analysesToExclude = convert_py_to_R(pd.DataFrame(self.analysesToExclude))
            )
            return Result(None, rCohortMethodSpec, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)
    
    def test(self):
        return None


class EraCovariateSettings(Node):

    def __init__(self, _node):
        super().__init__(_node)
        self.label = _node["label"]
        self.includeEraIds = _node["includedEraIds"]
        self.excludeEraIds = _node["excludedEraIds"]
        self.firstOccurrenceOnly = _node["firstOccurenceOnly"]
        self.allowRegularization = _node["allowRegularization"]
        self.stratifyById = _node["stratifyById"]
        self.start = int(_node["start"])
        self.end = int(_node["end"])
        self.startAnchor = _node.get("startAnchor", "era start") # default in the R lib is "era start"
        self.endAnchor = _node.get("endAnchor", "era end") # default in the R lib is "era end"
        self.profileLikelihood = _node["profileLikelihood"]
        self.exposureOfInterest = _node["exposureOfInterest"]

    def task(self, task_run_context):
        try:
            rSelfControlledCaseSeries = importr('SelfControlledCaseSeries')
            rCreateEraCovariateSettings = rSelfControlledCaseSeries.createEraCovariateSettings
            rCovarPreExp = rCreateEraCovariateSettings(
                label = convert_py_to_R(self.label),
                includeEraIds = convert_py_to_R(self.includeEraIds if len(self.includeEraIds) else None),
                excludeEraIds = convert_py_to_R(self.excludeEraIds if len(self.excludeEraIds) else None),
                start = convert_py_to_R(self.start) ,
                end = convert_py_to_R(self.end),
                startAnchor = convert_py_to_R(self.startAnchor if self.startAnchor != "" else "era start") ,
                endAnchor = convert_py_to_R(self.endAnchor if self.endAnchor != "" else "era end"),
                firstOccurrenceOnly = convert_py_to_R(self.firstOccurrenceOnly),
                allowRegularization = convert_py_to_R(self.allowRegularization),
                stratifyById = convert_py_to_R(self.stratifyById),
                profileLikelihood = convert_py_to_R(self.profileLikelihood),
                exposureOfInterest = convert_py_to_R(self.exposureOfInterest)
            )
            return Result(None, rCovarPreExp, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class CalendarCovariateSettingsNode(Node):

    def __init__(self, _node):
        super().__init__(_node)
        self.calendarTimeKnots = _node['caldendarTimeKnots'] # TODO: typo caldendarTimeKnots to calendarTimeKnots
        self.allowRegularization = _node['allowRegularization']
        self.computeConfidenceIntervals = _node['computeConfidenceIntervals']

    def task(self, task_run_context):
        try:
            rSelfControlledCaseSeries = importr('SelfControlledCaseSeries')
            rCreateCalendarTimeCovariateSettings = rSelfControlledCaseSeries.createCalendarTimeCovariateSettings
            rCalendarTimeSettings = rCreateCalendarTimeCovariateSettings(
                calendarTimeKnots = convert_py_to_R(self.calendarTimeKnots),
                allowRegularization = convert_py_to_R(self.allowRegularization),
                computeConfidenceIntervals = convert_py_to_R(self.computeConfidenceIntervals)
            )
            return Result(None, rCalendarTimeSettings, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class SeasonalityCovariateSettingsNode(Node):
    
    def __init__(self, _node):
        super().__init__(_node)
        self.seasonKnots = _node['seasonalityKnots'] # TODO: a typo seasonalityKnots to seasonKnots? 
        self.allowRegularization = _node['allowRegularization']
        self.computeConfidenceIntervals = _node['computeConfidenceIntervals']

    def task(self, task_run_context):
        try:
            rSelfControlledCaseSeries = importr('SelfControlledCaseSeries')
            rCreateSeasonalityCovariateSettings = rSelfControlledCaseSeries.createSeasonalityCovariateSettings
            rSeasonalitySettings = rCreateSeasonalityCovariateSettings(
                seasonKnots = convert_py_to_R(self.seasonKnots),
                allowRegularization = convert_py_to_R(self.allowRegularization),
                computeConfidenceIntervals = convert_py_to_R(self.computeConfidenceIntervals)
            )
            return Result(None, rSeasonalitySettings, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class StudyPopulationArgs(Node):
    def __init__(self, _node):
        super().__init__(_node)
        self.sccsArgs = _node["sccsArgs"]
        self.patientLevelPredictionArgs = _node["patientLevelPredictionArgs"]
        self.cohortMethodArgs = _node["cohortMethodArgs"]

    def task(self, task_run_context):
        pandas2ri.activate()
        try:
            data = {}
            if(self.sccsArgs):
                rSelfControlledCaseSeries = importr('SelfControlledCaseSeries')
                rCreateCreateStudyPopulationArgs = rSelfControlledCaseSeries.createCreateStudyPopulationArgs
                rCreateStudyPopulation6AndOlderArgs = rCreateCreateStudyPopulationArgs(
                    minAge = convert_py_to_R(self.sccsArgs["minAge"]),
                    naivePeriod = convert_py_to_R(self.sccsArgs["naivePeriod"]),
                )
                data.sccsArgs = rCreateStudyPopulation6AndOlderArgs

            rCreateStudyPopArgs = None
            if(self.cohortMethodArgs):
                rCohortMethod = importr('CohortMethod')
                rCreateCreateStudyPopulationArgs = rCohortMethod.createCreateStudyPopulationArgs
                rCreateStudyPopArgs = rCreateCreateStudyPopulationArgs(
                    minDaysAtRisk = convert_py_to_R(self.cohortMethodArgs["minDaysAtRisk"]),
                    riskWindowStart = convert_py_to_R(self.cohortMethodArgs["riskWindowStart"]),
                    startAnchor = convert_py_to_R(self.cohortMethodArgs["startAnchor"]),
                    riskWindowEnd = convert_py_to_R(self.cohortMethodArgs["riskWindowEnd"]),
                    endAnchor = convert_py_to_R(self.cohortMethodArgs["endAnchor"])
                )
                data.cohortMethodArgs = rCreateStudyPopArgs

            rPlpPopulationSettings = None
            if(self.patientLevelPredictionArgs):
                rPatientLevelPrediction = importr('PatientLevelPrediction')
                rPlpPopulationSettings = rPatientLevelPrediction.createStudyPopulationSettings(
                    startAnchor = convert_py_to_R(self.patientLevelPredictionArgs["startAnchor"]),
                    riskWindowStart = convert_py_to_R(self.patientLevelPredictionArgs["riskWindowStart"]),
                    endAnchor = convert_py_to_R(self.patientLevelPredictionArgs["endAnchor"]),
                    riskWindowEnd = convert_py_to_R(self.patientLevelPredictionArgs["riskWindowEnd"]),
                    minTimeAtRisk = convert_py_to_R(self.patientLevelPredictionArgs["minTimeAtRisk"]),
                )
                data.patientLevelPredictionArgs = rPlpPopulationSettings

            return Result(None, data, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

    def test(self):
        return None

class NegativeControlCohortSet(Node):
    def __init__(self, node):
        super().__init__(node)

    def task(self, task_run_context):
        try:
            rCohortGenerator = importr('CohortGenerator')
            rSystemFile = robjects.r['system.file']
            rReadCsv = rCohortGenerator.readCsv
            rFile = rSystemFile('testdata/negative_controls_concept_set.csv', package='Strategus')
            # hardcoded to use testdata in Strategus R package
            rNcoCohortSet = rReadCsv(file=rFile)
            return Result(None, rNcoCohortSet, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

class SCCSAnalysis(Node):
    def __init__(self, node):
        super().__init__(node)
        self.analysisId = node["analysisId"]
        self.dbSccsDataArgs = node['dbSccsDataArgs']
        self.fitSccsModelArgs = node['fitSccsModelArgs']
        self.sccsIntervalDataArgs = node['sccsIntervalDataArgs']

    def task(self, input: Dict[str, Result], task_run_context):
        try:
            rSelfControlledCaseSeries = importr('SelfControlledCaseSeries')
            rCreateSccsAnalysis = rSelfControlledCaseSeries.createSccsAnalysis

            rCreateGetDbSccsDataArgs = rSelfControlledCaseSeries.createGetDbSccsDataArgs
            rGetDbSccsDataArgs = rCreateGetDbSccsDataArgs(
                studyStartDate = convert_py_to_R(self.dbSccsDataArgs['studyStartDate']),
                studyEndDate = convert_py_to_R(self.dbSccsDataArgs['studyEndDate']),
                maxCasesPerOutcome = convert_py_to_R(self.dbSccsDataArgs['maxCasesPerOutcome']),
                useNestingCohort = convert_py_to_R(self.dbSccsDataArgs['useNestingCohort']),
                nestingCohortId = convert_py_to_R(self.dbSccsDataArgs['nestingCohortId']),
                deleteCovariatesSmallCount = convert_py_to_R(self.dbSccsDataArgs['deleteCovariatesSmallCount'])
            )

            studyPopulationResults = get_results_by_class_type(input, StudyPopulationArgs)
            # filter sccsArgs from StudyPopulationResults (as it contains other args)
            rCreateStudyPopulation6AndOlderArgs = [r["sccsArgs"] for r in studyPopulationResults if r["sccsArgs"] != None]

            rCreateCreateSccsIntervalDataArgs = rSelfControlledCaseSeries.createCreateSccsIntervalDataArgs
            rCreateSccsIntervalDataArgs = rCreateCreateSccsIntervalDataArgs(
                eraCovariateSettings = convert_py_to_R(get_results_by_class_type(input, EraCovariateSettings))
            )

            rCreateFitSccsModelArgs = rSelfControlledCaseSeries.createFitSccsModelArgs
            rCyclops = importr('Cyclops')
            rCreateControl = rCyclops.createControl
            rFitSccsModelArgs = rCreateFitSccsModelArgs(
                control = rCreateControl(
                    cvType = convert_py_to_R(self.fitSccsModelArgs["cvType"]),
                    selectorType = convert_py_to_R(self.fitSccsModelArgs["selectorType"]),
                    startingVariance = convert_py_to_R(self.fitSccsModelArgs["startingVariance"]),
                    seed = convert_py_to_R(self.fitSccsModelArgs["seed"]),
                    resetCoefficients = convert_py_to_R(self.fitSccsModelArgs["resetCoefficients"]),
                    noiseLevel = convert_py_to_R(self.fitSccsModelArgs["noiseLevel"])
                )
            )

            rSccsAnalysis = rCreateSccsAnalysis(
                analysisId = self.analysisId,
                description = "SCCS age 18-",
                getDbSccsDataArgs = rGetDbSccsDataArgs,
                createStudyPopulationArgs = rCreateStudyPopulation6AndOlderArgs,
                createIntervalDataArgs = rCreateSccsIntervalDataArgs,
                fitSccsModelArgs = rFitSccsModelArgs
            )            
            return Result(None, rSccsAnalysis, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

class SCCSModuleSpec(Node):
    def __init__(self, node):
        super().__init__(node)
        self.combineDataFetchAcrossOutcomes = node["combineDataFetchAcrossOutcomes"]

    def task(self, input: Dict[str, Result], task_run_context):
        try:
            rSource = robjects.r['source']
            rSource('https://raw.githubusercontent.com/OHDSI/SelfControlledCaseSeriesModule/v0.4.1/SettingsFunctions.R')
            rSccsAnalysisList = get_results_by_class_type(input, SCCSAnalysis)
            rCreatSelfControlledCaseSeriesModuleSpecifications = robjects.globalenv['creatSelfControlledCaseSeriesModuleSpecifications']
            rSccsModuleSpec = rCreatSelfControlledCaseSeriesModuleSpecifications(
                sccsAnalysisList = rSccsAnalysisList,
                exposuresOutcomeList = get_results_by_class_type(input, ExposuresOutcome), 
                combineDataFetchAcrossOutcomes = convert_py_to_R(self.combineDataFetchAcrossOutcomes)
            )
            return Result(None, rSccsModuleSpec, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

class PLPModuleSpec(Node):
    def __init__(self, node):
        super().__init__(node)

    def makeModelDesignSettings(rTargetId, rOutcomeId, rPopSettings, rCovarSettings):
        rPatientLevelPrediction = importr('PatientLevelPrediction')
        rCreateModelDesign = rPatientLevelPrediction.createModelDesign
        rRestrictPlpDataSettings = rPatientLevelPrediction.createRestrictPlpDataSettings()
        rPreprocessSettings = rPatientLevelPrediction.createPreprocessSettings()
        rModelSettings = rPatientLevelPrediction.setLassoLogisticRegression()
        rSplitSettings = rPatientLevelPrediction.createDefaultSplitSetting()
        return rCreateModelDesign(
            targetId = rTargetId,
            outcomeId = rOutcomeId,
            restrictPlpDataSettings = rRestrictPlpDataSettings,
            populationSettings = rPopSettings,
            covariateSettings = rCovarSettings,
            preprocessSettings = rPreprocessSettings,
            modelSettings = rModelSettings,
            splitSettings = rSplitSettings,
            runCovariateSummary = convert_py_to_R(True) # hardcoded, TODO: UI is not yet configuratble on this option
        )

    def task(self, input: Dict[str, Result], task_run_context):
        try:
            rSource = robjects.r['source']
            rSource('https://raw.githubusercontent.com/OHDSI/PatientLevelPredictionModule/v0.3.0/SettingsFunctions.R')
            studyPopulationResults = get_results_by_class_type(input, StudyPopulationArgs)
            # filter patientLevelPredictionArgs from StudyPopulationResults (as it contains other args)
            rPlpPopulationSettings = [r["patientLevelPredictionArgs"] for r in studyPopulationResults if r["patientLevelPredictionArgs"] != None]
            rPlpCovarSettings = get_results_by_class_type(input, DefaultCovariateSettingsNode)
            rModelDesignList = []
            exposureOutcomes = get_input_nodes_by_class_type_from_results(input, ExposuresOutcome)

            for e in exposureOutcomes:
                for i in range(len(e.exposureOfInterestIds)):
                    for j in range(len(e.outcomeOfInterestIds)):
                        rModelDesignSettings = self.makeModelDesignSettings(
                            rTargetId = e.exposureOfInterestIds[i],
                            rOutcomeId = e.outcomeOfInterestIds[j],
                            rPopSettings = rPlpPopulationSettings,
                            rCovarSettings = rPlpCovarSettings
                        )
                        rModelDesignList.append([rModelDesignSettings])

            rCreatePatientLevelPredictionModuleSpecifications = robjects.globalenv['createPatientLevelPredictionModuleSpecifications']
            rPlpModuleSpecifications = rCreatePatientLevelPredictionModuleSpecifications(modelDesignList = rModelDesignList)
            return Result(None, rPlpModuleSpecifications, self, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

class ExposuresOutcome(Node):
    def __init__(self, node):
        super().__init__(node)
        self.outcomeOfInterestIds = node["outcomeOfInterestIds"]
        self.exposureOfInterestIds = node["exposureOfInterestIds"]

    def task(self, input: Dict[str, Result], task_run_context):
        try:
            rSelfControlledCaseSeries = importr('SelfControlledCaseSeries')
            rExposuresOutcomeList = []
            rCreateExposuresOutcome = rSelfControlledCaseSeries.createExposuresOutcome
            rCreateExposure = rSelfControlledCaseSeries.createExposure
            for e in self.exposureOfInterestIds:
                rNegativeControlOutcomeIds = []
                rNcoCohortSets = get_results_by_class_type(input, NegativeControlCohortSet)
                for cohortSet in rNcoCohortSets: 
                    rNegativeControlOutcomeIds.extend(cohortSet.rx('cohortId')[0])
                for o in self.outcomeOfInterestIds:
                    rExposuresOutcomeList[len(rExposuresOutcomeList) + 1] = rCreateExposuresOutcome(
                        outcomeId = o,
                        exposures = [rCreateExposure(exposureId = e)]
                    )
                for rNegativeControlOutcomeId in rNegativeControlOutcomeIds:
                    rExposuresOutcomeList[len(rExposuresOutcomeList) + 1] = rCreateExposuresOutcome(
                        outcomeId = rNegativeControlOutcomeId,
                        exposures = [rCreateExposure(exposureId = self.exposureOfInterestId, trueEffectSize = convert_py_to_R(1))] # hardcoded, TODO: trueEffectSize is not configurable on the UI yet
                    )
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)


class StrategusNode(Node):
    def __init__(self, node):
        super().__init__(node)
        self.sharedResourcesTypes = [CohortDefinitionSharedResource, NegativeControlOutcomeCohortSharedResource] 
        self.moduleSpecTypes = [CohortGeneratorSpecNode, CohortDiagnosticsModuleSpecNode, CohortIncidenceModuleSpec, CharacterizationModuleSpecNode, CohortMethodModuleSpecNode]

    def task(self, _input: Dict[str, Result], task_run_context):
        try:
            rStrategus = importr('Strategus')
            rSpec = rStrategus.createEmptyAnalysisSpecifications()
            for sharedResourceType in self.sharedResourcesTypes:
                sharedResourceResults = get_results_by_class_type(_input, sharedResourceType)
                for sharedResource in sharedResourceResults:
                    rSpec.addSharedResources(sharedResource)

            for moduleSpecType in self.moduleSpecTypes:
                moduleSpecResults = get_results_by_class_type(_input, moduleSpecType)
                for moduleSpec in moduleSpecResults:
                    rSpec.addSharedResources(moduleSpec)

                rSpec.addModuleSpecifications(moduleSpecResults[0])
            get_run_logger().log(rSpec.r_repr())

            # TODO: 
            # rExecutionSettings = rStrategus.createCdmExecutionSettings(
            #     connectionDetailsReference = "eunomia",
            #     workDatabaseSchema = "main",
            #     cdmDatabaseSchema = "main"
            # )
            # rStrategus.execute(analysisSpecifications = rSpec, executionSettings = rExecutionSettings)
        except Exception as e:
            return Result(e, tb.format_exc(), self, task_run_context)

def get_results_by_class_type(results: Dict[str, Result], nodeType: Node):
    return [results[o].data for o in results if not results[o].error and isinstance(results[o].node, nodeType)]

def get_input_nodes_by_class_type_from_results(inputs: Dict[str, Result], nodeType: Node) -> List[Node]:
    return [inputs[o].node for o in inputs if not inputs[o].error and isinstance(inputs[o].node, nodeType)]
