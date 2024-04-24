#!/usr/bin/env bash
# get 1password ratelimit

set -o pipefail
OP_FORMAT=json

START_JSON_FILE=private.op-ratelimit-start.json
END_JSON_FILE=private.op-ratelimit-start.json

echo GITHUB_JOB=$GITHUB_JOB

[ -z "${GITHUB_JOB}" ] && echo FATAL GITHUB_JOB is not set && exit 1
[ -z "${GITHUB_RUN_ID}" ] && echo FATAL GITHUB_RUN_ID is not set && exit 1

# op service-account ratelimit > 

# echo $GITHUB_CONTEXT | yq '.job'