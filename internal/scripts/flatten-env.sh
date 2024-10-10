#!/usr/bin/env bash
# generate dotenv file
set -o nounset
set -o errexit

# inputs
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
ENV_NAME=${ENV_NAME:-local}
OVERWRITE=${OVERWRITE:-false}

echo ENV_NAME=$ENV_NAME OVERWRITE=$OVERWRITE
[ $ENV_NAME=local ] && ENV_TYPE=local || ENV_TYPE=remote

# vars
DOTENV_YMLS_IN=(.env.base-all.yml .env.base-$ENV_TYPE.yml .env.$ENV_NAME.yml)
DOTENV_YML_OUT=.env2.$ENV_NAME.yml

# action
cd $GIT_BASE_DIR

[ $OVERWRITE = false ] && [ -f $DOTENV_YML_OUT ] && echo "INFO DOTENV_YML_OUT:$DOTENV_YML_OUT exists already" && exit 1

# https://mikefarah.gitbook.io/yq/operators/reduce#merge-all-yaml-files-together
function merge-yml () {
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@}
}

for file in ${DOTENV_YMLS_IN[@]}; do touch $file; done
echo "# $DOTENV_YML_OUT" > $DOTENV_YML_OUT
merge-yml ${DOTENV_YMLS_IN[@]} | sed '/^# .env/ d' >> $DOTENV_YML_OUT
yq 'keys | sort | .[]' $DOTENV_YML_OUT > $DOTENV_YML_OUT.keys
echo INFO created $DOTENV_YML_OUT $DOTENV_YML_OUT.keys