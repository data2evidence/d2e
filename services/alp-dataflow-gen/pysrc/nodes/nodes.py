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
import rpy2.robjects as robjects
from rpy2.robjects import conversion, default_converter, pandas2ri
from rpy2.robjects.packages import importr
import alpconnection.dbutils as dbutils
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
            r_inst = robjects.r(self.r_code)
            r_test_exec = robjects.globalenv['test_exec']
            global_params = {"r_test_exec": r_test_exec, "convert_R_to_py": convert_R_to_py,
                             "myinput": convert_py_to_R(_input), "output": {}}
            e = exec(
                f'output = convert_R_to_py(r_test_exec(myinput))', global_params)
        output = global_params["output"]
        return output

    def task(self, _input, task_run_context):
        try:
            with conversion.localconverter(default_converter):
                r_inst = robjects.r(self.r_code)
                r_exec = robjects.globalenv['exec']
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
        case "cohort_diagnostics_module_spec":
            nodeobj = CohortDiagnosticsModuleSpecNode(node)
        case "cohort_generator_node":
            nodeobj = CohortGeneratorSpecNode(node)
        case "characterization_node":
            nodeobj = CharacterizationNode(node)
        case "negative_control_outcome_cohort_node":
            nodeobj = NegativeControlOutcomeCohort(node)
        case "target_comparator_outcomes_node":
            nodeobj = TargetComparatorOutcomes(node)
        case "cohort_method_analysis_node":
            nodeobj = CohortMethodAnalysisNode(node)
        case "covariate_settings_node":
            nodeobj = DefaultCovariateSettingsNode(node)
        case "study_population_settings_node":
            nodeobj = StudyPopulationArgs(node)
        # TODO: CohortMethodModuleSpec, 
        # CalendarCovariateSettingsNode, SeasonalityCovariateSettingsNode
        case _:
            logging.error("ERR: Unknown Node "+node["type"])
            logging.error(tb.StackSummary())
    return nodeobj

class NegativeControlOutcomeCohort:

    def __init__(self, _node):
        self.occurenceType = _node["occurenceType"]
        self.detectOnDescendants = _node["detectOnDescendants"]

    def test(self, task_run_context):
        # TODO: add implementation
        return None
    
    def task(self, _input, task_run_context):
        rSource = robjects.r['source']
        rSource("https://raw.githubusercontent.com/OHDSI/CohortGeneratorModule/v0.3.0/SettingsFunctions.R")
        # TODO: use _input for ncoCohortSet initialization
        ncoCohortSet = convert_py_to_R(pd.DataFrame({
            # cohort_id,cohort_name,outcome_concept_id
            # columns must be in camelcase
            "cohortId": [],
            "cohortName": [],
            "outcomeConceptId": []
        }))
        try:
            rCreateNegativeControlOutcomeCohortSharedResourceSpecifications = robjects.globalenv['createNegativeControlOutcomeCohortSharedResourceSpecifications']
            rNegativeCoSharedResource = rCreateNegativeControlOutcomeCohortSharedResourceSpecifications(
                negativeControlOutcomeCohortSet = ncoCohortSet, # use _input
                occurrenceType = convert_py_to_R(self.occurenceType),
                detectOnDescendants = convert_py_to_R(self.detectOnDescendants)
            )
            return Result(None, rNegativeCoSharedResource, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

class CharacterizationNode:
    def __init__(self, _node):
        self.targetIds = _node["targetIds"]
        self.outcomeIds = _node["outcomeIds"]
        self.dechallengeStopInterval = _node["dechallengeStopInterval"]
        self.dechallengeEvaluationWindow = _node["dechallengeEvaluationWindow"]
        self.minPriorObservation = _node["minPriorObservation"]
        self.timeAtRisk = {
            "riskWindowStart": _node["riskWindowStart"],
            "startAnchor": _node["startAnchor"],
            "riskWindowEnd": _node["riskWindowEnd"],
            "endAnchor": _node["endAnchor"],
        }

    def test(self, task_run_context):
        # TODO: add implementation
        return None

    def task(self, task_run_context):
        rSource = robjects.r['source']
        pandas2ri.activate()
        try:
            rSource("https://raw.githubusercontent.com/OHDSI/CharacterizationModule/v0.5.0/SettingsFunctions.R")
            rCreateCharacterizationModuleSpecifications = robjects.globalenv['createCharacterizationModuleSpecifications']
            rFeatureExtraction = importr('FeatureExtraction')
            # TODO: may well be an input from other node, to check
            rCovariateSettings = rFeatureExtraction.createDefaultCovariateSettings()
            rCharacterizationSpec = rCreateCharacterizationModuleSpecifications(
                targetIds = convert_py_to_R(self.targetIds), 
                outcomeIds = convert_py_to_R(self.outcomeIds), 
                covariateSettings = rCovariateSettings, 
                dechallengeStopInterval = self.dechallengeStopInterval, 
                dechallengeEvaluationWindow = self.dechallengeEvaluationWindow, 
                timeAtRisk = pandas2ri.py2rpy(pd.DataFrame(self.timeAtRisk)), 
                minPriorObservation = self.minPriorObservation
            )
            return Result(None, rCharacterizationSpec, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)
    
class DefaultCovariateSettingsNode:
    def __init__(self, _node):
        print('DefaultCovariateSettings node created')
        pass
    
    def test():
        # TODO: add implementation
        return None
    
    def task(self, task_run_context):
        try:
            rFeatureExtraction = importr('FeatureExtraction')
            rCovariateSettings = rFeatureExtraction.createDefaultCovariateSettings()
            return Result(None, rCovariateSettings, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

class TargetComparatorOutcomes:

    def __init__(self, _node):
        self.targetId = _node['targetId']
        self.comparatorId = _node['comparatorId']
        self.includedCovariateConceptIds = _node['includedCovariateConceptIds']
        self.excludedCovariateConceptIds = _node['excludedCovariateConceptIds']

    def test(self):
        return None

    def task(self, _input, task_run_context):
        rOutcomes = [v.data for k, v in _input.items()]
        try:
            rCohortMethod = importr('CohortMethod')
            rCreateTargetComparatorOutcomes = rCohortMethod.createTargetComparatorOutcomes(
                targetId = convert_py_to_R(self.targetId),
                comparatorId = convert_py_to_R(self.comparatorId),
                outcomes = rOutcomes,
                excludedCovariateConceptIds = convert_py_to_R(self.excludedCovariateConceptIds),
                includedCovariateConceptIds = convert_py_to_R(self.includedCovariateConceptIds)
            )
            return Result(None, rCreateTargetComparatorOutcomes, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

class TimeAtRiskNode:
    # createTimeAtRiskDef(id = 1, startWith = "start", endWith = "end"),
    # createTimeAtRiskDef(id = 2, startWith = "start", endWith = "start", endOffset = 365)

    def __init__(self, _node):
        self.id = _node["id"]
        self.startWith = _node["startWith"]
        self.endWith = _node["endWith"]
        self.startOffset = _node["get"]("startOffset", 0)
        self.endOffset = _node["get"]("endOffset", 0)
        print("TimeAtRisk Constructor")
        print(json.dumps(_node))

    def task(self, task_run_context):
        rCohortIncidence = importr('CohortIncidence')
        try:
            rTimeAtRisk = rCohortIncidence.createTimeAtRiskDef(
                id = robjects.IntVector([self.id]),
                startWith = self["startWith"],
                endWith = self["endWith"],
                startOffset = robjects.IntVector([self.startOffset]),
                endOffset = robjects.IntVector([self.endOffset])
            )
            return Result(None, rTimeAtRisk, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

class CohortGeneratorSpecNode:
    def __init__(self, _node):
        self.incremental = _node["incremental"] # Ensure boolean
        self.generate_stats = _node["generateStats"] # Ensure boolean

    def task(self, task_run_context):
        rSource = robjects.r['source']
        try: 
            rSource(os.getenv("OHDSI__R_COHORT_GENERATOR_MODULE_SETTINGS_URL"))
            rCreateCohortGeneratorModuleSpecifications = robjects.globalenv['createCohortGeneratorModuleSpecifications']
            rCohortGeneratorModuleSpecifications = rCreateCohortGeneratorModuleSpecifications(convert_py_to_R(self.incremental), convert_py_to_R(self.generate_stats))
            return Result(None, rCohortGeneratorModuleSpecifications, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)
    
    def test():
        return None

class CohortDiagnosticsModuleSpecNode:
    def __init__(self, _node):
        self.runInclusionStatistics = _node["runInclusionStatistics"]
        self.runIncludedSourceConcepts = _node["runIncludedSourceConcepts"]
        self.runOrphanConcepts = _node["runOrphanConcepts"]
        self.runTimeSeries = _node["runTimeSeries"]
        self.runVisitContext = _node["runVisitContext"]
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
            return Result(None, rCohortDiagnosticsSpec, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

class CohortMethodModuleSpecNode:

    def __init__(self, _node):
        # TODO: ensure analysisId and targetId are vectors
        self.analysesToExclude = {
            'analysisId': _node['analysisId'],
            'targetId': _node['targetId']
        }

    def task(self, _input, task_run_context):
        rCreateCohortMethodModuleSpecifications = robjects.globalenv["createCohortMethodModuleSpecifications"]
        # TODO: ensure _input.rCmAnalysisList and _input.rTargetComparatorOutcomesList exist
        try:
            rCohortMethodSpec = rCreateCohortMethodModuleSpecifications(
                cmAnalysisList = _input['rCmAnalysisList'],
                targetComparatorOutcomesList = _input['rTargetComparatorOutcomesList'],
                analysesToExclude = convert_py_to_R(pd.DataFrame(self.analysesToExclude))
            )
            return Result(None, rCohortMethodSpec, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)
    
    def test(self):
        return None

class CohortMethodAnalysisNode:

    # TODO: all other parameters are args
    def __init__(self, _node):
        self.analysisId = _node['analysisId']

    def task(self, _input, task_run_context): 
        # TODO
        return None

class EraCovariateSettings:

    def __init__(self, _node):
        self.label = _node.label
        self.includeEraIds = _node.includeEraIds
        self.excludeEraIds = _node.excludeEraIds
        self.firstOccurrenceOnly = _node.firstOccurrenceOnly
        self.allowRegularization = _node.allowRegularization
        self.stratifyById = _node.stratifyById
        self.start = _node.start
        self.end = _node.end
        self.startAnchor = _node.startAnchor
        self.endAnchor = _node.endAnchor
        self.profileLikelihood = _node.profileLikelihood
        self.exposureOfInterest = _node.exposureOfInterest

    def task(self, _input, task_run_context):
        try:
            rSelfControlledCaseSeries = importr('SelfControlledCaseSeries')
            rCreateEraCovariateSettings = rSelfControlledCaseSeries.createEraCovariateSettings
            rCovarPreExp = rCreateEraCovariateSettings(
                label = convert_py_to_R(self.label),
                includeEraIds = convert_py_to_R(self.includeEraIds),
                excludeEraIds = convert_py_to_R(self.excludeEraIds),
                start = convert_py_to_R(self.start) ,
                end = convert_py_to_R(self.end),
                startAnchor = convert_py_to_R(self.startAnchor) ,
                endAnchor = convert_py_to_R(self.endAnchor),
                firstOccurrenceOnly = convert_py_to_R(self.firstOccurrenceOnly),
                allowRegularization = convert_py_to_R(self.allowRegularization),
                stratifyById = convert_py_to_R(self.stratifyById),
                profileLikelihood = convert_py_to_R(self.profileLikelihood),
                exposureOfInterest = convert_py_to_R(self.exposureOfInterest)
            )
            return Result(None, rCovarPreExp, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

class CalendarCovariateSettingsNode:

    def __init__(self, _node):
        self.calendarTimeKnots = _node['calendarTimeKnots']
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
            return Result(None, rCalendarTimeSettings, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

class SeasonalityCovariateSettingsNode:
    
    def __init__(self, _node):
        self.seasonKnots = _node['seasonKnots']
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
            return Result(None, rSeasonalitySettings, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

class StudyPopulationArgs:
    def __init__(self, _node):
        self.minTimeAtRisk = _node["minTimeAtRisk"]
        self.startAnchor = _node["startAnchor"]
        self.endAnchor = _node["endAnchor"]
        self.riskWindowStart = _node["riskWindowStart"]
        self.riskWindowEnd = _node["riskWindowEnd"]

    def task(self, task_run_context):
        pandas2ri.activate()
        try:
            rPatientLevelPrediction = importr('PatientLevelPrediction')
            rPlpPopulationSettings = rPatientLevelPrediction.createStudyPopulationSettings(
                startAnchor = convert_py_to_R(self.startAnchor),
                riskWindowStart = convert_py_to_R(self.riskWindowStart),
                endAnchor = convert_py_to_R(self.endAnchor),
                riskWindowEnd = convert_py_to_R(self.riskWindowEnd),
                minTimeAtRisk = convert_py_to_R(self.minTimeAtRisk),
            )
            return Result(None, rPlpPopulationSettings, task_run_context)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)

    def test(self):
        return None

class StrategusNode:
    def __init__(self):
        # TODO: add types
        self.sharedResourcesTypes = []
        self.moduleSpecTypes = []
        pass

    def task(self, _input, task_run_context):
        try:
            rStrategus = importr('Strategus')
            rSpec = rStrategus.createEmptyAnalysisSpecifications()
            # TODO: segregate sharedResource and moduleSpec
            inputs = [v.data for k, v in _input.items()]
            for i in range(len(inputs)):
                o = inputs[i]
                if (o.type in self.sharedResourceTypes):
                    rSpec.addSharedResources(o.rNode)
                else:
                    rSpec.addModuleSpecifications(o.rNode)
            # TODO: 
            rExecutionSettings = rStrategus.createCdmExecutionSettings(
                connectionDetailsReference = "eunomia",
                workDatabaseSchema = "main",
                cdmDatabaseSchema = "main"
            )
            rStrategus.execute(analysisSpecifications = rSpec, executionSettings = rExecutionSettings)
        except Exception as e:
            return Result(e, tb.format_exc(), task_run_context)