#!/usr/bin/env bash
# get 1password ratelimit

set -o pipefail
OP_FORMAT=json

START_JSON_FILE=private.op-ratelimit-start.json
END_JSON_FILE=private.op-ratelimit-start.json

op service-account ratelimit > 

echo $GITHUB_CONTEXT | yq '.job'