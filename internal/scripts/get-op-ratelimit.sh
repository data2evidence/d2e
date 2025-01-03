#!/usr/bin/env bash
# get 1password ratelimit
set -o pipefail
echo ${0} ...

# export OP_FORMAT=json
# export OP_FORMAT=human-readable

if [ -z "${GITHUB_JOB}" ]; then
	PREFIX=private
else
	DATETIME_STAMP=$(date -I)
	PREFIX=private-${GITHUB_JOB}_${GITHUB_RUN_ID}
fi
START_YML=${PREFIX}-start.yml
END_YML=${PREFIX}-end.yml
STATS_YML=${PREFIX}-stats.yml
touch $STATS_YML

op service-account ratelimit

if [ ! -e ${START_YML} ]; then
if [ ! -e ${START_YML} ]; then
	echo . set $START_YML
	op --format json service-account ratelimit | yq -P | tee $START_YML
else
	echo . set $END_YML
	op --format json service-account ratelimit | yq -P | tee $END_YML
	export START_YML END_YML
	export WORKFLOW_URL=$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/${GITHUB_RUN_ID}
	# yq '[.[] | with_entries(.key |= "start_" + .)]' $START_YML
	yq -i '.account_reset_mins = (load(env(END_YML)).[2].reset / 60)' $STATS_YML
	yq -i '.account_rw_delta = load(env(END_YML)).[2].used - load(env(START_YML)).[2].used' $STATS_YML
	yq -i '.account_rw_remaining = load(env(END_YML)).[2].remaining' $STATS_YML
	yq -i '.token_rd_delta = load(env(END_YML)).[1].used - load(env(START_YML)).[1].used' $STATS_YML
	yq -i '.token_rd_remaining = load(env(END_YML)).[1].remaining' $STATS_YML
	yq -i '.token_reset_mins = (load(env(END_YML)).[1].reset / 60)' $STATS_YML
	yq -i '.updated = now' $STATS_YML
	yq -i '.workflow_url = env(WORKFLOW_URL)' $STATS_YML
fi