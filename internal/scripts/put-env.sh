#!/usr/bin/env bash
# put 1password item
set -o nounset
set -o errexit

# inputs
[ -z "${OP_VAULT_NAME}" ] && echo 'FATAL ${OP_VAULT_NAME} is required' && exit 1
ENV_NAME=${ENV_NAME:-local}
OVERWRITE=${OVERWRITE:-false}


# echo ENV_NAME=$ENV_NAME

# vars
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
CACHE_DIR=$GIT_BASE_DIR/cache/op
DOTENV_NAME=.env.$ENV_NAME.yml
DOTENV_PATH=$GIT_BASE_DIR/$DOTENV_NAME
if [ ! -f $DOTENV_PATH ]; then echo FATAL $DOTENV_PATH not found; exit 1; fi
CACHE_DOTENV_PATH=$CACHE_DIR/$DOTENV_NAME

# get latest for comparison
# op item get --vault $OP_VAULT_NAME $DOTENV_NAME --format json > $CACHE_DOTENV_PATH.json
op read --no-newline op://$OP_VAULT_NAME/$DOTENV_NAME/notesPlain --out-file $CACHE_DOTENV_PATH --force | sed -e "s#$GIT_BASE_DIR/##g"

# accept non successful exit code where files differ
set +o errexit

if diff -q --ignore-space-change --ignore-blank-lines --ignore-all-space $CACHE_DOTENV_PATH $DOTENV_PATH > /dev/null; then
    echo INFO: no changes
else
    echo INFO: diff
    diff -q --ignore-space-change --ignore-blank-lines --ignore-all-space $CACHE_DOTENV_PATH $DOTENV_PATH | sed -e "s#$GIT_BASE_DIR/##g"
    diff $CACHE_DOTENV_PATH $DOTENV_PATH
    echo
    code --diff $CACHE_DOTENV_PATH $DOTENV_PATH
    if [ $OVERWRITE != true ]; then
        read -p "Put $DOTENV_NAME [YyNn]? " -n 1 yn
    fi
    echo
    if [ $OVERWRITE = true ] || [[ $yn =~ ^[Yy]$ ]]; then
        yq 'sort_keys(..)' $DOTENV_PATH > $CACHE_DOTENV_PATH
        # op item edit --format json --vault $OP_VAULT_NAME ${DOTENV_NAME} --template=$CACHE_DOTENV_PATH.json
        op item edit --format json --vault $OP_VAULT_NAME ${DOTENV_NAME} "notesPlain[text]=$(cat $CACHE_DOTENV_PATH)" | yq '{"reference": .fields[0].reference, "updated_at": .updated_at}'
    else
        echo INFO skipped
    fi
fi