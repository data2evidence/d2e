#!/usr/bin/env bash
# create flat dotenv yml file
set -o nounset
set -o errexit

# inputs
ENV_NAME=${ENV_NAME:-local}
OVERWRITE=${OVERWRITE:-false}
GIT_BASE_DIR=$(git rev-parse --show-toplevel)

echo ENV_NAME=$ENV_NAME OVERWRITE=$OVERWRITE
[ $ENV_NAME=local ] && ENV_TYPE=local || ENV_TYPE=remote

# vars
DOTENV_YMLS_IN=(.env.base-all.yml .env.base-$ENV_TYPE.yml .env.$ENV_NAME.yml)
DOTENV_YML_OUT=$GIT_BASE_DIR/.env.$ENV_NAME.yml
DOTENV_KEYS_OUT=$GIT_BASE_DIR/.env.$ENV_NAME.keys
CACHE_PATH=$GIT_BASE_DIR/cache/op

cd $GIT_BASE_DIR
[ $OVERWRITE = false ] && [ -f $DOTENV_YML_OUT ] && echo "INFO DOTENV_YML_OUT:$DOTENV_YML_OUT exists already" && exit 1

# functions
function merge-yml () {
    # https://mikefarah.gitbook.io/yq/operators/reduce#merge-all-yaml-files-together
    yq eval-all '. as $item ireduce ({}; . * $item ) | sort_keys(..)' ${@}
}

# action - merge relevant cache env yml to flat yml in git_dir
cd $CACHE_PATH
for file in ${DOTENV_YMLS_IN[@]}; do touch $file; done
echo "# $DOTENV_YML_OUT" > $DOTENV_YML_OUT
merge-yml ${DOTENV_YMLS_IN[@]} | sed '/^# .env/ d' >> $DOTENV_YML_OUT
yq 'keys | sort | .[]' $DOTENV_YML_OUT > $DOTENV_KEYS_OUT

echo INFO created $DOTENV_YML_OUT
wc -l $DOTENV_KEYS_OUT