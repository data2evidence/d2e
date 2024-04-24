#!/usr/bin/env bash
# get 1password ratelimit

set -o pipefail
OP_FORMAT=json

START_JSON_FILE=private.op-ratelimit-start.json
END_JSON_FILE=private.op-ratelimit-start.json

[ -z "${GITHUB_JOB}" ] && echo FATAL GITHUB_JOB is not set # && exit 1
[ -z "${GITHUB_RUN_ID}" ] && echo FATAL GITHUB_RUN_ID is not set # && exit 1

echo GITHUB_JOB=$GITHUB_JOB
echo GITHUB_RUN_ID=$GITHUB_RUN_ID
DATETIME_STAMP=$(date -I)
PREFIX=${DATETIME_STAMP}_${GITHUB_JOB}_${GITHUB_RUN_ID}
START_JSON=${PREFIX}-start.json
END_JSON=${PREFIX}-end.json

if [ ! -e ${START_JSON} ]; then 
	op service-account ratelimit | tee $START_JSON
else
	op service-account ratelimit | tee $END_JSON
fi

# echo $GITHUB_CONTEXT | yq '.job'

exit 0