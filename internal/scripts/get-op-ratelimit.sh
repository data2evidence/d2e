#!/usr/bin/env bash
# get 1password ratelimit
set -o pipefail

# [ -z "${GITHUB_JOB}" ] && echo FATAL GITHUB_JOB is not set # && exit 1
# [ -z "${GITHUB_RUN_ID}" ] && echo FATAL GITHUB_RUN_ID is not set # && exit 1
export OP_FORMAT=json
# export OP_FORMAT=human-readable

if [ -z "${GITHUB_JOB}" ]; then 
	PREFIX=private
else
	DATETIME_STAMP=$(date -I)
	PREFIX=${DATETIME_STAMP}_${GITHUB_JOB}_${GITHUB_RUN_ID}
fi
START_JSON=${PREFIX}-start.json
END_JSON=${PREFIX}-end.json

op service-account ratelimit 

if [ ! -e ${START_JSON} ]; then 
	echo . set $START_JSON
	op service-account ratelimit | tee $START_JSON | yq -o tsv
else
	echo . set $END_JSON
	op service-account ratelimit | tee $END_JSON | yq -o tsv
	cat $START_JSON | yq '.[] | .type + "_" + .action + "_used_start=" + .used'
	cat $START_JSON | yq '.[] | .type + "_" + .action + "_remaining_start=" + .remaining'
	cat $START_JSON | yq -o=shell | sed -e 's/^_//' -e 's/=/_start=/' > $START_JSON.env
	cat $END_JSON | yq -o=shell | sed -e 's/^_//' -e 's/=/_end=/' > $END_JSON.env
	source $START_JSON.env
	source $END_JSON.env
	echo token_read $(( $1_used_start - $1_used_end ))
	echo account_read_write $(( $2_used_start - $2_used_end ))
fi

# echo $GITHUB_CONTEXT | yq '.job'
exit 0