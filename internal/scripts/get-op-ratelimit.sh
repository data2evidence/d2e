#!/usr/bin/env bash
# get 1password ratelimit
set -o pipefail

# [ -z "${GITHUB_JOB}" ] && echo FATAL GITHUB_JOB is not set # && exit 1
# [ -z "${GITHUB_RUN_ID}" ] && echo FATAL GITHUB_RUN_ID is not set # && exit 1
export OP_FORMAT=json
export OP_FORMAT=human-readable

if [ -z "${GITHUB_JOB}" ]; then 
	PREFIX=private
else
	DATETIME_STAMP=$(date -I)
	PREFIX=${GITHUB_JOB}_${GITHUB_RUN_ID}
fi
START_JSON=${PREFIX}-start.json
END_JSON=${PREFIX}-end.json

op service-account ratelimit 

if [ ! -e ${START_JSON} ]; then 
	echo . set $START_JSON
	op --format json service-account ratelimit | tee $START_JSON | yq -o tsv
else
	echo . set $END_JSON
	op --format json service-account ratelimit | tee $END_JSON | yq -o tsv
	export START_JSON
	export END_JSON
	yq --null-input '"token_rd_delta=" + load(env(END_JSON)).[1].used - load(env(START_JSON)).[1].used' 
	yq --null-input '"token_reset_mins=" + (load(env(END_JSON)).[1].reset / 60)' 
	yq --null-input '"account_rw_delta=" + load(env(END_JSON)).[2].used - load(env(START_JSON)).[2].used' 
	yq --null-input '"account_reset_mins=" + (load(env(END_JSON)).[2].reset / 60)' 
fi

# echo $GITHUB_CONTEXT | yq '.job'
exit 0