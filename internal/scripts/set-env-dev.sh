#!/usr/bin/env bash
# add developer system specific env-vars
# set -o nounset
# set -o errexit

# inputs
ENV_TYPE=${ENV_TYPE:-local}
RELATIVE_PATH__PLUGINS_REPO=${RELATIVE_PATH__PLUGINS_REPO:-../d2e-plugins}
RELATIVE_PATH__UI_REPO=${RELATIVE_PATH__UI_REPO:-../d2e-ui}

# validate
[ $ENV_TYPE != local ] && [ $ENV_TYPE != remote ] && echo FATAL: ENV_TYPE=local|remote && exit 1

# vars
export GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
DOTENV_FILE_OUT=.env.$ENV_TYPE

# \n at the end of the file only if it doesn’t already end with a newline.
echo >> $DOTENV_FILE_OUT && sed -i.bak '/^$/d' $DOTENV_FILE_OUT # remove empty lines

# remove existing vars from dotenv
for VAR_NAME in GIT__COMMIT_ID__UI GIT__COMMIT_ID__PLUGINS PREFECT_DOCKER_VOLUMES; do sed -E -i.bak "/$VAR_NAME=/d" $DOTENV_FILE_OUT; done

echo . appending to $DOTENV_FILE_OUT ...
echo GIT__COMMIT_ID__PLUGINS=$(git -C ${RELATIVE_PATH__PLUGINS_REPO} rev-parse HEAD || echo main) | tee -a $DOTENV_FILE_OUT
echo GIT__COMMIT_ID__UI=$(git -C $RELATIVE_PATH__UI_REPO rev-parse HEAD || echo develop) | tee -a $DOTENV_FILE_OUT
echo GIT_BASE_DIR=$(git rev-parse --show-toplevel 2> /dev/null) | tee -a $DOTENV_FILE_OUT
echo PREFECT_DOCKER_VOLUMES='["alp_duckdb-data-1:/app/duckdb_data", "alp_cdw-config-duckdb-data-1:/app/cdw-config/duckdb_data", "alp_r-libs:/home/docker/plugins/R/site-library", "alp_fhir-schema-file-1:/home/docker/fhir", "$GIT_BASE_DIR/cache/synpuf1k:/app/synpuf1k", "${GIT_BASE_DIR}/cache/vocab:/app/vocab"]' | envsubst | awk -F= '{print $1"=\047" $2 "\047"}' | tee -a $DOTENV_FILE_OUT
