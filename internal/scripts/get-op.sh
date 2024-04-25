#!/usr/bin/env bash
# get 1password item
set -o nounset
set -o errexit

# inputs
[ -z "${OP_VAULT_NAME}" ] && echo 'FATAL ${OP_VAULT_NAME} is required' && exit 1
ENV_NAME=${ENV_NAME:-local}
OVERWRITE=${OVERWRITE:-false}

# echo ENV_NAME=$ENV_NAME

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
DOTENV_NAME=.env.$ENV_NAME.yml
DOTENV_PATH=$GIT_BASE_DIR/$DOTENV_NAME
CACHE_PATH=$GIT_BASE_DIR/cache/op
CACHE_DOTENV_PATH=$CACHE_PATH/$DOTENV_NAME

# get latest for comparison
op read --no-newline op://$OP_VAULT_NAME/$DOTENV_NAME/notesPlain --out-file $CACHE_DOTENV_PATH --force | sed -e "s#$GIT_BASE_DIR/##g"

if [ ! -s $CACHE_DOTENV_PATH ]; then 
    echo ERROR empty/failed $CACHE_DOTENV_PATH
    exit 1
fi

if [ $OVERWRITE = true ] || [ ! -f $DOTENV_PATH ]; then
    echo ALERT: OVERWRITE $DOTENV_NAME
    cp $CACHE_DOTENV_PATH $DOTENV_PATH
    exit 0
fi

# accept non successful exit code where files differ
set +o errexit

if diff -q --ignore-space-change --ignore-blank-lines --ignore-all-space $CACHE_DOTENV_PATH $DOTENV_PATH > /dev/null; then 
    echo INFO: no diff
else
    echo INFO: diff
    diff -q --ignore-space-change --ignore-blank-lines --ignore-all-space $CACHE_DOTENV_PATH $DOTENV_PATH | sed -e "s#$GIT_BASE_DIR/##g"
    diff $CACHE_DOTENV_PATH $DOTENV_PATH
    code --diff $CACHE_DOTENV_PATH $DOTENV_PATH
fi