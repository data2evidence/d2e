#!/usr/bin/env bash
# inputs
DB_CODE=${1:-alpdev_pg}
SCHEMA_NAME=${2:-cdmdefault}
CDMVOCAB=${3:-cdmvocab}

docker exec -it alp-dataflow-gen-worker prefect deployment run omop_cdm_plugin/omop_cdm_plugin --param options='{"data_model":"omop5-4","schema_name":'\"${SCHEMA_NAME}\"',"vocab_schema":'\"${CDMVOCAB}\"',"database_code":'\"${DB_CODE}\"',"flow_action_type":"create_seed_schemas_flow"}'