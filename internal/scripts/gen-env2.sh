#!/usr/bin/env bash
# generate dotenv file
set -o nounset
set -o errexit
echo ${0} ...

# inputs
ENV_NAME=${ENV_NAME:-local}
ENV_PREFIX=${ENV_PREFIX:-env2}
ENV_TYPE=${ENV_TYPE:-local}
GIT_BASE_DIR=$(git rev-parse --show-toplevel)

echo ENV_NAME=$ENV_NAME
echo ENV_TYPE=$ENV_TYPE

# vars
DOTENV_FILE_OUT=$GIT_BASE_DIR/.${ENV_PREFIX}.$ENV_TYPE
DOTENV_YAML_IN=$GIT_BASE_DIR/.${ENV_PREFIX}.$ENV_NAME.yml

cd $GIT_BASE_DIR

[ ! -e $DOTENV_YAML_IN ] && echo FATAL $DOTENV_YAML_IN missing

# export vars for envsubst
yq -o shell $DOTENV_YAML_IN > .env.tmp; set -a; source .env.tmp; set +a
rm .env.tmp

# generate DOTENV_FILE_OUT
echo "# ${DOTENV_FILE_OUT##*/} $ENV_NAME" > $DOTENV_FILE_OUT
[ ! -z ${GITHUB_REPOSITORY+x} ] && echo "# https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID" >> $DOTENV_FILE_OUT
yq -o sh $DOTENV_YAML_IN | envsubst >> $DOTENV_FILE_OUT
yq 'keys | .[]' $DOTENV_YAML_IN > $DOTENV_FILE_OUT.keys

wc -l $DOTENV_FILE_OUT
$GIT_BASE_DIR/scripts/gen-tls.sh
wc -l $DOTENV_FILE_OUT
$GIT_BASE_DIR/scripts/gen-resource-limits.sh
wc -l $DOTENV_FILE_OUT