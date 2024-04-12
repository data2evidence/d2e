#!/usr/bin/env bash
# get 1password item
set -o nounset
set -o errexit

# inputs
ENV_NAME=${ENV_NAME:-local}
[ -z "${OP_VAULT_NAME}" ] && echo 'FATAL ${OP_VAULT_NAME} is required' && exit 1
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
OVERWRITE=${OVERWRITE:-false}

# echo ENV_NAME=$ENV_NAME

# vars
DOTENV_FILE=.env.$ENV_NAME.yml
CACHE_DIR=$GIT_BASE_DIR/cache/op; mkdir -p $dir
OP_DOTENV_FILE=$dir/$DOTENV_FILE
echo get $DOTENV_FILE ...

# get
op read op://$OP_VAULT_NAME/$DOTENV_FILE/notesPlain | sed -e '$a\' > $OP_DOTENV_FILE

if [ ! -s $OP_DOTENV_FILE ]; then 
    echo ERROR empty/failed $OP_DOTENV_FILE
    exit 1
fi

if [ $OVERWRITE = true ] || [ ! -f $DOTENV_FILE ]; then
    echo ALERT: OVERWRITE $DOTENV_FILE
    cp $OP_DOTENV_FILE $DOTENV_FILE
    exit 0
fi

# vscode diff if changes
set +o errexit
if diff -q $OP_DOTENV_FILE $DOTENV_FILE; then 
    echo INFO: no diff
else
    echo INFO: diff
    diff $OP_DOTENV_FILE $DOTENV_FILE
    code --diff $OP_DOTENV_FILE $DOTENV_FILE
fi