#!/usr/bin/env bash
# put 1password item
set -o nounset
set -o errexit

# inputs
ENV_NAME=${ENV_NAME:-local}
OP_VAULT_NAME=$npm_package_config_op_vault_name
OVERWRITE=${OVERWRITE:-false}

echo ENV_NAME=$ENV_NAME

# vars
CACHE_DIR=cache/op
DOTENV_FILE=.env.$ENV_NAME.yml
if [ ! -f $DOTENV_FILE ]; then echo INFO $DOTENV_FILE not found; exit 1; fi

OP_DOTENV_FILE=$CACHE_DIR/${DOTENV_FILE/.yml/.generated.yml}

# get latest for comparison
op read op://$OP_VAULT_NAME/$DOTENV_FILE/notesPlain > $OP_DOTENV_FILE
sed -i.bak -e '$a\' $OP_DOTENV_FILE

# vscode diff if changes
# add newline at end of file, if missing
sed -i.bak -e '$a\' $DOTENV_FILE; rm $DOTENV_FILE.bak
set +o errexit
if diff -q $OP_DOTENV_FILE $DOTENV_FILE; then 
    echo INFO: no changes
else
    # echo INFO: diff
    diff $OP_DOTENV_FILE $DOTENV_FILE
    echo
    code --diff $OP_DOTENV_FILE $DOTENV_FILE
    if [ $OVERWRITE != true ]; then
        read -p "Put $DOTENV_FILE [YyNn]? " -n 1 yn
    fi
    echo
    if [ $OVERWRITE = true ] || [[ $yn =~ ^[Yy]$ ]]; then 
        op item edit --format json --vault $OP_VAULT_NAME ${DOTENV_FILE} "notesPlain[text]=$(cat ${DOTENV_FILE})" | yq '{"reference": .fields[0].reference, "updated_at": .updated_at}'
    else 
        echo INFO skipped
    fi
fi