#!/usr/bin/env bash
# inputs
DB_CODE=${1:-alpdev_pg}
SCHEMA_NAME=${2:-cdmdefault}

docker exec -it alp-dataflow-gen-agent-1 prefect deployment run data-management-plugin/data-management-plugin_deployment --param options='{"data_model":"omop5-4","schema_name":'\"${SCHEMA_NAME}\"',"vocab_schema":"cdmvocab","database_code":'\"${DB_CODE}\"',"flow_action_type":"seed_cdmvocab"}'