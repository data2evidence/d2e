#!/usr/bin/env bash
# generate dotenv file
set -o nounset
set -o errexit

# inputs
GIT_BASE_DIR=$(git rev-parse --show-toplevel)
ENV_NAME=${ENV_NAME:-local}
ENV_TYPE=${ENV_TYPE:-local}

echo ENV_NAME=$ENV_NAME
echo ENV_TYPE=$ENV_TYPE

# vars
DOTENV_FILE=$GIT_BASE_DIR/.env.$ENV_TYPE

cd $GIT_BASE_DIR

# https://mikefarah.gitbook.io/yq/operators/reduce#merge-all-yaml-files-together
function merge-yml () {
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@}
}

DOTENV_YMLS=(.env.base-all.yml .env.base-$ENV_TYPE.yml .env.$ENV_NAME.yml)
for file in ${DOTENV_YMLS[@]}; do touch $file; done

DOTENV_YML_OUT=.env2.$ENV_NAME.yml
merge-yml ${DOTENV_YMLS[@]} > $DOTENV_YML_OUT
yq 'keys | sort | .[]' $DOTENV_YML_OUT | tee $DOTENV_FILE_OUT.keys